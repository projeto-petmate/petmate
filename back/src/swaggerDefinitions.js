/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Endpoints relacionados aos usuários
 *   - name: Pets
 *     description: Endpoints relacionados aos pets
 *   - name: ONGs
 *     description: Endpoints relacionados às ONGs
 *   - name: Comentários
 *     description: Endpoints relacionados aos comentários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     description: ID do usuário
 *                   nome:
 *                     type: string
 *                     description: Nome do usuário
 *                   email:
 *                     type: string
 *                     description: Email do usuário
 */

/**
 * @swagger
 * /usuarios/id/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     summary: Busca um usuário pelo email
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *                 genero:
 *                   type: string
 *                   description: Gênero do usuário
 *                 uf:
 *                   type: string
 *                   description: Estado do usuário
 *                 cidade:
 *                   type: string
 *                   description: Cidade do usuário
 *                 bairro:
 *                   type: string
 *                   description: Bairro do usuário
 *                 telefone:
 *                   type: string
 *                   description: Telefone do usuário
 *                 cpf:
 *                   type: string
 *                   description: CPF do usuário
 *                 favoritos:
 *                   type: string
 *                   description: Favoritos do usuário
 *                 imagem:
 *                   type: string
 *                   description: URL da imagem do usuário
 *                 tipo:
 *                   type: string
 *                   description: Tipo do usuário
 *                 data_criacao:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do usuário
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário pelo email
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               genero:
 *                 type: string
 *               senha:
 *                 type: string
 *               uf:
 *                 type: string
 *               cidade:
 *                 type: string
 *               bairro:
 *                 type: string
 *               telefone:
 *                 type: string
 *               cpf:
 *                 type: string
 *               favoritos:
 *                 type: string
 *               imagem:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               genero:
 *                 type: string
 *               senha:
 *                 type: string
 *               uf:
 *                 type: string
 *               cidade:
 *                 type: string
 *               bairro:
 *                 type: string
 *               telefone:
 *                 type: string
 *               cpf:
 *                 type: string
 *               favoritos:
 *                 type: string
 *               imagem:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/verificar-email:
 *   get:
 *     summary: Verifica se um email já está cadastrado
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email a ser verificado
 *     responses:
 *       200:
 *         description: Retorna se o email existe ou não
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 existe:
 *                   type: boolean
 *                   description: Indica se o email já está cadastrado
 *       400:
 *         description: O email não foi fornecido
 *       500:
 *         description: Erro ao verificar o email
 */

/**
 * @swagger
 * /usuarios/verificar-cpf:
 *   get:
 *     summary: Verifica se um CPF já está cadastrado
 *     tags: [Usuários]
 *     parameters:
 *       - in: query
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF a ser verificado
 *     responses:
 *       200:
 *         description: Retorna se o CPF existe ou não
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 existe:
 *                   type: boolean
 *                   description: Indica se o CPF já está cadastrado
 *       400:
 *         description: O CPF não foi fornecido
 *       500:
 *         description: Erro ao verificar o CPF
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pet:
 *                     type: integer
 *                     description: ID do pet
 *                   nome:
 *                     type: string
 *                     description: Nome do pet
 */

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Cria um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idade:
 *                 type: string
 *               raca:
 *                 type: string
 *               descricao:
 *                 type: string
 *               porte:
 *                 type: string
 *               genero:
 *                 type: string
 *               imagem:
 *                 type: string
 *               especie:
 *                 type: string
 *               tags:
 *                 type: string
 *               condicoes:
 *                 type: string
 *               disponivel:
 *                 type: boolean
 *               id_usuario:
 *                 type: integer
 *               id_ong:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualiza um pet pelo ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idade:
 *                 type: string
 *               raca:
 *                 type: string
 *               descricao:
 *                 type: string
 *               porte:
 *                 type: string
 *               genero:
 *                 type: string
 *               imagem:
 *                 type: string
 *               especie:
 *                 type: string
 *               tags:
 *                 type: string
 *               condicoes:
 *                 type: string
 *               disponivel:
 *                 type: boolean
 *               id_usuario:
 *                 type: integer
 *               id_ong:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       404:
 *         description: Pet não encontrado
 */

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Deleta um pet pelo ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     responses:
 *       200:
 *         description: Pet deletado com sucesso
 *       404:
 *         description: Pet não encontrado
 */

