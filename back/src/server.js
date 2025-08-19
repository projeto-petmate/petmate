require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const multer = require('multer'); 
const cloudinary = require('./cloudinaryConfig'); 
const upload = multer({ storage: multer.memoryStorage() }); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API PetMate',
            version: '1.0.0',
            description: 'Documentação da API para gerenciar pets, usuários, ONGs e comentários.',
        },
    },
    apis: [path.join(__dirname, 'swaggerDefinitions.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id_usuario, cpf, nome, senha, email, genero, uf, cidade, bairro, telefone, tipo FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.get('/usuarios/id/:id', async (req, res) => {
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

app.get('/users/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        let result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            result = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        }
        if (result.rows.length === 0) {
            return res.json({ exists: false });
        }
        res.json({ exists: true });
    } catch (err) {
        console.error('Erro ao buscar usuário ou ONG:', err.message);
        res.status(500).json({ error: 'Erro ao buscar usuário ou ONG' });
    }
});

app.get('/ongs/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONG.' });
    }
});

app.get('/usuarios/verificar-email', async (req, res) => {
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

app.get('/usuarios/verificar-cpf', async (req, res) => {
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

app.get('/ongs/verificar-cnpj', async (req, res) => {
    const { cnpj } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ongs WHERE cnpj = $1', [cnpj]);
        if (result.rows.length > 0) {
            return res.status(200).json({ exists: true });
        }
        res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Erro ao verificar CNPJ:', error);
        res.status(500).json({ message: 'Erro ao verificar CNPJ.' });
    }
});

//Rotas para usuários
app.post('/usuarios', async (req, res) => {
    const { nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo } = req.body;

    console.log("Dados recebidos no backend:", req.body);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, tipo]
        );
        console.log("Resultado da inserção:", result.rows);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
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

app.delete('/usuarios/:id', async (req, res) => {
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


app.put('/usuarios/:id/favoritos', async (req, res) => {
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

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chave_secreta';

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Login ou senha incorretos' });
        }

        const usuario = result.rows[0];
        //if (usuario.senha !== senha) {
        //    return res.status(401).json({ error: 'Senha incorreta' });
        //}

        const token = jwt.sign({ id: usuario.id_usuario, tipo: 'usuario' }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ message: 'Login bem-sucedido', user: usuario, token });
    } catch (err) {
        console.error('Erro ao validar login:', err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

app.get('/loggedUser', authenticateToken, async (req, res) => {
    const { id, tipo } = req.user;

    try {
        if (tipo === 'usuario') {
            const result = await pool.query(
                'SELECT * FROM usuarios WHERE id_usuario = $1',
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            const user = { ...result.rows[0], tipo: result.rows[0].tipo }
            return res.json({ user });
        } else if (tipo === 'ong') {
            const result = await pool.query(
                'SELECT * FROM ongs WHERE id_ong = $1',
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'ONG não encontrada' });
            }
            const user = { ...result.rows[0], tipo: 'ong' };
            return res.json({ user });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error.message);
        res.status(500).json({ error: 'Erro ao buscar usuário logado' });
    }
});

//CRUD para pets
app.get('/pets', async (req, res) => {
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

app.put('/pets/:id', async (req, res) => {
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

//CRUD para ONGs


//Listar todas as ONGs
app.get('/ongs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ongs');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ONGs' });
    }
});


//Buscar uma ONG por ID
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
app.post('/ongs', async (req, res) => {
    const {
        nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
        data_nascimento_responsavel, telefone_responsavel, estado, cidade, endereco, foto_perfil, descricao, tipo
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO ongs (
                nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
                data_nascimento_responsavel, telefone_responsavel, estado, cidade, endereco, foto_perfil, descricao, tipo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [
                nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
                data_nascimento_responsavel, telefone_responsavel, estado, cidade, endereco, foto_perfil, descricao, tipo
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao criar ONG' });
    }
});
app.put('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
        data_nascimento_responsavel, telefone_responsavel, estado, cidade, endereco, foto_perfil, descricao, tipo
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE ongs SET 
                nome_ong = $1, email = $2, senha = $3, telefone = $4, instagram = $5, cnpj = $6, email_contato = $7,
                nome_responsavel = $8, cpf_responsavel = $9, data_nascimento_responsavel = $10, telefone_responsavel = $11,
                estado = $12, cidade = $13, endereco = $14, foto_perfil = $15, descricao = $16, tipo = $17
            WHERE id_ong = $18 RETURNING *`,
            [
                nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
                data_nascimento_responsavel, telefone_responsavel, estado, cidade, endereco, foto_perfil, descricao, tipo, id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar ONG.' });
    }
});
app.delete('/ongs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ongs WHERE id_ong = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ONG não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao deletar ONG:', err.message);
        res.status(500).json({ error: 'Erro ao deletar ONG' });
    }
});

//Login de ONG
app.post('/loginOng', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const ong = result.rows[0];
        if (ong.senha !== senha) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const token = jwt.sign({ id: ong.id_ong, tipo: 'ong' }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ message: 'Login bem-sucedido', user: ong, token });

    } catch (err) {
        console.error('Erro ao validar login:', err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});



//CRUD para Comentários
//Listar todos os comentários
app.get('/comentarios', async (req, res) => {
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

//Buscar um comentário por ID
app.get('/comentarios/:id', async (req, res) => {
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

app.post('/comentarios', async (req, res) => {
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

//Atualizar um comentário
app.put('/comentarios/:id', async (req, res) => {
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

//Deletar um comentário
app.delete('/comentarios/:id', async (req, res) => {
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

const enviarEmail = require('./emailService');

app.post('/recuperar-senha', async (req, res) => {
    const { email } = req.body;
    let tabela

    try {
        //Verifica se o usuário existe usando o email como req da pesquisa
        const buscaUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        //Caso não exista, pesquisa na tabela de ONGs
        if (buscaUser.rows.length === 0) {
            const buscaOng = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
            //Caso não exista usuarios nem ONG com esse email, retorna erro 404
            if (buscaOng.rows.length === 0) {
                return res.status(404).json({ message: 'E-mail não encontrado.' });
                //Caso a ONG exista, define a variável tabela como 'ongs'
            } else {
                tabela = 'ongs'
            }
            //Caso exista o usuario, define a variável tabela como 'usuarios'
        } else {
            tabela = 'usuarios'
        }

        //Gera um código de verificação
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); //Código de 6 dígitos

        //Atualiza o código de verificação no banco de dados
        if (tabela === 'usuarios') {
            await pool.query('UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2', [codigo, email]);
        } else if (tabela === 'ongs') {
            await pool.query('UPDATE ongs SET codigo_verificacao = $1 WHERE email = $2', [codigo, email]);
        }

        //Envia o código por e-mail
        await enviarEmail(email, 'Código de Verificação', `Seu código de verificação é: ${codigo}`);

        res.status(200).json({ message: 'Código enviado para o e-mail.' });
    } catch (error) {
        console.error('Erro ao enviar código de verificação:', error);
        res.status(500).json({ message: 'Erro ao enviar código de verificação.' });
    }
});

app.post('/verificar-codigo', async (req, res) => {
    const { email, codigo } = req.body;
    let tabela

    //Verifica se o usuário existe usando o email como req da pesquisa
    const buscaUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    //Caso não exista, pesquisa na tabela de ONGs
    if (buscaUser.rows.length === 0) {
        const buscaOng = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        //Caso não exista usuarios nem ONG com esse email, retorna erro 404
        if (buscaOng.rows.length === 0) {
            return res.status(404).json({ message: 'E-mail não encontrado.' });
            //Caso a ONG exista, define a variável tabela como 'ongs'
        } else {
            tabela = 'ongs'
        }
        //Caso exista o usuario, define a variável tabela como 'usuarios'
    } else {
        tabela = 'usuarios'
    }

    if (tabela === 'usuarios') {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND codigo_verificacao = $2', [email, codigo]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Código inválido.' });
        }
    } else if (tabela === 'ongs') {
        const ong = await pool.query('SELECT * FROM ongs WHERE email = $1 AND codigo_verificacao = $2', [email, codigo]);
        if (ong.rows.length === 0) {
            return res.status(400).json({ message: 'Código inválido.' });
        }
    }

    res.status(200).json({ message: 'Código verificado com sucesso.' });
});


app.post('/redefinir-senha', async (req, res) => {
    const { email, novaSenha } = req.body;
    let tabela

    //Verifica se o usuário existe usando o email como req da pesquisa
    const buscaUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    //Caso não exista, pesquisa na tabela de ONGs
    if (buscaUser.rows.length === 0) {
        const buscaOng = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        //Caso não exista usuarios nem ONG com esse email, retorna erro 404
        if (buscaOng.rows.length === 0) {
            return res.status(404).json({ message: 'E-mail não encontrado.' });
            //Caso a ONG exista, define a variável tabela como 'ongs'
        } else {
            tabela = 'ongs'
        }
        //Caso exista o usuario, define a variável tabela como 'usuarios'
    } else {
        tabela = 'usuarios'
    }

    //Define qual query usar baseado no conteúdo da variável
    if (tabela === 'usuarios') {
        try {
            await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', [novaSenha, email]);

            res.status(200).json({ message: 'Senha redefinida com sucesso.' });
            await pool.query('UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2', [null, email]);

        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ message: 'Erro ao redefinir senha.' });
        }
    } else if (tabela === 'ongs') {
        try {
            await pool.query('UPDATE ongs SET senha = $1 WHERE email = $2', [novaSenha, email]);

            res.status(200).json({ message: 'Senha redefinida com sucesso.' });
            await pool.query('UPDATE ongs SET codigo_verificacao = $1 WHERE email = $2', [null, email]);

        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ message: 'Erro ao redefinir senha.' });
        }
    }
});


//Rotas para denúncias
//Listar todas as denúncias
app.get('/denuncias', async (req, res) => {
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

//Buscar uma denúncia por ID
app.get('/denuncias/:id', async (req, res) => {
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

//Criar uma nova denúncia
app.post('/denuncias', async (req, res) => {
    const { mensagem, motivo, tipo_objeto, id_objeto, id_denunciante, id_ong_denunciante, tipo_denunciante } = req.body;

    //Validação: Campos obrigatórios
    if (!motivo || !tipo_objeto || !id_objeto || !tipo_denunciante) {
        return res.status(400).json({ error: 'Motivo, tipo do objeto, ID do objeto e tipo do denunciante são obrigatórios.' });
    }

    //Validação: Apenas um tipo de denunciante deve ser fornecido
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

//Atualizar uma denúncia por ID
app.put('/denuncias/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    //Validação: O status deve ser válido
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

//Deletar uma denúncia por ID
app.delete('/denuncias/:id', async (req, res) => {
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



//Teste API Imagens
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const result = await cloudinary.uploader.upload_stream(
            { folder: 'pets' },
            (error, uploadResult) => {
                if (error) {
                    console.error('Erro ao fazer upload:', error);
                    return res.status(500).json({ error: 'Erro ao fazer upload.' });
                }
                res.status(200).json({ url: uploadResult.secure_url });
            }
        );

        result.end(file.buffer);
    } catch (error) {
        console.error('Erro ao fazer upload:', error.message);
        res.status(500).json({ error: 'Erro ao fazer upload.' });
    }
});

app.post('/analise-cores-pet', upload.single('file'), async (req, res) => {
    console.log('📸 Requisição de análise de cores recebida');
    
    try {
        const file = req.file;

        if (!file) {
            console.log('❌ Nenhum arquivo enviado');
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        console.log('📁 Arquivo recebido:', file.originalname, 'Tamanho:', file.size);

        console.log('☁️ Fazendo upload para Cloudinary...');
        const cloudinaryResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'pets' },
                (error, uploadResult) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(uploadResult);
                    }
                }
            ).end(file.buffer);
        });

        console.log('✅ Upload para Cloudinary concluído:', cloudinaryResult.secure_url);

        console.log('🤖 Iniciando análise com Gemini...');
        
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY não encontrada no arquivo .env');
            return res.status(500).json({ error: 'Chave da API Gemini não configurada.' });
        }
        
        console.log('🔑 Chave Gemini carregada:', process.env.GEMINI_API_KEY ? 'OK' : 'FALHA');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analise a imagem do pet fornecida e sugira as melhores combinações de cores para uma coleira personalizada, considerando:

        1. A cor da pelagem, olhos e características físicas do pet
        2. A harmonia visual entre as cores do pet e da coleira
        3. Contraste adequado para boa visibilidade

        **Cores disponíveis para cada componente (todas sempre em estoque):**

        **Tecido da coleira:**
        - Preto
        - Branco  
        - Bege
        - Azul
        - Vermelho
        - Amarelo

        **Logo:**
        - Preto
        - Branco
        - Marrom

        **Argola:**
        - Dourado
        - Prata
        - Bronze

        **Presilha:**
        - Preto
        - Branco
        - Marrom
        - Azul
        - Vermelho
        - Amarelo

        **IMPORTANTE:** Todas as cores listadas estão sempre disponíveis. Escolha APENAS entre as cores especificadas para cada componente, sem mencionar disponibilidade ou alternativas de estoque.

        **Responda no formato:**

        🐕 **Análise do Pet:**
        [Descreva brevemente as cores e características do pet]

        🎨 **Combinação Recomendada:**
        - **Tecido:** [cor]
        - **Logo:** [cor]  
        - **Argola:** [cor]
        - **Presilha:** [cor]

        💡 **Alternativa 2:**
        - **Tecido:** [cor]
        - **Logo:** [cor]
        - **Argola:** [cor] 
        - **Presilha:** [cor]

        📝 **Explicação:**
        [Breve explicação do porquê essas combinações funcionam bem com este pet específico]`;

        const imageBase64 = file.buffer.toString('base64');
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: file.mimetype
                }
            }
        ]);

        const response = result.response;
        const text = response.text();

        console.log('🎨 Análise concluída com sucesso');
        
        res.status(200).json({ 
            imageUrl: cloudinaryResult.secure_url,
            analysis: text
        });

    } catch (error) {
        console.error('❌ Erro na análise de cores:', error.message);
        res.status(500).json({ error: 'Erro na análise de cores.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});