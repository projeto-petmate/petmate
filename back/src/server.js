const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petmate',
    password: 'senai',
    port: 5432,
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
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

app.post('/usuarios', async (req, res) => {
    const { nome, endereco, email, telefone, senha, cpf } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Este email já está em uso' });
        }

        const result = await pool.query(
            'INSERT INTO usuarios (nome, endereco, email, telefone, senha, cpf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, endereco, email, telefone, senha, cpf]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, endereco, telefone, cpf } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3, endereco = $4, telefone = $5, cpf = $6 WHERE id_usuario = $7 RETURNING *',
            [nome, email, senha, endereco, telefone, cpf, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pets WHERE id_usuario = $1', [id]);

        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário e seus pets deletados com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.json({ message: 'Login bem-sucedido', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});

// CRUD para pets
app.get('/pets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar pets' });
    }
});

app.get('/pets/:id', async (req, res) => {
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

app.post('/pets', async (req, res) => {
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pets (nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar pet' });
    }
});

app.put('/pets/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pets SET nome = $1, idade = $2, raca = $3, descricao = $4, porte = $5, genero = $6, imagem = $7, especie = $8, tags = $9, id_usuario = $10 WHERE id_pet = $11 RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario, id]
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

app.delete('/pets/:id', async (req, res) => {
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


// CRUD para ONGs

// Listar todas as ONGs
app.get('/ongs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ongs');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONGs' });
    }
});

// Buscar uma ONG por ID
app.get('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ongs WHERE id_ong = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONG' });
    }
});