/**
 * @swagger
 * /ongs:
 *   get:
 *     summary: Lista todas as ONGs
 *     tags: [ONGs]
 *     responses:
 *       200:
 *         description: Lista de ONGs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_ong:
 *                     type: integer
 *                     description: ID da ONG
 *                   nome_ong:
 *                     type: string
 *                     description: Nome da ONG
 *                   email:
 *                     type: string
 *                     description: Email da ONG
 */

/**
 * @swagger
 * /ongs:
 *   post:
 *     summary: Cria uma nova ONG
 *     tags: [ONGs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_ong:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               telefone_denuncia:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               nome_responsavel:
 *                 type: string
 *               cpf_responsavel:
 *                 type: string
 *               data_nascimento_responsavel:
 *                 type: string
 *               email_responsavel:
 *                 type: string
 *               telefone_responsavel:
 *                 type: string
 *               estado_ong:
 *                 type: string
 *               cidade_ong:
 *                 type: string
 *               endereco_ong:
 *                 type: string
 *               foto_ong:
 *                 type: string
 *               descricao_ong:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: ONG criada com sucesso
 *       400:
 *         description: Erro de validação
 */


/**
 * @swagger
 * /ongs/{id}:
 *   put:
 *     summary: Atualiza uma ONG pelo ID
 *     tags: [ONGs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ONG
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_ong:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               telefone_denuncia:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               nome_responsavel:
 *                 type: string
 *               cpf_responsavel:
 *                 type: string
 *               data_nascimento_responsavel:
 *                 type: string
 *               email_responsavel:
 *                 type: string
 *               telefone_responsavel:
 *                 type: string
 *               estado_ong:
 *                 type: string
 *               cidade_ong:
 *                 type: string
 *               endereco_ong:
 *                 type: string
 *               foto_ong:
 *                 type: string
 *               descricao_ong:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: ONG atualizada com sucesso
 *       404:
 *         description: ONG não encontrada
 */

/**
 * @swagger
 * /ongs/{id}:
 *   delete:
 *     summary: Deleta uma ONG pelo ID
 *     tags: [ONGs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ONG
 *     responses:
 *       200:
 *         description: ONG deletada com sucesso
 *       404:
 *         description: ONG não encontrada
 */


/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Lista todos os comentários
 *     tags: [Comentários]
 *     responses:
 *       200:
 *         description: Lista de comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_comentario:
 *                     type: integer
 *                     description: ID do comentário
 *                   texto:
 *                     type: string
 *                     description: Texto do comentário
 *                   id_usuario:
 *                     type: integer
 *                     description: ID do usuário que fez o comentário
 */

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Cria um novo comentário
 *     tags: [Comentários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *                 description: Texto do comentário
 *               id_usuario:
 *                 type: integer
 *                 description: ID do usuário que está criando o comentário
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /comentarios/{id}:
 *   put:
 *     summary: Atualiza um comentário pelo ID
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 *       404:
 *         description: Comentário não encontrado
 */

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Deleta um comentário pelo ID
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário deletado com sucesso
 *       404:
 *         description: Comentário não encontrado
 */


/**
 * @swagger
 * /recuperar-senha:
 *   post:
 *     summary: Envia um código de verificação para o email fornecido
 *     tags: [Usuários, ONGs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário ou ONG para o qual o código será enviado
 *     responses:
 *       200:
 *         description: Código enviado para o email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *       404:
 *         description: Email não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *       500:
 *         description: Erro ao enviar o código de verificação
 */

/**
 * @swagger
 * /verificar-codigo:
 *   post:
 *     summary: Verifica o código de verificação enviado para o email
 *     tags: [Usuários, ONGs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário ou ONG
 *               codigo:
 *                 type: string
 *                 description: Código de verificação enviado para o email
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *       404:
 *         description: Email ou código inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *       500:
 *         description: Erro ao verificar o código
 */


/**
 * @swagger
 * /redefinir-senha:
 *   post:
 *     summary: Redefine a senha de um usuário ou ONG
 *     tags: [Usuários, ONGs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário ou ONG
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha a ser definida
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *       404:
 *         description: Email não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *       500:
 *         description: Erro ao redefinir a senha
 */