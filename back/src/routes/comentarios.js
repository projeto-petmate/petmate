const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // GET - Listar todos os comentários
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT c.id_comentario, c.texto, c.data_criacao, c.foto_user, c.nome_user, 
                       c.id_ong, c.id_usuario, 
                       CASE 
                           WHEN c.id_ong IS NOT NULL THEN 'ong'
                           WHEN c.id_usuario IS NOT NULL THEN 'usuario'
                       END AS tipo
                FROM comentarios c
            `);
            res.json(result.rows);
        } catch (err) {
            console.error('Erro ao listar comentários:', err.message);
            res.status(500).json({ error: 'Erro ao listar comentários' });
        }
    });

    // GET - Buscar comentário por ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query(`
                SELECT c.id_comentario, c.texto, c.data_criacao, c.foto_user, c.nome_user, 
                       c.id_ong, c.id_usuario, 
                       CASE 
                           WHEN c.id_ong IS NOT NULL THEN 'ong'
                           WHEN c.id_usuario IS NOT NULL THEN 'usuario'
                       END AS tipo
                FROM comentarios c
                WHERE c.id_comentario = $1
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Comentário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao buscar comentário:', err.message);
            res.status(500).json({ error: 'Erro ao buscar comentário' });
        }
    });

    // POST - Criar novo comentário
    router.post('/', async (req, res) => {
        const { texto, id_usuario, id_ong } = req.body;

        if (!texto || (!id_usuario && !id_ong)) {
            return res.status(400).json({ error: 'Texto e ID de usuário ou ONG são obrigatórios.' });
        }

        try {
            let nome_user = '';
            let foto_user = null;

            if (id_usuario) {
                const userResult = await pool.query('SELECT nome FROM usuarios WHERE id_usuario = $1', [id_usuario]);
                if (userResult.rows.length === 0) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                nome_user = userResult.rows[0].nome;
            } else if (id_ong) {
                const ongResult = await pool.query('SELECT nome_ong, foto_perfil FROM ongs WHERE id_ong = $1', [id_ong]);
                if (ongResult.rows.length === 0) {
                    return res.status(404).json({ error: 'ONG não encontrada' });
                }
                nome_user = ongResult.rows[0].nome_ong;
                foto_user = ongResult.rows[0].foto_perfil;
            }

            const result = await pool.query(`
                INSERT INTO comentarios (texto, foto_user, nome_user, id_ong, id_usuario) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `, [texto, foto_user, nome_user, id_ong || null, id_usuario || null]);

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar comentário:', err.message);
            res.status(500).json({ error: 'Erro ao criar comentário' });
        }
    });

    // PUT - Atualizar comentário
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: 'Texto é obrigatório.' });
        }

        try {
            const result = await pool.query(`
                UPDATE comentarios 
                SET texto = $1 
                WHERE id_comentario = $2 
                RETURNING *
            `, [texto, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Comentário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar comentário:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar comentário' });
        }
    });

    // DELETE - Deletar comentário
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query('DELETE FROM comentarios WHERE id_comentario = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Comentário não encontrado' });
            }
            res.json({ message: 'Comentário deletado com sucesso', comentario: result.rows[0] });
        } catch (err) {
            console.error('Erro ao deletar comentário:', err.message);
            res.status(500).json({ error: 'Erro ao deletar comentário' });
        }
    });

    return router;
};
