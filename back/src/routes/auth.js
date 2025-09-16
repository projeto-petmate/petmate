const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "chave_secreta";

module.exports = (pool, enviarEmail) => {
  // Middleware de autenticação
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user;
      next();
    });
  };

  // GET - Buscar usuário ou ONG por email (para verificação de existência)
  router.get("/users/email/:email", async (req, res) => {
    const { email } = req.params;
    try {
      let result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        result = await pool.query("SELECT * FROM ongs WHERE email = $1", [
          email,
        ]);
      }
      if (result.rows.length === 0) {
        return res.json({ exists: false });
      }
      res.json({ exists: true });
    } catch (err) {
      console.error("Erro ao buscar usuário ou ONG:", err.message);
      res.status(500).json({ error: "Erro ao buscar usuário ou ONG" });
    }
  });

  // POST - Login de usuário
  router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }
    try {
      //Verifica se o usuário existe usando o email como req da pesquisa
      const buscaUser = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );
      //Caso não exista, pesquisa na tabela de ONGs
      if (buscaUser.rows.length === 0) {
        const buscaOng = await pool.query(
          "SELECT * FROM ongs WHERE email = $1",
          [email]
        );
        //Caso não exista usuarios nem ONG com esse email, retorna erro 404
        if (buscaOng.rows.length === 0) {
          return res.status(404).json({ message: "E-mail não encontrado." });
          //Caso a ONG exista, define a variável tabela como 'ongs'
        } else {
          tabela = "ongs";
        }
        //Caso exista o usuario, define a variável tabela como 'usuarios'
      } else {
        tabela = "usuarios";
      }

      if (tabela === "usuarios") {
        const result = await pool.query(
          "SELECT * FROM usuarios WHERE email = $1",
          [email]
        );
        if (result.rows.length === 0) {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }
        const usuario = result.rows[0];
        if (usuario.senha !== senha) {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }
        const token = jwt.sign(
          { id: usuario.id_usuario, tipo: "usuario" },
          SECRET_KEY,
          { expiresIn: "7d" }
        );
        res.json({ message: "Login bem-sucedido", user: usuario, token });
      } else if (tabela === "ongs") {
        const result = await pool.query("SELECT * FROM ongs WHERE email = $1", [
          email,
        ]);
        if (result.rows.length === 0) {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }

        const ong = result.rows[0];
        if (ong.senha !== senha) {
          return res.status(401).json({ error: "Email ou senha incorretos" });
        }

        const token = jwt.sign({ id: ong.id_ong, tipo: "ong" }, SECRET_KEY, {
          expiresIn: "7d",
        });

        res.json({ message: "Login bem-sucedido", user: ong, token });
      }
    } catch (err) {
      console.error("Erro ao validar login:", err.message);
      res.status(500).json({ error: "Erro ao validar login" });
    }
  });

  // POST - Login de ONG
//   router.post("/loginOng", async (req, res) => {
//     const { email, senha } = req.body;

//     if (!email || !senha) {
//       return res.status(400).json({ error: "Email e senha são obrigatórios." });
//     }

//     try {
//       const result = await pool.query("SELECT * FROM ongs WHERE email = $1", [
//         email,
//       ]);
//       if (result.rows.length === 0) {
//         return res.status(401).json({ error: "Email ou senha incorretos" });
//       }

//       const ong = result.rows[0];
//       if (ong.senha !== senha) {
//         return res.status(401).json({ error: "Email ou senha incorretos" });
//       }

//       const token = jwt.sign({ id: ong.id_ong, tipo: "ong" }, SECRET_KEY, {
//         expiresIn: "7d",
//       });