// Criar uma nova ONG
app.post('/ongs', async (req, res) => {
    const {
        nome_ong,
        email,
        senha,
        telefone,
        telefone_denuncia,
        cnpj,
        nome_responsavel,
        cpf_responsavel,
        data_nascimento_responsavel,
        email_responsavel,
        telefone_responsavel,
        estado_ong,
        cidade_ong,
        endereco_ong
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO ongs (
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel, 
                cpf_responsavel, data_nascimento_responsavel, email_responsavel, 
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel,
                cpf_responsavel, data_nascimento_responsavel, email_responsavel,
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar ONG' });
    }
});

// Atualizar uma ONG por ID
app.put('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nome_ong,
        email,
        senha,
        telefone,
        telefone_denuncia,
        cnpj,
        nome_responsavel,
        cpf_responsavel,
        data_nascimento_responsavel,
        email_responsavel,
        telefone_responsavel,
        estado_ong,
        cidade_ong,
        endereco_ong
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE ongs SET 
                nome_ong = $1, email = $2, senha = $3, telefone = $4, telefone_denuncia = $5, 
                cnpj = $6, nome_responsavel = $7, cpf_responsavel = $8, 
                data_nascimento_responsavel = $9, email_responsavel = $10, 
                telefone_responsavel = $11, estado_ong = $12, cidade_ong = $13, 
                endereco_ong = $14 
            WHERE id_ong = $15 RETURNING *`,
            [
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel,
                cpf_responsavel, data_nascimento_responsavel, email_responsavel,
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong, id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar ONG' });
    }
});

// Deletar uma ONG por ID
app.delete('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ongs WHERE id_ong = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json({ message: 'ONG deletada com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao deletar ONG' });
    }
});


// CRUD para Comentários

// Listar todos os comentários
app.get('/comentarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comentarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// Buscar um comentário por ID
app.get('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comentarios WHERE id_comentario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar comentário' });
    }
});

// Criar um novo comentário
app.post('/comentarios', async (req, res) => {
    const { texto, id_usuario } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO comentarios (texto, id_usuario) VALUES ($1, $2) RETURNING *',
            [texto, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
});

// Atualizar um comentário por ID
app.put('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;
    try {
        const result = await pool.query(
            'UPDATE comentarios SET texto = $1 WHERE id_comentario = $2 RETURNING *',
            [texto, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar comentário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
});

// Deletar um comentário por ID
app.delete('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM comentarios WHERE id_comentario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json({ message: 'Comentário deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar comentário:', err.message);
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
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

app.post('/usuarios', async (req, res) => {
    const { nome, endereco, email, telefone, senha, cpf } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Este email já está em uso' });
        }

        const result = await pool.query(
            'INSERT INTO usuarios (nome, endereco, email, telefone, senha, cpf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, endereco, email, telefone, senha, cpf]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, endereco, telefone, cpf } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3, endereco = $4, telefone = $5, cpf = $6 WHERE id_usuario = $7 RETURNING *',
            [nome, email, senha, endereco, telefone, cpf, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM pets WHERE id_usuario = $1', [id]);

        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário e seus pets deletados com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.json({ message: 'Login bem-sucedido', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});

// CRUD para pets
app.get('/pets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pets');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar pets' });
    }
});

app.get('/pets/:id', async (req, res) => {
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

app.post('/pets', async (req, res) => {
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pets (nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar pet' });
    }
});

app.put('/pets/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pets SET nome = $1, idade = $2, raca = $3, descricao = $4, porte = $5, genero = $6, imagem = $7, especie = $8, tags = $9, id_usuario = $10 WHERE id_pet = $11 RETURNING *',
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, id_usuario, id]
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

app.delete('/pets/:id', async (req, res) => {
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


// CRUD para ONGs

// Listar todas as ONGs
app.get('/ongs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ongs');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONGs' });
    }
});

// Buscar uma ONG por ID
app.get('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ongs WHERE id_ong = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONG' });
    }
});

// Criar uma nova ONG
app.post('/ongs', async (req, res) => {
    const {
        nome_ong,
        email,
        senha,
        telefone,
        telefone_denuncia,
        cnpj,
        nome_responsavel,
        cpf_responsavel,
        data_nascimento_responsavel,
        email_responsavel,
        telefone_responsavel,
        estado_ong,
        cidade_ong,
        endereco_ong
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO ongs (
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel, 
                cpf_responsavel, data_nascimento_responsavel, email_responsavel, 
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel,
                cpf_responsavel, data_nascimento_responsavel, email_responsavel,
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar ONG' });
    }
});

// Atualizar uma ONG por ID
app.put('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nome_ong,
        email,
        senha,
        telefone,
        telefone_denuncia,
        cnpj,
        nome_responsavel,
        cpf_responsavel,
        data_nascimento_responsavel,
        email_responsavel,
        telefone_responsavel,
        estado_ong,
        cidade_ong,
        endereco_ong
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE ongs SET 
                nome_ong = $1, email = $2, senha = $3, telefone = $4, telefone_denuncia = $5, 
                cnpj = $6, nome_responsavel = $7, cpf_responsavel = $8, 
                data_nascimento_responsavel = $9, email_responsavel = $10, 
                telefone_responsavel = $11, estado_ong = $12, cidade_ong = $13, 
                endereco_ong = $14 
            WHERE id_ong = $15 RETURNING *`,
            [
                nome_ong, email, senha, telefone, telefone_denuncia, cnpj, nome_responsavel,
                cpf_responsavel, data_nascimento_responsavel, email_responsavel,
                telefone_responsavel, estado_ong, cidade_ong, endereco_ong, id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar ONG' });
    }
});

// Deletar uma ONG por ID
app.delete('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ongs WHERE id_ong = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json({ message: 'ONG deletada com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao deletar ONG' });
    }
});


// CRUD para Comentários

// Listar todos os comentários
app.get('/comentarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comentarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// Buscar um comentário por ID
app.get('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comentarios WHERE id_comentario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar comentário' });
    }
});

// Criar um novo comentário
app.post('/comentarios', async (req, res) => {
    const { texto, id_usuario } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO comentarios (texto, id_usuario) VALUES ($1, $2) RETURNING *',
            [texto, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
});

// Atualizar um comentário por ID
app.put('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;
    try {
        const result = await pool.query(
            'UPDATE comentarios SET texto = $1 WHERE id_comentario = $2 RETURNING *',
            [texto, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar comentário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
});

// Deletar um comentário por ID
app.delete('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM comentarios WHERE id_comentario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json({ message: 'Comentário deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar comentário:', err.message);
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});