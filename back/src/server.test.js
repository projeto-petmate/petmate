const request = require('supertest');
const app = require('./server');

describe('Rotas da API', () => {
    // Test GET /usuarios
    describe('GET /usuarios', () => {
        it('deve retornar uma lista de usuários', async () => {
            const response = await request(app).get('/usuarios');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // Test GET /usuarios/id/:id
    describe('GET /usuarios/id/:id', () => {
        it('deve retornar um usuário pelo ID', async () => {
            const response = await request(app).get('/usuarios/id/9'); 
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id_usuario');
        });

        it('deve retornar 404 se o usuário não for encontrado', async () => {
            const response = await request(app).get('/usuarios/id/9999');
            expect(response.status).toBe(404);
        });
    });

    // Test POST /usuarios
    describe('POST /usuarios', () => {
        it('deve criar um novo usuário', async () => {
            const newUser = {
                nome: 'Test User',
                email: 'test@exemplo.com',
                genero: 'M',
                senha: 'password123',
                uf: 'SP',
                cidade: 'São Paulo',
                bairro: 'Centro',
                telefone: '123456789',
                cpf: '12345678900',
                favoritos: [],
                imagem: null,
                tipo: 'usuario',
            };
            const response = await request(app).post('/usuarios').send(newUser);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id_usuario');
        });
    });

    // Test PUT /usuarios/:id
    describe('PUT /usuarios/:id', () => {
        it('deve atualizar um usuário pelo ID', async () => {
            const updatedUser = {
                nome: 'User Atualizado',
                email: 'upd@exemplo.com',
                genero: 'F',
                senha: 'newpassword123',
                uf: 'RJ',
                cidade: 'Rio de Janeiro',
                bairro: 'Zona Sul',
                telefone: '987654321',
                cpf: '12345678900',
                favoritos: [],
                imagem: null,
                tipo: 'usuario',
            };
            const response = await request(app).put('/usuarios/9').send(updatedUser); 
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('nome', 'Updated User');
        });
    });

    // Test DELETE /usuarios/:id
    describe('DELETE /usuarios/:id', () => {
        it('deve excluir um usuário pelo ID', async () => {
            const response = await request(app).delete('/usuarios/9'); 
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id_usuario');
        });
    });

    // Test POST /pets
    describe('POST /pets', () => {
        it('deve criar um novo pet', async () => {
            const newPet = {
                nome: 'Test Pet',
                idade: 2,
                raca: 'Golden Retriever',
                descricao: 'Cachorro amigável',
                porte: 'Grande',
                genero: 'M',
                imagem: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSmYW10xHNNhEHCptLq2JCrCFMs1f7nnFnraPGiX05qRJttn2pQv1lgx2_Fsbr2qhMURIb1HiMsdLz_of0X72z2ZIA-osdlea4DCVUjPrwI',
                especie: 'Cachorro',
                tags: 'amigável',
                condicoes: 'vacinado',
                disponivel: true,
                id_usuario: 6,
            };
            const response = await request(app).post('/pets').send(newPet);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id_pet');
        });
    });

    // Test DELETE /pets/:id
    describe('DELETE /pets/:id', () => {
        it('deve excluir um pet pelo ID', async () => {
            const response = await request(app).delete('/pets/55'); 
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Pet deletado com sucesso');
        });
    });
});