//       res.json({ message: "Login bem-sucedido", user: ong, token });
//     } catch (err) {
//       console.error("Erro ao validar login:", err.message);
//       res.status(500).json({ error: "Erro ao validar login" });
//     }
//   });

  // GET - Obter usuário logado
  router.get("/loggedUser", authenticateToken, async (req, res) => {
    const { id, tipo } = req.user;

    try {
      if (tipo === "usuario") {
        const result = await pool.query(
          "SELECT * FROM usuarios WHERE id_usuario = $1",
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const user = { ...result.rows[0], tipo: result.rows[0].tipo };
        return res.json({ user });
      } else if (tipo === "ong") {
        const result = await pool.query(
          "SELECT * FROM ongs WHERE id_ong = $1",
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "ONG não encontrada" });
        }
        const user = { ...result.rows[0], tipo: "ong" };
        return res.json({ user });
      }
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error.message);
      res.status(500).json({ error: "Erro ao buscar usuário logado" });
    }
  });

  // POST - Recuperar senha
  router.post("/recuperar-senha", async (req, res) => {
    const { email } = req.body;
    let tabela;

    try {
      //Verifica se o usuário existe usando o email como req da pesquisa
      const buscaUser = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );
      //Caso não exista, pesquisa na tabela de ONGs
      if (buscaUser.rows.length === 0) {
        const buscaOng = await pool.query(
          "SELECT * FROM ongs WHERE email = $1",
          [email]
        );
        //Caso não exista usuarios nem ONG com esse email, retorna erro 404
        if (buscaOng.rows.length === 0) {
          return res.status(404).json({ message: "E-mail não encontrado." });
          //Caso a ONG exista, define a variável tabela como 'ongs'
        } else {
          tabela = "ongs";
        }
        //Caso exista o usuario, define a variável tabela como 'usuarios'
      } else {
        tabela = "usuarios";
      }

      //Gera um código de verificação
      const codigo = Math.floor(100000 + Math.random() * 900000).toString(); //Código de 6 dígitos

      //Atualiza o código de verificação no banco de dados
      if (tabela === "usuarios") {
        await pool.query(
          "UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2",
          [codigo, email]
        );
      } else if (tabela === "ongs") {
        await pool.query(
          "UPDATE ongs SET codigo_verificacao = $1 WHERE email = $2",
          [codigo, email]
        );
      }

      //Envia o código por e-mail
      await enviarEmail(
        email,
        "Código de Verificação",
        `Seu código de verificação é: ${codigo}`
      );

      res.status(200).json({ message: "Código enviado para o e-mail." });
    } catch (error) {
      console.error("Erro ao enviar código de verificação:", error);
      res
        .status(500)
        .json({ message: "Erro ao enviar código de verificação." });
    }
  });

  // POST - Verificar código de recuperação
  router.post("/verificar-codigo", async (req, res) => {
    const { email, codigo } = req.body;
    let tabela;

    //Verifica se o usuário existe usando o email como req da pesquisa
    const buscaUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    //Caso não exista, pesquisa na tabela de ONGs
    if (buscaUser.rows.length === 0) {
      const buscaOng = await pool.query("SELECT * FROM ongs WHERE email = $1", [
        email,
      ]);
      //Caso não exista usuarios nem ONG com esse email, retorna erro 404
      if (buscaOng.rows.length === 0) {
        return res.status(404).json({ message: "E-mail não encontrado." });
        //Caso a ONG exista, define a variável tabela como 'ongs'
      } else {
        tabela = "ongs";
      }
      //Caso exista o usuario, define a variável tabela como 'usuarios'
    } else {
      tabela = "usuarios";
    }

    if (tabela === "usuarios") {
      const user = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1 AND codigo_verificacao = $2",
        [email, codigo]
      );
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "Código inválido." });
      }
    } else if (tabela === "ongs") {
      const ong = await pool.query(
        "SELECT * FROM ongs WHERE email = $1 AND codigo_verificacao = $2",
        [email, codigo]
      );
      if (ong.rows.length === 0) {
        return res.status(400).json({ message: "Código inválido." });
      }
    }

    res.status(200).json({ message: "Código verificado com sucesso." });
  });

  // POST - Redefinir senha
  router.post("/redefinir-senha", async (req, res) => {
    const { email, novaSenha } = req.body;
    let tabela;

    //Verifica se o usuário existe usando o email como req da pesquisa
    const buscaUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    //Caso não exista, pesquisa na tabela de ONGs
    if (buscaUser.rows.length === 0) {
      const buscaOng = await pool.query("SELECT * FROM ongs WHERE email = $1", [
        email,
      ]);
      //Caso não exista usuarios nem ONG com esse email, retorna erro 404
      if (buscaOng.rows.length === 0) {
        return res.status(404).json({ message: "E-mail não encontrado." });
        //Caso a ONG exista, define a variável tabela como 'ongs'
      } else {
        tabela = "ongs";
      }
      //Caso exista o usuario, define a variável tabela como 'usuarios'
    } else {
      tabela = "usuarios";
    }

    //Define qual query usar baseado no conteúdo da variável
    if (tabela === "usuarios") {
      try {
        await pool.query("UPDATE usuarios SET senha = $1 WHERE email = $2", [
          novaSenha,
          email,
        ]);

        res.status(200).json({ message: "Senha redefinida com sucesso." });
        await pool.query(
          "UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2",
          [null, email]
        );
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ message: "Erro ao redefinir senha." });
      }
    } else if (tabela === "ongs") {
      try {
        await pool.query("UPDATE ongs SET senha = $1 WHERE email = $2", [
          novaSenha,
          email,
        ]);

        res.status(200).json({ message: "Senha redefinida com sucesso." });
        await pool.query(
          "UPDATE ongs SET codigo_verificacao = $1 WHERE email = $2",
          [null, email]
        );
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ message: "Erro ao redefinir senha." });
      }
    }
  });

  return router;
};
