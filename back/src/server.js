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
        const result = await pool.query('SELECT id_usuario, nome, email, genero, uf, cidade, bairro, telefone, imagem, tipo FROM usuarios');
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
            return res.status(404).json({ error: 'Usuário ou ONG não encontrado' });
        }
        res.json(result.rows[0]);
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

// Rotas para usuários
app.post('/usuarios', async (req, res) => {
    const { nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, imagem, tipo } = req.body;

    console.log("Dados recebidos no backend:", req.body);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, imagem, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, imagem, tipo]
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
    const { nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, imagem, tipo } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    try {
        const result = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, genero = $3, senha = $4, uf = $5, cidade = $6, bairro = $7, telefone = $8, cpf = $9, favoritos = $10, imagem = $11, tipo = $12 WHERE id_usuario = $13 RETURNING *',
            [nome, email, genero, senha, uf, cidade, bairro, telefone, cpf, favoritos, imagem, tipo, id]
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
        // if (usuario.senha !== senha) {
        //     return res.status(401).json({ error: 'Senha incorreta' });
        // }

        const token = jwt.sign({ id: usuario.id_usuario, tipo: 'usuario' }, SECRET_KEY, { expiresIn: '1h' });

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
            const result = await pool.query('SELECT id_usuario, nome, email, genero, uf, cidade, bairro, telefone, imagem, tipo FROM usuarios WHERE id_usuario = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            return res.json({ user: result.rows[0] });
        } else if (tipo === 'ong') {
            const result = await pool.query('SELECT id_ong, nome_ong, email, telefone, instagram, estado, cidade, endereco, foto_perfil, descricao FROM ongs WHERE id_ong = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'ONG não encontrada' });
            }
            return res.json({ user: result.rows[0] });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error.message);
        res.status(500).json({ error: 'Erro ao buscar usuário logado' });
    }
});

// CRUD para pets
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
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, condicoes, disponivel, id_usuario, id_ong } = req.body;

    if (!id_usuario && !id_ong) {
        return res.status(400).json({ error: 'É necessário informar id_usuario ou id_ong' });
    }

    if (id_usuario && id_ong) {
        return res.status(400).json({ error: 'Um pet não pode pertencer a um usuário e a uma ONG ao mesmo tempo' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO pets (nome, idade, raca, descricao, porte, genero, imagem, especie, tags, condicoes, disponivel, id_usuario, id_ong) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, condicoes, disponivel, id_usuario || null, id_ong || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar pet:', err.message);
        res.status(500).json({ error: 'Erro ao criar pet' });
    }
});

app.put('/pets/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, raca, descricao, porte, genero, imagem, especie, tags, condicoes, disponivel, id_usuario, id_ong } = req.body;

    try {
        const result = await pool.query(
            `UPDATE pets SET 
                nome = $1, idade = $2, raca = $3, descricao = $4, porte = $5, genero = $6, imagem = $7, 
                especie = $8, tags = $9, condicoes = $10, disponivel = $11, id_usuario = $12, id_ong = $13 
            WHERE id_pet = $14 RETURNING *`,
            [nome, idade, raca, descricao, porte, genero, imagem, especie, tags, condicoes, disponivel, id_usuario || null, id_ong || null, id]
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
        const result = await pool.query('SELECT id_ong, nome_ong, email, telefone, instagram, estado, cidade, endereco, foto_perfil, descricao FROM ongs');
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

// Login de ONG
app.post('/loginOng', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await pool.query('SELECT * FROM ongs WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Login ou senha incorretos' });
        }

        // const ong = result.rows[0];
        // if (ong.senha !== senha) {
        //     return res.status(401).json({ error: 'Senha incorreta' });
        // }

        const token = jwt.sign({ id: ong.id_ong, tipo: 'ong' }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', user: ong, token });

    } catch (err) {
        console.error('Erro ao validar login:', err.message);
        res.status(500).json({ error: 'Erro ao validar login' });
    }
});



// CRUD para Comentários

// Listar todos os comentários
app.get('/comentarios', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                comentarios.id_comentario,
                comentarios.texto,
                comentarios.id_usuario,
                usuarios.nome AS nome_user,
                usuarios.imagem AS foto_user
            FROM comentarios
            JOIN usuarios ON comentarios.id_usuario = usuarios.id_usuario
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar comentários:', err.message);
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
        const userResult = await pool.query('SELECT nome, imagem FROM usuarios WHERE id_usuario = $1', [id_usuario]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { nome, imagem } = userResult.rows[0];

        const result = await pool.query(
            'INSERT INTO comentarios (texto, id_usuario, nome_user, foto_user) VALUES ($1, $2, $3, $4) RETURNING *',
            [texto, id_usuario, nome, imagem]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar comentário:', err.message);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
});

// Atualizar um comentário por ID
app.put('/comentarios/:id', async (req, res) => {
    const { id } = req.params;
    const { texto, foto_user, nome_user } = req.body;
    try {
        const result = await pool.query(
            'UPDATE comentarios SET texto = $1, foto_user = $2, nome_user = $3 WHERE id_comentario = $4 RETURNING *',
            [texto, foto_user, nome_user, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
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

        // Gere um código de verificação
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

        // Atualize o código de verificação no banco de dados
        if (tabela === 'usuarios') {
            await pool.query('UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2', [codigo, email]);
        } else if (tabela === 'ongs') {
            await pool.query('UPDATE ongs SET codigo_verificacao = $1 WHERE email = $2', [codigo, email]);
        }

        // Envie o código por e-mail
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

    //Define qual query usar baseado no conteúdo da varável
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});