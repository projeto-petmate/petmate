const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // GET - Listar pets com filtros opcionais
    router.get('/', async (req, res) => {
        const { id_usuario, id_ong } = req.query;

        try {
            let query = 'SELECT * FROM pets';
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
            console.error('Erro ao buscar pets:', err.message);
            res.status(500).json({ error: 'Erro ao buscar pets' });
        }
    });

    // GET - Buscar pet por ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM pets WHERE id_pet = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pet não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao buscar pet' });
        }
    });

    // POST - Criar novo pet
    router.post('/', async (req, res) => {
        const { nome, idade, raca, descricao, porte, genero, imagens, especie, tags, condicoes, disponivel, id_usuario, id_ong } = req.body;

        if (!id_usuario && !id_ong) {
            return res.status(400).json({ error: 'É necessário informar id_usuario ou id_ong' });
        }

        if (id_usuario && id_ong) {
            return res.status(400).json({ error: 'Um pet não pode pertencer a um usuário e a uma ONG ao mesmo tempo' });
        }

        try {
            const result = await pool.query(
                `INSERT INTO pets (nome, idade, raca, descricao, porte, genero, imagens, especie, tags, condicoes, disponivel, id_usuario, id_ong) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
                [nome, idade, raca, descricao, porte, genero, imagens, especie, tags, condicoes, disponivel, id_usuario || null, id_ong || null]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao criar pet:', err.message);
            res.status(500).json({ error: 'Erro ao criar pet' });
        }
    });

    // PUT - Atualizar pet
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { nome, idade, raca, descricao, porte, genero, imagens, especie, tags, condicoes, disponivel, id_usuario, id_ong } = req.body;

        try {
            const result = await pool.query(
                `UPDATE pets SET 
                    nome = $1, idade = $2, raca = $3, descricao = $4, porte = $5, genero = $6, imagens = $7, 
                    especie = $8, tags = $9, condicoes = $10, disponivel = $11, id_usuario = $12, id_ong = $13 
                WHERE id_pet = $14 RETURNING *`,
                [nome, idade, raca, descricao, porte, genero, imagens, especie, tags, condicoes, disponivel, id_usuario || null, id_ong || null, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pet não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar pet:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar pet' });
        }
    });

    // DELETE - Deletar pet
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM pets WHERE id_pet = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Pet não encontrado' });
            }
            res.json({ message: 'Pet deletado com sucesso' });
        } catch (err) {
            console.error('Erro ao deletar pet:', err.message);
            res.status(500).json({ error: 'Erro ao deletar pet' });
        }
    });

    return router;
};
