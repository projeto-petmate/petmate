const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  //Rotas para pedidos de coleiras
  //Listar todas as coleiras
  router.get("/", async (req, res) => {
    const { id_carrinho } = req.query;

    try {
      let query = "SELECT * FROM coleiras";
      const params = [];

      if (id_carrinho) {
        query += " WHERE id_carrinho = $1";
        params.push(id_carrinho);
      }

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err) {
      console.error("Erro ao buscar coleiras:", err.message);
      res.status(500).json({ error: "Erro ao buscar coleiras" });
    }
  });

  //Buscar uma coleira por ID
  router.get("//:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM coleiras WHERE id_coleira = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Coleira não encontrada" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Erro ao buscar coleira" });
    }
  });

  //Criar uma nova coleira
  router.post("/", async (req, res) => {
    const {
      tipo,
      tamanho,
      cor_tecido,
      cor_logo,
      cor_argola,
      cor_presilha,
      preco_unitario,
      id_carrinho,
    } = req.body;

    if (
      !tipo ||
      !tamanho ||
      !cor_tecido ||
      !cor_logo ||
      !cor_argola ||
      !cor_presilha ||
      !preco_unitario ||
      !id_carrinho
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO coleiras (tipo, tamanho, cor_tecido, cor_logo, cor_argola, cor_presilha, preco_unitario, id_carrinho) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          tipo,
          tamanho,
          cor_tecido,
          cor_logo,
          cor_argola,
          cor_presilha,
          preco_unitario,
          id_carrinho,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao criar coleira:", err.message);
      res.status(500).json({ error: "Erro ao criar coleira" });
    }
  });

  //Atualizar uma coleira
  router.put("//:id", async (req, res) => {
    const { id } = req.params;
    const {
      tipo,
      tamanho,
      cor_tecido,
      cor_logo,
      cor_argola,
      cor_presilha,
      preco_unitario,
      id_carrinho,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE coleiras SET 
                tipo = $1, tamanho = $2, cor_tecido = $3, cor_logo = $4, cor_argola = $5, 
                cor_presilha = $6, preco_unitario = $7, id_carrinho = $8 
            WHERE id_coleira = $9 RETURNING *`,
        [
          tipo,
          tamanho,
          cor_tecido,
          cor_logo,
          cor_argola,
          cor_presilha,
          preco_unitario,
          id_carrinho,
          id,
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Coleira não encontrada" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao atualizar coleira:", err.message);
      res.status(500).json({ error: "Erro ao atualizar coleira" });
    }
  });

  //Deletar uma coleira
  router.delete("//:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM coleiras WHERE id_coleira = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Coleira não encontrada" });
      }
      res.json({ message: "Coleira deletada com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar coleira:", err.message);
      res.status(500).json({ error: "Erro ao deletar coleira" });
    }
  });

  //Buscar coleiras de um carrinho específico com detalhes do carrinho
  router.get("/carrinhos/:id/", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `
            SELECT c.*, col.* 
            FROM carrinhos c 
            LEFT JOIN coleiras col ON c.id_carrinho = col.id_carrinho 
            WHERE c.id_carrinho = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Carrinho não encontrado" });
      }

      res.json(result.rows);
    } catch (err) {
      console.error("Erro ao buscar coleiras do carrinho:", err.message);
      res.status(500).json({ error: "Erro ao buscar coleiras do carrinho" });
    }
  });

  // GET - Quantidade de itens do carrinho pelo id_usuario ou id_ong
router.get("/quantidade", async (req, res) => {
  const { id_usuario, id_ong } = req.query;

  if (!id_usuario && !id_ong) {
    return res.status(400).json({ error: "Informe id_usuario ou id_ong" });
  }

  try {
    // Buscar o carrinho pelo id_usuario ou id_ong
    let carrinhoQuery = "SELECT id_carrinho FROM carrinhos WHERE ";
    let param;
    if (id_usuario) {
      carrinhoQuery += "id_usuario = $1";
      param = id_usuario;
    } else {
      carrinhoQuery += "id_ong = $1";
      param = id_ong;
    }

    const carrinhoResult = await pool.query(carrinhoQuery, [param]);
    if (carrinhoResult.rows.length === 0) {
      return res.json({ quantidade: 0 });
    }

    const id_carrinho = carrinhoResult.rows[0].id_carrinho;

    // Contar os itens do carrinho
    const itensResult = await pool.query(
      "SELECT COUNT(*) AS quantidade FROM carrinho_itens WHERE id_carrinho = $1",
      [id_carrinho]
    );

    res.json({ quantidade: parseInt(itensResult.rows[0].quantidade, 10) });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar quantidade de itens" });
  }
});

  return router;
};
