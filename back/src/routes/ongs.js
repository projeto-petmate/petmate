const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "chave_secreta";

module.exports = (pool) => {
  // GET - Listar todas as ONGs
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM ongs");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro ao buscar ONGs" });
    }
  });

  // GET - Buscar ONG por ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM ongs WHERE id_ong = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "ONG não encontrada" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro ao buscar ONG" });
    }
  });

  // GET - Buscar ONG por email
  router.get("/email/:email", async (req, res) => {
    const { email } = req.params;
    try {
      const result = await pool.query("SELECT * FROM ongs WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "ONG não encontrada" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro ao buscar ONG." });
    }
  });

  // GET - Verificar CNPJ único
  router.get("/verificar-cnpj/:cnpj", async (req, res) => {
    const { cnpj } = req.params;

    try {
      const result = await pool.query("SELECT * FROM ongs WHERE cnpj = $1", [
        cnpj,
      ]);
      if (result.rows.length > 0) {
        return res.status(200).json({ exists: true });
      }
      res.status(200).json({ exists: false });
    } catch (error) {
      console.error("Erro ao verificar CNPJ:", error);
      res.status(500).json({ message: "Erro ao verificar CNPJ." });
    }
  });

  // POST - Criar nova ONG
  router.post("/", async (req, res) => {
    const {
      nome_ong,
      email,
      senha,
      telefone,
      instagram,
      cnpj,
      email_contato,
      nome_responsavel,
      cpf_responsavel,
      data_nascimento_responsavel,
      telefone_responsavel,
      uf,
      cidade,
      endereco,
      foto_perfil,
      descricao,
      tipo,
    } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO ongs (
                    nome_ong, email, senha, telefone, instagram, cnpj, email_contato, nome_responsavel, cpf_responsavel,
                    data_nascimento_responsavel, telefone_responsavel, uf, cidade, endereco, foto_perfil, descricao, tipo
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [
          nome_ong,
          email,
          senha,
          telefone,
          instagram,
          cnpj,
          email_contato,
          nome_responsavel,
          cpf_responsavel,
          data_nascimento_responsavel,
          telefone_responsavel,
          uf,
          cidade,
          endereco,
          foto_perfil,
          descricao,
          tipo,
        ]
      );

      const novaOng = result.rows[0];
      console.log("✅ ONG criada:", novaOng.id_ong);

      await client.query("COMMIT");

      res.status(201).json(novaOng);
      
    } catch (err) {
      await client.query('ROLLBACK');
      console.error("Erro ao criar ONG:", err.message);
      res.status(500).json({ error: "Erro ao criar ONG" });
    } finally {
      client.release();
    }
});

  // PUT - Atualizar ONG
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
      nome_ong,
      email,
      senha,
      telefone,
      instagram,
      cnpj,
      email_contato,
      nome_responsavel,
      cpf_responsavel,
      data_nascimento_responsavel,
      telefone_responsavel,
      uf,
      cidade,
      endereco,
      foto_perfil,
      descricao,
      tipo,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE ongs SET 
                    nome_ong = $1, email = $2, senha = $3, telefone = $4, instagram = $5, cnpj = $6, email_contato = $7,
                    nome_responsavel = $8, cpf_responsavel = $9, data_nascimento_responsavel = $10, telefone_responsavel = $11,
                    uf = $12, cidade = $13, endereco = $14, foto_perfil = $15, descricao = $16, tipo = $17
                WHERE id_ong = $18 RETURNING *`,
        [
          nome_ong,
          email,
          senha,
          telefone,
          instagram,
          cnpj,
          email_contato,
          nome_responsavel,
          cpf_responsavel,
          data_nascimento_responsavel,
          telefone_responsavel,
          uf,
          cidade,
          endereco,
          foto_perfil,
          descricao,
          tipo,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "ONG não encontrada." });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao atualizar ONG:", err.message);
      res.status(500).json({ error: "Erro ao atualizar ONG." });
    }
  });

  // DELETE - Deletar ONG
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM ongs WHERE id_ong = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "ONG não encontrada" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao deletar ONG:", err.message);
      res.status(500).json({ error: "Erro ao deletar ONG" });
    }
  });

  // POST - Login de ONG
  router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
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
    } catch (err) {
      console.error("Erro ao validar login:", err.message);
      res.status(500).json({ error: "Erro ao validar login" });
    }
  });

  return router;
};
