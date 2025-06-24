# PetMate - Backend

API para gerenciamento de pets, usuários, ONGs, comentários, denúncias e upload de imagens, desenvolvida em Node.js com Express e PostgreSQL.

---

## **Pré-requisitos**

- Node.js (v16+)
- PostgreSQL
- Conta no [Cloudinary](https://cloudinary.com/) para upload de imagens

---

## **Configuração**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/projeto-petmate/petmate.git
   cd back

2. **Instale as dependências**
   ```bash
   npm install

3. **Configure o banco de dados**
   - Crie um banco chamado petmate no PostgreSQL.
   - Importe as tabelas e dados iniciais conforme os arquivos SQL do projeto.

4. Configure as variáveis de ambiente
  Crie um arquivo .env na raiz do projeto com:
   ```bash
    EMAIL_USER=seu_email@gmail.com
    EMAIL_PASS=sua_senha_ou_app_password
    CLOUDINARY_CLOUD_NAME=seu_cloud_name
    CLOUDINARY_API_KEY=sua_api_key
    CLOUDINARY_API_SECRET=sua_api_secret

5. **Inicie o servidor**
   ```bash
   npm start
  O servidor rodará por padrão na porta 3000.

## Rotas da API
### Usuários
- GET /usuarios  
Lista todos os usuários.  
- GET /usuarios/id/:id  
Busca usuário por ID.
- GET /users/email/:email  
Verifica se email existe em usuários ou ONGs.
- GET /usuarios/verificar-email?email=...  
Verifica se email existe em usuários.
- GET /usuarios/verificar-cpf?cpf=...  
Verifica se CPF existe em usuários.
- POST /usuarios  
Cria um novo usuário.
- PUT /usuarios/:id  
Atualiza um usuário.
- DELETE /usuarios/:id  
Deleta um usuário.
- PUT /usuarios/:id/favoritos  
Atualiza favoritos do usuário.
- POST /login  
Login de usuário.
- GET /loggedUser  
Retorna dados do usuário logado (JWT necessário).


### ONGs
- GET /ongs  
Lista todas as ONGs.
- GET /ongs/:id  
Busca ONG por ID.
- GET /ongs/email/:email  
Busca ONG por email.
- GET /ongs/verificar-cnpj?cnpj=...  
Verifica se CNPJ existe em ONGs.
- POST /ongs  
Cria uma nova ONG.
- PUT /ongs/:id  
Atualiza uma ONG.
- DELETE /ongs/:id  
Deleta uma ONG.
- POST /loginOng  
Login de ONG.

### Comentários
- GET /comentarios
Lista todos os comentários.
- GET /comentarios/:id
Busca comentário por ID.
- POST /comentarios
Cria um novo comentário.
- PUT /comentarios/:id
Atualiza um comentário.
- DELETE /comentarios/:id
Deleta um comentário.

### Pets
- GET /pets  
Lista todos os pets (pode filtrar por id_usuario ou id_ong via query).
- GET /pets/:id  
Busca pet por ID.
- POST /pets  
Cria um novo pet.
- PUT /pets/:id  
Atualiza um pet.
- DELETE /pets/:id  
Deleta um pet.

### Denúncias
- GET /denuncias  
Lista todas as denúncias.
- GET /denuncias/:id  
Busca denúncia por ID.
- POST /denuncias  
Cria uma nova denúncia.
- PUT /denuncias/:id  
Atualiza o status de uma denúncia.
- DELETE /denuncias/:id  
Deleta uma denúncia.

### Recuperação de Senha
- POST /recuperar-senha  
Envia código de verificação para o email.
- POST /verificar-codigo  
Verifica o código de verificação.
- POST /redefinir-senha  
Redefine a senha do usuário ou ONG.

### Upload de Imagens
- POST /upload  
Faz upload de uma imagem para o Cloudinary.  
Body: form-data com campo file.

### Swagger
- GET /api-docs  
Acesse a documentação interativa da API.
