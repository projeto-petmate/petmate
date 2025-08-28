const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // GET - Listar todas as denúncias
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT d.id_denuncia, d.mensagem, d.motivo, d.tipo_objeto, d.id_objeto, d.status, d.data_criacao,
                       d.id_denunciante, d.id_ong_denunciante, d.tipo_denunciante
                FROM denuncias d
            `);
            res.json(result.rows);
        } catch (err) {
            console.error('Erro ao listar denúncias:', err.message);
            res.status(500).json({ error: 'Erro ao listar denúncias.' });
        }
    });

    // GET - Buscar denúncia por ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const result = await pool.query(`
                SELECT d.id_denuncia, d.mensagem, d.motivo, d.tipo_objeto, d.id_objeto, d.status, d.data_criacao,
                       d.id_denunciante, d.id_ong_denunciante, d.tipo_denunciante
                FROM denuncias d
                WHERE d.id_denuncia = $1
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Denúncia não encontrada.' });
            }

            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao buscar denúncia:', err.message);
            res.status(500).json({ error: 'Erro ao buscar denúncia.' });
        }
    });

    // POST - Criar nova denúncia
    router.post('/', async (req, res) => {
        const { mensagem, motivo, tipo_objeto, id_objeto, id_denunciante, id_ong_denunciante, tipo_denunciante } = req.body;

        // Validação: Campos obrigatórios
        if (!motivo || !tipo_objeto || !id_objeto || !tipo_denunciante) {
            return res.status(400).json({ error: 'Motivo, tipo do objeto, ID do objeto e tipo do denunciante são obrigatórios.' });
        }

        // Validação: Apenas um tipo de denunciante deve ser fornecido
        if (
            (tipo_denunciante === 'usuario' && (!id_denunciante || id_ong_denunciante)) ||
            (tipo_denunciante === 'ong' && (!id_ong_denunciante || id_denunciante))
        ) {
            return res.status(400).json({ error: 'Forneça apenas o ID correspondente ao tipo do denunciante.' });
        }

        try {
            const result = await pool.query(`
                INSERT INTO denuncias (mensagem, motivo, tipo_objeto, id_objeto, id_denunciante, id_ong_denunciante, tipo_denunciante) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *
            `, [
                mensagem,
                motivo,
                tipo_objeto,
                id_objeto,
                id_denunciante || null,
                id_ong_denunciante || null,
                tipo_denunciante
            ]);

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar denúncia:', err.message);
            res.status(500).json({ error: 'Erro ao criar denúncia.' });
        }
    });

    // PUT - Atualizar denúncia
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        // Validação: O status deve ser válido
        if (!['pendente', 'em análise', 'resolvido'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido. Use "pendente", "em análise" ou "resolvido".' });
        }

        try {
            const result = await pool.query(`
                UPDATE denuncias 
                SET status = $1 
                WHERE id_denuncia = $2 
                RETURNING *
            `, [status, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Denúncia não encontrada.' });
            }

            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar denúncia:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar denúncia.' });
        }
    });

    // DELETE - Deletar denúncia
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM denuncias WHERE id_denuncia = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Denúncia não encontrada' });
            }
            res.json({ message: 'Denúncia deletada com sucesso', denuncia: result.rows[0] });
        } catch (err) {
            console.error('Erro ao deletar denúncia:', err.message);
            res.status(500).json({ error: 'Erro ao deletar denúncia' });
        }
    });

    return router;
};
