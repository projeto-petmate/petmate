const express = require('express');
const router = express.Router();

module.exports = (pool) => {

    // GET - Listar todos os carrinhos
    router.get('/', async (req, res) => {
    const { id_usuario, id_ong } = req.query;

    try {
        let query = 'SELECT * FROM carrinhos';
        const params = [];

        if (id_usuario) {
            query += ' WHERE id_usuario = $1';
            params.push(id_usuario);
        } else if (id_ong) {
            query += ' WHERE id_ong = $1';
            params.push(id_ong);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar carrinhos:', err.message);
        res.status(500).json({ error: 'Erro ao buscar carrinhos' });
    }
});

    // GET - Buscar um carrinho por ID
    router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM carrinhos WHERE id_carrinho = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
});

    // POST - Criar um novo carrinho
    router.post('/', async (req, res) => {
    const { valor_total, status, id_usuario, id_ong } = req.body;

    if (!id_usuario && !id_ong) {
        return res.status(400).json({ error: 'É necessário informar id_usuario ou id_ong' });
    }

    if (id_usuario && id_ong) {
        return res.status(400).json({ error: 'Um carrinho não pode pertencer a um usuário e a uma ONG ao mesmo tempo' });
    }

    try {
        // Verifica se já existe um carrinho ativo para o usuário/ong
        let query = 'SELECT * FROM carrinhos WHERE status = $1';
        let params = ['ativo'];
        if (id_usuario) {
            query += ' AND id_usuario = $2';
            params.push(id_usuario);
        } else if (id_ong) {
            query += ' AND id_ong = $2';
            params.push(id_ong);
        }
        const existing = await pool.query(query, params);
        if (existing.rows.length > 0) {
            // Já existe carrinho ativo, retorna ele
            return res.status(200).json(existing.rows[0]);
        }
        // Se não existe, cria novo
        const result = await pool.query(
            `INSERT INTO carrinhos (valor_total, status, id_usuario, id_ong) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [valor_total, status || 'ativo', id_usuario || null, id_ong || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar carrinho:', err.message);
        res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
});

    // PUT - Atualizar um carrinho
    router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { valor_total, status, id_usuario, id_ong } = req.body;

    try {
        const result = await pool.query(
            `UPDATE carrinhos SET 
                valor_total = $1, status = $2, id_usuario = $3, id_ong = $4 
            WHERE id_carrinho = $5 RETURNING *`,
            [valor_total, status, id_usuario || null, id_ong || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar carrinho:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar carrinho' });
    }
});

    // DELETE - Deletar um carrinho
    router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // As coleiras serão deletadas automaticamente devido ao ON DELETE CASCADE
        const result = await pool.query('DELETE FROM carrinhos WHERE id_carrinho = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }
        res.json({ message: 'Carrinho deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar carrinho:', err.message);
        res.status(500).json({ error: 'Erro ao deletar carrinho' });
    }
});

    // GET - Buscar carrinho por usuário
    router.get('/usuario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM carrinhos WHERE id_usuario = $1', [id_usuario]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carrinho não encontrado para este usuário' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar carrinho do usuário:', err.message);
        res.status(500).json({ error: 'Erro ao buscar carrinho do usuário' });
    }
});

    // GET - Buscar carrinho por ONG
    router.get('/ong/:id_ong', async (req, res) => {
    const { id_ong } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM carrinhos WHERE id_ong = $1', [id_ong]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carrinho não encontrado para esta ONG' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar carrinho da ONG:', err.message);
        res.status(500).json({ error: 'Erro ao buscar carrinho da ONG' });
    }
});

    return router;
};