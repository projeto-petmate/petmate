const express = require('express');
const router = express.Router();

module.exports = (pool) => {

    // ===============================================
    // PEDIDOS - Pedidos finalizados
    // ===============================================

    // GET - Listar pedidos com filtros
    router.get('/', async (req, res) => {
        const { id_usuario, id_ong, status, limite = 50 } = req.query;
        
        try {
            console.log('📋 Listando pedidos com filtros:', { id_usuario, id_ong, status });
            
            let query = `
                SELECT 
                    p.*,
                    COUNT(pi.id_item_pedido) as total_itens,
                    COALESCE(SUM(pi.quantidade), 0) as quantidade_total
                FROM pedidos p
                LEFT JOIN pedidos_itens pi ON p.id_pedido = pi.id_pedido
                WHERE 1=1
            `;
            const params = [];
            let paramCount = 0;
            
            if (id_usuario) {
                paramCount++;
                query += ` AND p.id_usuario = $${paramCount}`;
                params.push(id_usuario);
            }
            
            if (id_ong) {
                paramCount++;
                query += ` AND p.id_ong = $${paramCount}`;
                params.push(id_ong);
            }
            
            if (status) {
                paramCount++;
                query += ` AND p.status = $${paramCount}`;
                params.push(status);
            }
            
            query += `
                GROUP BY p.id_pedido
                ORDER BY p.data_pedido DESC
                LIMIT $${paramCount + 1}
            `;
            params.push(limite);
            
            const result = await pool.query(query, params);
            
            console.log(`✅ Encontrados ${result.rows.length} pedidos`);
            res.json(result.rows);
        } catch (err) {
            console.error('❌ Erro ao listar pedidos:', err.message);
            res.status(500).json({ error: 'Erro ao listar pedidos' });
        }
    });

    // GET - Buscar pedido específico por ID
    router.get('/:id_pedido', async (req, res) => {
        const { id_pedido } = req.params;
        
        try {
            console.log(`🔍 Buscando pedido ${id_pedido}`);
            
            const result = await pool.query(`
                SELECT 
                    p.*,
                    COUNT(pi.id_item_pedido) as total_itens,
                    COALESCE(SUM(pi.quantidade), 0) as quantidade_total
                FROM pedidos p
                LEFT JOIN pedidos_itens pi ON p.id_pedido = pi.id_pedido
                WHERE p.id_pedido = $1
                GROUP BY p.id_pedido
            `, [id_pedido]);
            
            if (result.rows.length === 0) {
                console.log(`⚠️ Pedido ${id_pedido} não encontrado`);
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }
            
            console.log(`✅ Pedido ${id_pedido} encontrado`);
            res.json(result.rows[0]);
        } catch (err) {
            console.error('❌ Erro ao buscar pedido:', err.message);
            res.status(500).json({ error: 'Erro ao buscar pedido' });
        }
    });

    // POST - Finalizar carrinho criando pedido
    router.post('/finalizar-carrinho/:id_carrinho', async (req, res) => {
        const { id_carrinho } = req.params;
        const { endereco_entrega, observacoes } = req.body;
        
        try {
            console.log(`🛒➡️📦 Finalizando carrinho ${id_carrinho} em pedido`);
            
            // Iniciar transação
            await pool.query('BEGIN');
            
            // 1. Verificar se carrinho existe e tem itens
            const carrinhoResult = await pool.query(`
                SELECT 
                    c.id_carrinho, c.id_usuario, c.id_ong, c.valor_total,
                    COUNT(ci.id_item) as total_itens
                FROM carrinhos c
                LEFT JOIN carrinho_itens ci ON c.id_carrinho = ci.id_carrinho
                WHERE c.id_carrinho = $1 AND c.status = 'ativo'
                GROUP BY c.id_carrinho, c.id_usuario, c.id_ong, c.valor_total
            `, [id_carrinho]);
            
            if (carrinhoResult.rows.length === 0) {
                await pool.query('ROLLBACK');
                return res.status(404).json({ error: 'Carrinho não encontrado ou já finalizado' });
            }
            
            const carrinho = carrinhoResult.rows[0];
            
            if (carrinho.total_itens === 0) {
                await pool.query('ROLLBACK');
                return res.status(400).json({ error: 'Carrinho está vazio' });
            }
            
            // 2. Criar pedido
            const pedidoResult = await pool.query(`
                INSERT INTO pedidos (id_usuario, id_ong, status, valor_total, endereco_entrega, observacoes)
                VALUES ($1, $2, 'pendente', $3, $4, $5)
                RETURNING *
            `, [carrinho.id_usuario, carrinho.id_ong, carrinho.valor_total, JSON.stringify(endereco_entrega), observacoes]);
            
            const pedido = pedidoResult.rows[0];
            
            // 3. Transferir itens do carrinho para o pedido
            await pool.query(`
                INSERT INTO pedidos_itens (id_pedido, produto_tipo, especificacoes, preco, quantidade)
                SELECT $1, ci.produto_tipo, ci.especificacoes, ci.preco, ci.quantidade
                FROM carrinho_itens ci
                WHERE ci.id_carrinho = $2
            `, [pedido.id_pedido, id_carrinho]);
            
            // 4. Limpar carrinho e marcar como finalizado
            await pool.query('DELETE FROM carrinho_itens WHERE id_carrinho = $1', [id_carrinho]);
            await pool.query(
                `UPDATE carrinhos SET status = 'finalizado', valor_total = 0 WHERE id_carrinho = $1`,
                [id_carrinho]
            );
            
            // Confirmar transação
            await pool.query('COMMIT');
            
            console.log(`✅ Carrinho ${id_carrinho} finalizado como pedido ${pedido.id_pedido}`);
            res.status(201).json({
                message: 'Pedido criado com sucesso',
                pedido: pedido
            });
            
        } catch (err) {
            await pool.query('ROLLBACK');
            console.error('❌ Erro ao finalizar carrinho:', err.message);
            res.status(500).json({ error: 'Erro ao finalizar carrinho' });
        }
    });

    // POST - Criar pedido diretamente (sem carrinho)
    router.post('/', async (req, res) => {
        const { id_usuario, id_ong, endereco_entrega, observacoes, itens } = req.body;
        
        try {
            console.log('📦 Criando pedido direto:', { id_usuario, id_ong, itens: itens?.length });
            
            if (!itens || itens.length === 0) {
                return res.status(400).json({ error: 'Pedido deve ter pelo menos um item' });
            }
            
            // Calcular valor total
            const valor_total = itens.reduce((total, item) => {
                return total + (item.preco * (item.quantidade || 1));
            }, 0);
            
            // Iniciar transação
            await pool.query('BEGIN');
            
            // 1. Criar pedido
            const pedidoResult = await pool.query(`
                INSERT INTO pedidos (id_usuario, id_ong, status, valor_total, endereco_entrega, observacoes)
                VALUES ($1, $2, 'pendente', $3, $4, $5)
                RETURNING *
            `, [id_usuario, id_ong, valor_total, JSON.stringify(endereco_entrega), observacoes]);
            
            const pedido = pedidoResult.rows[0];
            
            // 2. Adicionar itens ao pedido
            for (const item of itens) {
                await pool.query(`
                    INSERT INTO pedidos_itens (id_pedido, produto_tipo, especificacoes, preco, quantidade)
                    VALUES ($1, $2, $3, $4, $5)
                `, [
                    pedido.id_pedido, 
                    item.produto_tipo, 
                    JSON.stringify(item.especificacoes), 
                    item.preco, 
                    item.quantidade || 1
                ]);
            }
            
            // Confirmar transação
            await pool.query('COMMIT');
            
            console.log(`✅ Pedido ${pedido.id_pedido} criado com sucesso`);
            res.status(201).json({
                message: 'Pedido criado com sucesso',
                pedido: pedido
            });
            
        } catch (err) {
            await pool.query('ROLLBACK');
            console.error('❌ Erro ao criar pedido:', err.message);
            res.status(500).json({ error: 'Erro ao criar pedido' });
        }
    });

    // PUT - Atualizar status do pedido
    router.put('/:id_pedido/status', async (req, res) => {
        const { id_pedido } = req.params;
        const { status, codigo_rastreamento } = req.body;
        
        const statusValidos = ['pendente', 'confirmado', 'producao', 'enviado', 'entregue', 'cancelado'];
        
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido', 
                statusValidos: statusValidos 
            });
        }
        
        try {
            console.log(`🔄 Atualizando status do pedido ${id_pedido} para: ${status}`);
            
            // Preparar campos de data baseado no status
            let camposExtras = '';
            let valoresExtras = [];
            let paramCount = 2;
            
            if (status === 'confirmado') {
                camposExtras = ', data_confirmacao = CURRENT_TIMESTAMP';
            } else if (status === 'enviado') {
                camposExtras = ', data_envio = CURRENT_TIMESTAMP';
                if (codigo_rastreamento) {
                    camposExtras += `, codigo_rastreamento = $${++paramCount}`;
                    valoresExtras.push(codigo_rastreamento);
                }
            } else if (status === 'entregue') {
                camposExtras = ', data_entrega = CURRENT_TIMESTAMP';
            }
            
            const result = await pool.query(`
                UPDATE pedidos 
                SET status = $1${camposExtras}
                WHERE id_pedido = $2
                RETURNING *
            `, [status, id_pedido, ...valoresExtras]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }
            
            console.log(`✅ Status do pedido ${id_pedido} atualizado para: ${status}`);
            res.json({
                message: 'Status atualizado com sucesso',
                pedido: result.rows[0]
            });
            
        } catch (err) {
            console.error('❌ Erro ao atualizar status do pedido:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
        }
    });

    // GET - Buscar pedidos por usuário
    router.get('/usuario/:id_usuario', async (req, res) => {
        const { id_usuario } = req.params;
        const { status } = req.query;
        
        try {
            console.log(`👤 Buscando pedidos do usuário ${id_usuario}`);
            
            let query = `
                SELECT 
                    p.*,
                    COUNT(pi.id_item_pedido) as total_itens
                FROM pedidos p
                LEFT JOIN pedidos_itens pi ON p.id_pedido = pi.id_pedido
                WHERE p.id_usuario = $1
            `;
            const params = [id_usuario];
            
            if (status) {
                query += ' AND p.status = $2';
                params.push(status);
            }
            
            query += `
                GROUP BY p.id_pedido
                ORDER BY p.data_pedido DESC
            `;
            
            const result = await pool.query(query, params);
            
            console.log(`✅ Encontrados ${result.rows.length} pedidos do usuário ${id_usuario}`);
            res.json(result.rows);
        } catch (err) {
            console.error('❌ Erro ao buscar pedidos do usuário:', err.message);
            res.status(500).json({ error: 'Erro ao buscar pedidos do usuário' });
        }
    });

    // GET - Buscar pedidos por ONG
    router.get('/ong/:id_ong', async (req, res) => {
        const { id_ong } = req.params;
        const { status } = req.query;
        
        try {
            console.log(`🏢 Buscando pedidos da ONG ${id_ong}`);
            
            let query = `
                SELECT 
                    p.*,
                    COUNT(pi.id_item_pedido) as total_itens
                FROM pedidos p
                LEFT JOIN pedidos_itens pi ON p.id_pedido = pi.id_pedido
                WHERE p.id_ong = $1
            `;
            const params = [id_ong];
            
            if (status) {
                query += ' AND p.status = $2';
                params.push(status);
            }
            
            query += `
                GROUP BY p.id_pedido
                ORDER BY p.data_pedido DESC
            `;
            
            const result = await pool.query(query, params);
            
            console.log(`✅ Encontrados ${result.rows.length} pedidos da ONG ${id_ong}`);
            res.json(result.rows);
        } catch (err) {
            console.error('❌ Erro ao buscar pedidos da ONG:', err.message);
            res.status(500).json({ error: 'Erro ao buscar pedidos da ONG' });
        }
    });

    return router;
};
