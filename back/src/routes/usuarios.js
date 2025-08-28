const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chave_secreta';

module.exports = (pool) => {
    // GET - Listar todos os usuários
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query('SELECT id_usuario, cpf, nome, senha, email, genero, uf, cidade, bairro, telefone, tipo FROM usuarios');
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    });

    // GET - Buscar usuário por ID
    router.get('/id/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    });

    // GET - Verificar email único
    router.get('/verificar-email', async (req, res) => {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'O email é obrigatório.' });
        }

        try {
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            if (result.rows.length > 0) {
                return res.json({ existe: true });
            }
            res.json({ existe: false });
        } catch (err) {
            console.error('Erro ao verificar email:', err.message);
            res.status(500).json({ error: 'Erro ao verificar email.' });
        }
    });

    // GET - Verificar CPF único
    router.get('/verificar-cpf', async (req, res) => {
        const { cpf } = req.query;

        if (!cpf) {
            return res.status(400).json({ error: 'O CPF é obrigatório.' });
        }

        try {
            const result = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);

            if (result.rows.length > 0) {
                return res.json({ existe: true });
            }
            res.json({ existe: false });
        } catch (err) {
            console.error('Erro ao verificar CPF:', err.message);
            res.status(500).json({ error: 'Erro ao verificar CPF' });
        }
    });

    // POST - Criar usuário com carrinho automático
    router.post('/', async (req, res) => {
        const { nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo } = req.body;

        console.log("Dados recebidos no backend:", req.body);
        
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // 1. Criar o usuário
            const userResult = await client.query(
                'INSERT INTO usuarios (nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                [nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo]
            );
            
            const novoUsuario = userResult.rows[0];
            console.log("✅ Usuário criado:", novoUsuario.id_usuario);

            // 2. Criar carrinho para o usuário
            const carrinhoResult = await client.query(
                'INSERT INTO carrinhos (valor_total, status, id_usuario) VALUES ($1, $2, $3) RETURNING *',
                [0.00, 'ativo', novoUsuario.id_usuario]
            );
            
            console.log("🛒 Carrinho criado:", carrinhoResult.rows[0].id_carrinho);

            await client.query('COMMIT');
            
            res.json({
                ...novoUsuario,
                carrinho: carrinhoResult.rows[0]
            });
            
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar usuário e carrinho:', err.message);
            res.status(500).json({ error: 'Erro ao criar usuário e carrinho' });
        } finally {
            client.release();
        }
    });

    // PUT - Atualizar usuário
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
        }

        try {
            const result = await pool.query(
                'UPDATE usuarios SET nome = $1, email = $2, genero = $3, senha = $4, uf = $5, cidade = $6, bairro = $7, telefone = $8, cpf = $9, favoritos = $10, tipo = $11 WHERE id_usuario = $12 RETURNING *',
                [nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }
    });

    // PUT - Atualizar favoritos
    router.put('/:id/favoritos', async (req, res) => {
        const { id } = req.params;
        const { favoritos } = req.body;

        try {
            const result = await pool.query(
                'UPDATE usuarios SET favoritos = $1 WHERE id_usuario = $2 RETURNING *',
                [favoritos, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error.message);
            res.status(500).json({ error: 'Erro ao atualizar favoritos.' });
        }
    });

    // DELETE - Deletar usuário
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.query('DELETE FROM pets WHERE id_usuario = $1', [id]);

            const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Erro ao deletar usuário:', err.message);
            res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    });

    return router;
};
