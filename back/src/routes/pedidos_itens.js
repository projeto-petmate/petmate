const express = require('express');
const router = express.Router();

module.exports = (pool) => {

    // Itens de pedidos finalizados

    // GET - Listar itens de um pedido específico
    router.get('/pedido/:id_pedido', async (req, res) => {
        const { id_pedido } = req.params;
        
        try {
            console.log(`📦 Buscando itens do pedido ${id_pedido}`);
            
            const result = await pool.query(`
                SELECT 
                    pi.*,
                    (pi.valor * pi.quantidade) as subtotal,
                    p.status as status_pedido,
                    p.data_pedido
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_pedido = $1 
                ORDER BY pi.id_item_pedido
            `, [id_pedido]);
            
            console.log(`✅ Encontrados ${result.rows.length} itens no pedido`);
            res.json(result.rows);
        } catch (err) {
            console.error('❌ Erro ao buscar itens do pedido:', err.message);
            res.status(500).json({ error: 'Erro ao buscar itens do pedido' });
        }
    });

    // GET - Buscar item específico por ID
    router.get('/item/:id_item_pedido', async (req, res) => {
        const { id_item_pedido } = req.params;
        
        try {
            console.log(`🔍 Buscando item do pedido ${id_item_pedido}`);
            
            const result = await pool.query(`
                SELECT 
                    pi.*,
                    (pi.valor * pi.quantidade) as subtotal,
                    p.status as status_pedido,
                    p.data_pedido,
                    p.id_usuario,
                    p.id_ong
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_item_pedido = $1
            `, [id_item_pedido]);
            
            if (result.rows.length === 0) {
                console.log(`⚠️ Item do pedido ${id_item_pedido} não encontrado`);
                return res.status(404).json({ error: 'Item do pedido não encontrado' });
            }
            
            console.log(`✅ Item do pedido ${id_item_pedido} encontrado`);
            res.json(result.rows[0]);
        } catch (err) {
            console.error('❌ Erro ao buscar item do pedido:', err.message);
            res.status(500).json({ error: 'Erro ao buscar item do pedido' });
        }
    });

    // PUT - Atualizar status de produção do item
    router.put('/item/:id_item_pedido/status', async (req, res) => {
        const { id_item_pedido } = req.params;
        const { status, observacoes_producao } = req.body;
        
        const statusValidos = ['aguardando_producao', 'em_producao', 'finalizado', 'cancelado'];
        
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido', 
                statusValidos: statusValidos 
            });
        }
        
        try {
            console.log(`🔧 Atualizando status do item ${id_item_pedido} para: ${status}`);
            
            // Preparar campos de data baseado no status
            let camposExtras = '';
            let valoresExtras = [];
            let paramCount = 2;
            
            if (status === 'em_producao') {
                camposExtras = ', data_inicio_producao = CURRENT_TIMESTAMP';
            } else if (status === 'finalizado') {
                camposExtras = ', data_finalizacao = CURRENT_TIMESTAMP';
            }
            
            if (observacoes_producao) {
                camposExtras += `, observacoes_producao = $${++paramCount}`;
                valoresExtras.push(observacoes_producao);
            }
            
            const result = await pool.query(`
                UPDATE pedidos_itens 
                SET status = $1${camposExtras}
                WHERE id_item_pedido = $2
                RETURNING *
            `, [status, id_item_pedido, ...valoresExtras]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Item do pedido não encontrado' });
            }
            
            console.log(`✅ Status do item ${id_item_pedido} atualizado para: ${status}`);
            res.json({
                message: 'Status do item atualizado com sucesso',
                item: result.rows[0]
            });
            
        } catch (err) {
            console.error('❌ Erro ao atualizar status do item:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar status do item' });
        }
    });

    // GET - Listar itens por status de produção
    router.get('/status/:status', async (req, res) => {
        const { status } = req.params;
        const { limite = 50 } = req.query;
        
        const statusValidos = ['aguardando_producao', 'em_producao', 'finalizado', 'cancelado'];
        
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido', 
                statusValidos: statusValidos 
            });
        }
        
        try {
            console.log(`🔍 Buscando itens com status: ${status}`);
            
            const result = await pool.query(`
                SELECT 
                    pi.*,
                    (pi.valor * pi.quantidade) as subtotal,
                    p.status as status_pedido,
                    p.data_pedido,
                    p.id_usuario,
                    p.id_ong
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.status = $1
                ORDER BY 
                    CASE 
                        WHEN pi.status = 'aguardando_producao' THEN pi.id_item_pedido
                        WHEN pi.status = 'em_producao' THEN pi.data_inicio_producao
                        ELSE pi.data_finalizacao
                    END ASC
                LIMIT $2
            `, [status, limite]);
            
            console.log(`✅ Encontrados ${result.rows.length} itens com status: ${status}`);
            res.json(result.rows);
        } catch (err) {
            console.error('❌ Erro ao buscar itens por status:', err.message);
            res.status(500).json({ error: 'Erro ao buscar itens por status' });
        }
    });

    // GET - Dashboard de produção (resumo por status)
    router.get('/dashboard/producao', async (req, res) => {
        try {
            console.log('📊 Gerando dashboard de produção');
            
            const result = await pool.query(`
                SELECT 
                    pi.status,
                    COUNT(pi.id_item_pedido) as quantidade,
                    COALESCE(SUM(pi.valor * pi.quantidade), 0) as valor_total,
                    pi.produto_tipo,
                    COUNT(DISTINCT pi.id_pedido) as pedidos_diferentes
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE p.status NOT IN ('cancelado')
                GROUP BY pi.status, pi.produto_tipo
                ORDER BY 
                    CASE pi.status
                        WHEN 'aguardando_producao' THEN 1
                        WHEN 'em_producao' THEN 2
                        WHEN 'finalizado' THEN 3
                        ELSE 4
                    END,
                    pi.produto_tipo
            `);
            
            // Organizar dados por status
            const dashboard = {
                aguardando_producao: [],
                em_producao: [],
                finalizado: [],
                cancelado: [],
                totais: {
                    itens: 0,
                    valor: 0,
                    pedidos: new Set()
                }
            };
            
            result.rows.forEach(row => {
                if (dashboard[row.status]) {
                    dashboard[row.status].push(row);
                }
                dashboard.totais.itens += parseInt(row.quantidade);
                dashboard.totais.valor += parseFloat(row.valor_total);
                dashboard.totais.pedidos.add(row.pedidos_diferentes);
            });
            
            dashboard.totais.pedidos = dashboard.totais.pedidos.size;
            
            console.log('✅ Dashboard de produção gerado');
            res.json(dashboard);
        } catch (err) {
            console.error('❌ Erro ao gerar dashboard:', err.message);
            res.status(500).json({ error: 'Erro ao gerar dashboard' });
        }
    });

    // GET - Histórico de produção de um item
    router.get('/item/:id_item_pedido/historico', async (req, res) => {
        const { id_item_pedido } = req.params;
        
        try {
            console.log(`📜 Buscando histórico do item ${id_item_pedido}`);
            
            const result = await pool.query(`
                SELECT 
                    pi.*,
                    p.status as status_pedido,
                    p.data_pedido,
                    p.data_confirmacao,
                    EXTRACT(EPOCH FROM (pi.data_finalizacao - pi.data_inicio_producao))/86400 as dias_producao
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_item_pedido = $1
            `, [id_item_pedido]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            const item = result.rows[0];
            
            const timeline = [
                { evento: 'Pedido criado', data: item.data_pedido, status: 'pedido_criado' }
            ];
            
            if (item.data_confirmacao) {
                timeline.push({ evento: 'Pedido confirmado', data: item.data_confirmacao, status: 'pedido_confirmado' });
            }
            
            if (item.data_inicio_producao) {
                timeline.push({ evento: 'Produção iniciada', data: item.data_inicio_producao, status: 'producao_iniciada' });
            }
            
            if (item.data_finalizacao) {
                timeline.push({ evento: 'Produção finalizada', data: item.data_finalizacao, status: 'producao_finalizada' });
            }
            
            console.log(`✅ Histórico do item ${id_item_pedido} obtido`);
            res.json({
                item: item,
                timeline: timeline.sort((a, b) => new Date(a.data) - new Date(b.data))
            });
        } catch (err) {
            console.error('❌ Erro ao buscar histórico:', err.message);
            res.status(500).json({ error: 'Erro ao buscar histórico' });
        }
    });

    // PUT - Atualizar especificações do item (para ajustes de produção)
    router.put('/item/:id_item_pedido/especificacoes', async (req, res) => {
        const { id_item_pedido } = req.params;
        const { especificacoes, observacoes_producao } = req.body;
        
        try {
            console.log(`🔧 Atualizando especificações do item ${id_item_pedido}`);
            
            const result = await pool.query(`
                UPDATE pedidos_itens 
                SET especificacoes = $1,
                    observacoes_producao = COALESCE($2, observacoes_producao)
                WHERE id_item_pedido = $3
                RETURNING *
            `, [JSON.stringify(especificacoes), observacoes_producao, id_item_pedido]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Item do pedido não encontrado' });
            }
            
            console.log(`✅ Especificações do item ${id_item_pedido} atualizadas`);
            res.json({
                message: 'Especificações atualizadas com sucesso',
                item: result.rows[0]
            });
            
        } catch (err) {
            console.error('❌ Erro ao atualizar especificações:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar especificações' });
        }
    });

    return router;
};
