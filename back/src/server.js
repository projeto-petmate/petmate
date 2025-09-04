const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const multer = require('multer'); 
const cloudinary = require('./cloudinaryConfig');
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petmate',
    password: 'senai',
    port: 5432,
});

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());

// Configuração do Swagger
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

const enviarEmail = require('./emailService');

// Importar rotas
const usuariosRoutes = require('./routes/usuarios');
const ongsRoutes = require('./routes/ongs');
const petsRoutes = require('./routes/pets');
const comentariosRoutes = require('./routes/comentarios');
const denunciasRoutes = require('./routes/denuncias');
const carrinhosRoutes = require('./routes/carrinhos');
const coleirasRoutes = require('./routes/coleiras');
const analiseRoutes = require('./routes/analise');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// Novas rotas da estrutura completa de e-commerce
const carrinhoItensRoutes = require('./routes/carrinho_itens');
const pedidosRoutes = require('./routes/pedidos');
const pedidosItensRoutes = require('./routes/pedidos_itens');

// Configurar rotas
app.use('/usuarios', usuariosRoutes(pool));
app.use('/ongs', ongsRoutes(pool));
app.use('/pets', petsRoutes(pool));
app.use('/comentarios', comentariosRoutes(pool));
app.use('/denuncias', denunciasRoutes(pool));
app.use('/carrinhos', carrinhosRoutes(pool));
app.use('/coleiras', coleirasRoutes(pool));
app.use('/analise', analiseRoutes(upload, cloudinary));
app.use('/', authRoutes(pool, enviarEmail));
app.use('/upload', uploadRoutes(upload, cloudinary));

// Novas rotas da estrutura completa
app.use('/carrinho-itens', carrinhoItensRoutes(pool));
app.use('/pedidos', pedidosRoutes(pool));
app.use('/pedidos-itens', pedidosItensRoutes(pool));

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API PetMate está funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
