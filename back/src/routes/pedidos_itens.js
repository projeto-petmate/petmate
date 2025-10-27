const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // Itens de pedidos finalizados

  // GET - Listar itens de um pedido específico
  router.get("/pedido/:id_pedido", async (req, res) => {
    const { id_pedido } = req.params;

    try {
      console.log(`📦 Buscando itens do pedido ${id_pedido}`);

      const result = await pool.query(
        `
                SELECT 
                    pi.*,
                    p.status as status_pedido,
                    p.data_pedido
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_pedido = $1 
                ORDER BY pi.id_item_pedido
            `,
        [id_pedido]
      );

      console.log(`✅ Encontrados ${result.rows.length} itens no pedido`);
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Erro ao buscar itens do pedido:", err.message);
      res.status(500).json({ error: "Erro ao buscar itens do pedido" });
    }
  });

  // GET - Buscar item específico por ID
  router.get("/item/:id_item_pedido", async (req, res) => {
    const { id_item_pedido } = req.params;

    try {
      console.log(`🔍 Buscando item do pedido ${id_item_pedido}`);

      const result = await pool.query(
        `
                SELECT 
                    pi.*,
                    p.status as status_pedido,
                    p.data_pedido,
                    p.id_usuario,
                    p.id_ong
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_item_pedido = $1
            `,
        [id_item_pedido]
      );

      if (result.rows.length === 0) {
        console.log(`⚠️ Item do pedido ${id_item_pedido} não encontrado`);
        return res.status(404).json({ error: "Item do pedido não encontrado" });
      }

      console.log(`✅ Item do pedido ${id_item_pedido} encontrado`);
      res.json(result.rows[0]);
    } catch (err) {
      console.error("❌ Erro ao buscar item do pedido:", err.message);
      res.status(500).json({ error: "Erro ao buscar item do pedido" });
    }
  });

  // PUT - Atualizar status de produção do item
  router.put("/item/:id_item_pedido/status", async (req, res) => {
    const { id_item_pedido } = req.params;
    const { status } = req.body;

    const statusValidos = [
      "aguardando_producao",
      "em_producao",
      "finalizado",
      "cancelado",
    ];

    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        error: "Status inválido",
        statusValidos: statusValidos,
      });
    }

    try {
      console.log(
        `🔧 Atualizando status do item ${id_item_pedido} para: ${status}`
      );

      const result = await pool.query(
        `
                UPDATE pedidos_itens 
                SET status = $1
                WHERE id_item_pedido = $2
                RETURNING *
            `,
        [status, id_item_pedido]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item do pedido não encontrado" });
      }

      console.log(
        `✅ Status do item ${id_item_pedido} atualizado para: ${status}`
      );
      res.json({
        message: "Status do item atualizado com sucesso",
        item: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Erro ao atualizar status do item:", err.message);
      res.status(500).json({ error: "Erro ao atualizar status do item" });
    }
  });

  // GET - Listar itens por status de produção
  router.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    const { limite = 50 } = req.query;

    const statusValidos = [
      "aguardando_producao",
      "em_producao",
      "finalizado",
      "cancelado",
    ];

    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        error: "Status inválido",
        statusValidos: statusValidos,
      });
    }

    try {
      console.log(`🔍 Buscando itens com status: ${status}`);

      const result = await pool.query(
        `
                SELECT 
                    pi.*,
                    p.status as status_pedido,
                    p.data_pedido,
                    p.id_usuario,
                    p.id_ong
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.status = $1
                ORDER BY pi.id_item_pedido ASC
                LIMIT $2
            `,
        [status, limite]
      );

      console.log(
        `✅ Encontrados ${result.rows.length} itens com status: ${status}`
      );
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Erro ao buscar itens por status:", err.message);
      res.status(500).json({ error: "Erro ao buscar itens por status" });
    }
  });

  // GET - Dashboard de produção (resumo por status)
  router.get("/dashboard/producao", async (req, res) => {
    try {
      console.log("📊 Gerando dashboard de produção");

      const result = await pool.query(`
                SELECT 
                    pi.status,
                    COUNT(pi.id_item_pedido) as quantidade,
                    COALESCE(SUM(pi.valor), 0) as valor_total,
                    COUNT(DISTINCT pi.id_pedido) as pedidos_diferentes
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE p.status NOT IN ('cancelado')
                GROUP BY pi.status
                ORDER BY 
                    CASE pi.status
                        WHEN 'aguardando_producao' THEN 1
                        WHEN 'em_producao' THEN 2
                        WHEN 'finalizado' THEN 3
                        ELSE 4
                    END
            `);

      // Organizar dados por status
      const dashboard = {
        aguardando_producao: [],
        em_producao: [],
        finalizado: [],
        cancelado: [],
        totais: {
          itens: 0,
          valor: 0,
          pedidos: new Set(),
        },
      };

      result.rows.forEach((row) => {
        if (dashboard[row.status]) {
          dashboard[row.status].push(row);
        }
        dashboard.totais.itens += parseInt(row.quantidade);
        dashboard.totais.valor += parseFloat(row.valor_total);
        dashboard.totais.pedidos.add(row.pedidos_diferentes);
      });

      dashboard.totais.pedidos = dashboard.totais.pedidos.size;

      console.log("✅ Dashboard de produção gerado");
      res.json(dashboard);
    } catch (err) {
      console.error("❌ Erro ao gerar dashboard:", err.message);
      res.status(500).json({ error: "Erro ao gerar dashboard" });
    }
  });

  // GET - Histórico de produção de um item
  router.get("/item/:id_item_pedido/historico", async (req, res) => {
    const { id_item_pedido } = req.params;

    try {
      console.log(`📜 Buscando histórico do item ${id_item_pedido}`);

      const result = await pool.query(
        `
                SELECT 
                    pi.*,
                    p.status as status_pedido,
                    p.data_pedido
                FROM pedidos_itens pi
                JOIN pedidos p ON pi.id_pedido = p.id_pedido
                WHERE pi.id_item_pedido = $1
            `,
        [id_item_pedido]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      const item = result.rows[0];

      const timeline = [
        {
          evento: "Pedido criado",
          data: item.data_pedido,
          status: "pedido_criado",
        },
        {
          evento: `Status atual: ${item.status}`,
          data: new Date(),
          status: item.status,
        },
      ];

      console.log(`✅ Histórico do item ${id_item_pedido} obtido`);
      res.json({
        item: item,
        timeline: timeline.sort((a, b) => new Date(a.data) - new Date(b.data)),
      });
    } catch (err) {
      console.error("❌ Erro ao buscar histórico:", err.message);
      res.status(500).json({ error: "Erro ao buscar histórico" });
    }
  });

  // PUT - Atualizar informações do item (modelo, cores, etc.)
  router.put("/item/:id_item_pedido/detalhes", async (req, res) => {
    const { id_item_pedido } = req.params;
    const {
      modelo,
      tamanho,
      cor_tecido,
      cor_logo,
      cor_argola,
      cor_presilha,
      valor,
      imagem,
      id_maquina,
    } = req.body;

    try {
      console.log(`🔧 Atualizando detalhes do item ${id_item_pedido}`);

      const result = await pool.query(
        `
                UPDATE pedidos_itens 
                SET modelo = COALESCE($1, modelo),
                    tamanho = COALESCE($2, tamanho),
                    cor_tecido = COALESCE($3, cor_tecido),
                    cor_logo = COALESCE($4, cor_logo),
                    cor_argola = COALESCE($5, cor_argola),
                    cor_presilha = COALESCE($6, cor_presilha),
                    valor = COALESCE($7, valor),
                    imagem = COALESCE($8, imagem),
                    id_maquina = COALESCE($9, id_maquina)
                WHERE id_item_pedido = $10
                RETURNING *
            `,
        [
          modelo,
          tamanho,
          cor_tecido,
          cor_logo,
          cor_argola,
          cor_presilha,
          valor,
          imagem,
          id_maquina,
          id_item_pedido,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item do pedido não encontrado" });
      }

      console.log(`✅ Detalhes do item ${id_item_pedido} atualizados`);
      res.json({
        message: "Detalhes do item atualizados com sucesso",
        item: result.rows[0],
      });
    } catch (err) {
      console.error("❌ Erro ao atualizar detalhes do item:", err.message);
      res.status(500).json({ error: "Erro ao atualizar detalhes do item" });
    }
  });

  // GET - Buscar itens de pedidos por ID (usuário ou ONG)
  router.get("/buscar/:id", async (req, res) => {
    const { id } = req.params;
    const { status, limite = 100 } = req.query;

    try {
      console.log(`🔍 Buscando itens de pedidos para ID: ${id}`);

      let tabela = null;
      let campoId = null;

      // Verificar se o ID existe na tabela de usuários
      const buscaUser = await pool.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = $1",
        [id]
      );

      // Caso não exista, pesquisar na tabela de ONGs
      if (buscaUser.rows.length === 0) {
        const buscaOng = await pool.query(
          "SELECT id_ong FROM ongs WHERE id_ong = $1",
          [id]
        );

        // Caso não exista usuário nem ONG com esse ID, retorna erro 404
        if (buscaOng.rows.length === 0) {
          console.log(`❌ ID ${id} não encontrado em usuários nem ONGs`);
          return res.status(404).json({
            message: "ID não encontrado em usuários nem ONGs.",
            id_fornecido: id,
          });
        } else {
          // Caso a ONG exista, define como ONG
          tabela = "ongs";
          campoId = "id_ong";
          console.log(`✅ ID ${id} encontrado como ONG`);
        }
      } else {
        // Caso exista o usuário, define como usuário
        tabela = "usuarios";
        campoId = "id_usuario";
        console.log(`✅ ID ${id} encontrado como usuário`);
      }

      // Construir query baseada no tipo identificado
      let query = `
            SELECT 
                pi.*,
                p.status as status_pedido,
                p.data_pedido,
                p.endereco_entrega,
                p.valor_total as valor_total_pedido,
                p.id_usuario,
                p.id_ong
            FROM pedidos_itens pi
            JOIN pedidos p ON pi.id_pedido = p.id_pedido
            WHERE p.${campoId} = $1
        `;
      const params = [id];
      let paramCount = 1;

      // Filtrar por status se fornecido
      if (status) {
        paramCount++;
        query += ` AND pi.status = $${paramCount}`;
        params.push(status);
      }

      query += `
            ORDER BY p.data_pedido DESC, pi.id_item_pedido ASC
            LIMIT $${paramCount + 1}
        `;
      params.push(limite);

      console.log(`📦 Executando busca para ${tabela} com ID ${id}`);
      const result = await pool.query(query, params);

      // Agrupar itens por pedido para melhor organização
      const itensPorPedido = {};
      result.rows.forEach((item) => {
        if (!itensPorPedido[item.id_pedido]) {
          itensPorPedido[item.id_pedido] = {
            id_pedido: item.id_pedido,
            data_pedido: item.data_pedido,
            status_pedido: item.status_pedido,
            valor_total_pedido: item.valor_total_pedido,
            endereco_entrega: item.endereco_entrega,
            id_usuario: item.id_usuario,
            id_ong: item.id_ong,
            itens: [],
          };
        }

        // Remover dados duplicados do pedido do item
        const {
          status_pedido,
          data_pedido,
          endereco_entrega,
          valor_total_pedido,
          id_usuario: itemUserId,
          id_ong: itemOngId,
          ...itemLimpo
        } = item;

        itensPorPedido[item.id_pedido].itens.push(itemLimpo);
      });

      // Estatísticas por status
      const estatisticas = {
        aguardando_producao: 0,
        em_producao: 0,
        finalizado: 0,
        cancelado: 0,
        total: result.rows.length,
      };

      result.rows.forEach((item) => {
        if (estatisticas[item.status] !== undefined) {
          estatisticas[item.status]++;
        }
      });

      console.log(
        `✅ Encontrados ${result.rows.length} itens em ${
          Object.keys(itensPorPedido).length
        } pedidos`
      );

      res.json({
        tipo_conta: tabela === "usuarios" ? "usuario" : "ong",
        id: id,
        total_itens: result.rows.length,
        total_pedidos: Object.keys(itensPorPedido).length,
        itens_por_pedido: Object.values(itensPorPedido),
        itens: result.rows, // Lista simples para compatibilidade
        estatisticas: estatisticas,
        filtros_aplicados: {
          status: status || null,
          limite: limite,
        },
      });
    } catch (err) {
      console.error("❌ Erro ao buscar itens:", err.message);
      res.status(500).json({
        error: "Erro ao buscar itens",
        detalhes: err.message,
      });
    }
  });

  return router;
};
