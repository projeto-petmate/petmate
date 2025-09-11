const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // Itens temporários no carrinho

  // GET - Listar itens de um carrinho específico
  router.get("/carrinho/:id_carrinho", async (req, res) => {
    const { id_carrinho } = req.params;
    try {
      const result = await pool.query(
        `
                SELECT 
                    ci.*,
                    (ci.valor * ci.quantidade) as subtotal
                FROM carrinho_itens ci 
                WHERE ci.id_carrinho = $1 
                ORDER BY ci.data_adicao DESC
            `,
        [id_carrinho]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar itens do carrinho" });
    }
  });

  // GET - Buscar item específico por ID
  router.get("/item/:id_item", async (req, res) => {
    const { id_item } = req.params;
    try {
      const result = await pool.query(
        `
                SELECT 
                    ci.*,
                    (ci.valor * ci.quantidade) as subtotal
                FROM carrinho_itens ci 
                WHERE ci.id_item = $1
            `,
        [id_item]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar item" });
    }
  });

  // POST - Adicionar item ao carrinho
  router.post("/carrinho/:id_carrinho/item", async (req, res) => {
    const { id_carrinho } = req.params;
    const {
      modelo,
      tamanho,
      cor_tecido,
      cor_logo,
      cor_argola,
      cor_presilha,
      valor,
      quantidade = 1,
    } = req.body;

    try {
      console.log(`➕ Adicionando item ao carrinho ${id_carrinho}:`, {
        modelo,
        tamanho,
        valor,
        cor_tecido,
        cor_logo,
        cor_argola,
        cor_presilha,
        quantidade,
      });

      // Verificar se o carrinho existe
      const carrinhoExists = await pool.query(
        "SELECT id_carrinho FROM carrinhos WHERE id_carrinho = $1",
        [id_carrinho]
      );

      if (carrinhoExists.rows.length === 0) {
        return res.status(404).json({ error: "Carrinho não encontrado" });
      }

      const result = await pool.query(
        `
                INSERT INTO carrinho_itens (id_carrinho, modelo, tamanho, cor_tecido, cor_logo, cor_argola, cor_presilha, valor, quantidade)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *, (valor * quantidade) as subtotal
            `,
        [
          id_carrinho,
          modelo,
          tamanho,
          cor_tecido,
          cor_logo,
          cor_argola,
          cor_presilha,
          valor,
          quantidade,
        ]
      );

      // Atualizar valor total do carrinho
      await pool.query(
        `
                UPDATE carrinhos 
                SET valor_total = (
                    SELECT COALESCE(SUM(valor * quantidade), 0) 
                    FROM carrinho_itens 
                    WHERE id_carrinho = $1
                )
                WHERE id_carrinho = $1
            `,
        [id_carrinho]
      );

      console.log(`✅ Item adicionado com sucesso ao carrinho ${id_carrinho}`);
      res.status(201).json({
        message: "Item adicionado ao carrinho com sucesso",
        item: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Erro ao adicionar item ao carrinho:", err.message);
      res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
    }
  });

  // PUT - Atualizar item do carrinho
  router.put("/item/:id_item", async (req, res) => {
    const { id_item } = req.params;
    const {
      modelo,
      tamanho,
      cor_tecido,
      cor_logo,
      cor_argola,
      cor_presilha,
      valor,
      quantidade,
    } = req.body;

    try {
      console.log(`📝 Atualizando item ${id_item}`);

      const result = await pool.query(
        `
                UPDATE carrinho_itens 
                SET modelo = COALESCE($1, modelo),
                    tamanho = COALESCE($2, tamanho),
                    cor_tecido = COALESCE($3, cor_tecido),
                    cor_logo = COALESCE($4, cor_logo),
                    cor_argola = COALESCE($5, cor_argola),
                    cor_presilha = COALESCE($6, cor_presilha),
                    valor = COALESCE($7, valor),
                    quantidade = COALESCE($8, quantidade)
                WHERE id_item = $9
                RETURNING *, (valor * quantidade) as subtotal
            `,
        [
          modelo,
          tamanho,
          cor_tecido,
          cor_logo,
          cor_argola,
          cor_presilha,
          valor,
          quantidade,
          id_item,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      // Atualizar valor total do carrinho
      const item = result.rows[0];
      await pool.query(
        `
                UPDATE carrinhos 
                SET valor_total = (
                    SELECT COALESCE(SUM(valor * quantidade), 0) 
                    FROM carrinho_itens 
                    WHERE id_carrinho = $1
                )
                WHERE id_carrinho = $1
            `,
        [item.id_carrinho]
      );

      console.log(`✅ Item ${id_item} atualizado com sucesso`);
      res.json({
        message: "Item atualizado com sucesso",
        item: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Erro ao atualizar item:", err.message);
      res.status(500).json({ error: "Erro ao atualizar item" });
    }
  });

  // DELETE - Remover item do carrinho
  router.delete("/item/:id_item", async (req, res) => {
    const { id_item } = req.params;

    try {
      console.log(`🗑️ Removendo item ${id_item}`);

      // Primeiro buscar o id_carrinho para atualizar o total depois
      const itemResult = await pool.query(
        "SELECT id_carrinho FROM carrinho_itens WHERE id_item = $1",
        [id_item]
      );

      if (itemResult.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      const id_carrinho = itemResult.rows[0].id_carrinho;

      // Remover o item
      await pool.query("DELETE FROM carrinho_itens WHERE id_item = $1", [
        id_item,
      ]);

      // Atualizar valor total do carrinho
      await pool.query(
        `
                UPDATE carrinhos 
                SET valor_total = (
                    SELECT COALESCE(SUM(valor * quantidade), 0) 
                    FROM carrinho_itens 
                    WHERE id_carrinho = $1
                )
                WHERE id_carrinho = $1
            `,
        [id_carrinho]
      );

      console.log(`✅ Item ${id_item} removido com sucesso`);
      res.json({ message: "Item removido do carrinho com sucesso" });
    } catch (err) {
      console.error("❌ Erro ao remover item:", err.message);
      res.status(500).json({ error: "Erro ao remover item" });
    }
  });

  // GET - Resumo do carrinho com total
  router.get("/carrinho/:id_carrinho/resumo", async (req, res) => {
    const { id_carrinho } = req.params;

    try {
      console.log(`📊 Buscando resumo do carrinho ${id_carrinho}`);

      const result = await pool.query(
        `
                SELECT 
                    c.id_carrinho,
                    c.status,
                    c.data_criacao,
                    COUNT(ci.id_item) as total_itens,
                    COALESCE(SUM(ci.quantidade), 0) as quantidade_total,
                    COALESCE(SUM(ci.valor * ci.quantidade), 0) as valor_total
                FROM carrinhos c
                LEFT JOIN carrinho_itens ci ON c.id_carrinho = ci.id_carrinho
                WHERE c.id_carrinho = $1
                GROUP BY c.id_carrinho, c.status, c.data_criacao
            `,
        [id_carrinho]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Carrinho não encontrado" });
      }

      console.log(`✅ Resumo do carrinho ${id_carrinho} obtido`);
      res.json(result.rows[0]);
    } catch (err) {
      console.error("❌ Erro ao buscar resumo do carrinho:", err.message);
      res.status(500).json({ error: "Erro ao buscar resumo do carrinho" });
    }
  });

  return router;
};
