import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', 
});

// Users
export const getUsuarios = async () => {
    const response = await api.get('/usuarios');
    return response.data;
};

export const getUsuarioById = async (id) => {
    if (!id) {
        console.error("Erro: ID do usuário não fornecido.");
        throw new Error("ID do usuário não fornecido.");
    }
    const response = await api.get(`/usuarios/id/${id}`);
    return response.data;
};

export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`/users/email/${email}`);
        return response.data.exists; 
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false; 
        }
        console.error('Erro ao verificar email:', error);
        throw error;
    }
};

export const getOngByEmail = async (email) => {
    if (!email) {
        console.error("Erro: Email da ONG não fornecido.");
        throw new Error("Email da ONG não fornecido.");
    }
    const response = await api.get(`/ong/email/${email}`)
    return response.data
}


export const verificarEmailUnico = async (email) => {
    try {
        const response = await api.get(`/usuarios/verificar-email?email=${email}`);
        return response.data.existe;
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return false; 
    }
};

export const verificarCpfUnico = async (cpf) => {
    try {
        const response = await api.get(`/usuarios/verificar-cpf?cpf=${cpf}`);
        return response.data.existe;
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        return false;
    }
}

export const verificarCpnjUnico = async (cnpj) => {
    try {
        const response = await api.get(`/ongs/verificar-cnpj?cnpj=${cnpj}`)
        return response.data.existe;
    } catch (error) {
        console.error('Erro ao verificar CNPJ:', error)
        return false
    }
}

export const addUsuario = async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
};

export const updateUsuario = async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
};

export const deleteUsuario = async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
};

export const updateFavoritos = async (id_usuario, favoritos) => {
    try {
        const response = await axios.put(`http://localhost:3000/usuarios/${id_usuario}/favoritos`, {
            favoritos,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar favoritos no backend:', error);
        throw error;
    }
};

// Pets
export const getPets = async () => {
    const response = await api.get('/pets');
    return response.data;
};

export const getPetById = async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
};

export const addPet = async (pet) => {
    const response = await api.post('/pets', pet);
    return response.data;
};

export const updatePet = async (id, pet) => {
    const response = await api.put(`/pets/${id}`, pet);
    return response.data;
};

export const deletePet = async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
};

// ONGs
export const getOngs = async () => {
    const response = await api.get('/ongs');
    return response.data;
};

export const getOngById = async (id) => {
    if (!id) {
        console.error("Erro: ID da ONG não fornecido.");
        throw new Error("ID da ONG não fornecido.");
    }
    const response = await api.get(`/ongs/${id}`);
    return response.data;
};
export const addOng = async (ong) => {
    try {
        const response = await api.post('/ongs', ong);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar ONG:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateOng = async (id, ong) => {
    const response = await api.put(`/ongs/${id}`, ong);
    return response.data;
};

export const deleteOng = async (id) => {
    const response = await api.delete(`/ongs/${id}`);
    return response.data;
};

// Comentários
export const getComentarios = async () => {
    const response = await api.get('/comentarios');
    return response.data;
};

export const getComentarioById = async (id) => {
    const response = await api.get(`/comentarios/${id}`);
    return response.data;
};

export const addComentario = async (comentario) => {
    const response = await api.post('/comentarios', comentario);
    return response.data;
};

export const updateComentario = async (id, comentario) => {
    const response = await api.put(`/comentarios/${id}`, comentario);
    return response.data;
};

export const deleteComentario = async (id) => {
    const response = await api.delete(`/comentarios/${id}`);
    return response.data;
};


//Login
export const loginUser = async (email, senha) => {
    const response = await api.post('/login/', {email, senha})
    return response.data;
}

export const loginOng = async (email, senha) => {
    const response = await api.post('/loginOng/', {email, senha})
    return response.data;
}

//Recuperar senha
export const enviarCodigoRecuperacao = async (email) => {
    try {
        const response = await api.post('/recuperar-senha', { email });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar código de recuperação:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const verificarCodigoRecuperacao = async (email, codigo) => {
    try {
        const response = await api.post('/verificar-codigo', { email, codigo });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar código de recuperação:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const redefinirSenha = async (email, novaSenha) => {
    try {
        const response = await api.post('/redefinir-senha', { email, novaSenha });
        return response.data;
    } catch (error) {
        console.error('Erro ao redefinir senha:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export const getDenuncias = async () => {
    try {
        const response = await api.get('/denuncias');
        return response.data; 
    } catch (error) {
        console.error('Erro ao listar denúncias:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getDenunciaById = async (id) => {
    try {
        const response = await api.get(`/denuncias/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addDenuncia = async (denuncia) => {
    try {
        const response = await api.post('/denuncias', denuncia);
        return response.data; 
    } catch (error) {
        console.error('Erro ao criar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export const updateDenuncia = async (id, denuncia) => {
    try {
        const response = await api.put(`/denuncias/${id}`, denuncia);
        return response.data; 
    } catch (error) {
        console.error('Erro ao atualizar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteDenuncia = async (id) => {
    try {
        const response = await api.delete(`/denuncias/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Erro ao deletar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};


/**
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const uploadPetImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
};

/**
 * @param {File} file 
 * @returns {Promise<{imageUrl: string, openModalAnalisar: string}>}
 */
export const analyzePetColors = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/analise/analise-cores-pet', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Erro na análise de cores do pet:', error);
        throw error;
    }
};

// Carrinhos
export const getCarrinhos = async (id_usuario = null, id_ong = null) => {
    try {
        let url = '/carrinhos';
        const params = new URLSearchParams();
        
        if (id_usuario) params.append('id_usuario', id_usuario);
        if (id_ong) params.append('id_ong', id_ong);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar carrinhos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCarrinhoById = async (id) => {
    try {
        const response = await api.get(`/carrinhos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCarrinhosByUsuario = async (id_usuario) => {
    try {
        const response = await api.get(`/carrinhos/usuario/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar carrinhos do usuário:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCarrinhosByOng = async (id_ong) => {
    try {
        const response = await api.get(`/carrinhos/ong/${id_ong}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar carrinhos da ONG:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addCarrinho = async (carrinho) => {
    try {
        const response = await api.post('/carrinhos', carrinho);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateCarrinho = async (id, carrinho) => {
    try {
        const response = await api.put(`/carrinhos/${id}`, carrinho);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteCarrinho = async (id) => {
    try {
        const response = await api.delete(`/carrinhos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Coleiras (Pedidos de Coleiras)
export const getColeiras = async () => {
    try {
        const response = await api.get('/coleiras');
        return response.data;
    } catch (error) {
        console.error('Erro ao listar coleiras:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getColeiraById = async (id) => {
    try {
        const response = await api.get(`/coleiras/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar coleira:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addColeira = async (coleira) => {
    try {
        const response = await api.post('/coleiras', coleira);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar pedido de coleira:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateColeira = async (id, coleira) => {
    try {
        const response = await api.put(`/coleiras/${id}`, coleira);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar pedido de coleira:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteColeira = async (id) => {
    try {
        const response = await api.delete(`/coleiras/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar pedido de coleira:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getColeirasDoCarrinho = async (id_carrinho) => {
    try {
        const response = await api.get(`/coleiras/carrinhos/${id_carrinho}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar coleiras do carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getQuantidadeItensCarrinho = async ({ id_usuario = null, id_ong = null }) => {
    try {
        const query = [];
        if (id_usuario) query.push(`id_usuario=${id_usuario}`);
        if (id_ong) query.push(`id_ong=${id_ong}`);
        const url = `/carrinhos/quantidade${query.length ? `?${query.join('&')}` : ''}`;
        const response = await api.get(url);
        return response.data.quantidade || 0;
    } catch (error) {
        console.error('Erro ao buscar quantidade de itens do carrinho:', error.response ? error.response.data : error.message);
        return 0;
    }
};


// CARRINHO ITENS - Itens temporários no carrinho
export const getCarrinhoItens = async (id_carrinho) => {
    try {
        const response = await api.get(`/carrinho-itens/carrinho/${id_carrinho}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getCarrinhoResumo = async (id_carrinho) => {
    try {
        const response = await api.get(`/carrinho-itens/carrinho/${id_carrinho}/resumo`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar resumo do carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addItemCarrinho = async (id_carrinho, item) => {
    try {
        // item já deve conter os campos fixos
        const response = await api.post(`/carrinho-itens/carrinho/${id_carrinho}/item`, item);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateItemCarrinho = async (id_item, item) => {
    try {
        const response = await api.put(`/carrinho-itens/item/${id_item}`, item);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar item do carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteItemCarrinho = async (id_item) => {
    try {
        const response = await api.delete(`/carrinho-itens/item/${id_item}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// PEDIDOS - Pedidos finalizados
export const getPedidos = async (filtros = {}) => {
    try {
        const params = new URLSearchParams(filtros);
        const url = `/pedidos${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pedidos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getPedidoById = async (id_pedido) => {
    try {
        const response = await api.get(`/pedidos/${id_pedido}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedido:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getPedidosByUsuario = async (id_usuario, status = null) => {
    try {
        const url = `/pedidos/usuario/${id_usuario}${status ? `?status=${status}` : ''}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos do usuário:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getPedidosByOng = async (id_ong, status = null) => {
    try {
        const url = `/pedidos/ong/${id_ong}${status ? `?status=${status}` : ''}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos da ONG:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const finalizarCarrinho = async (id_carrinho, dadosPedido) => {
    try {
        const response = await api.post(`/pedidos/finalizar-carrinho/${id_carrinho}`, dadosPedido);
        return response.data;
    } catch (error) {
        console.error('Erro ao finalizar carrinho:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const criarPedidoDireto = async (pedido) => {
    try {
        const response = await api.post('/pedidos', pedido);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pedido:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateStatusPedido = async (id_pedido, status, codigo_rastreamento = null) => {
    try {
        const dados = { status };
        if (codigo_rastreamento) {
            dados.codigo_rastreamento = codigo_rastreamento;
        }
        const response = await api.put(`/pedidos/${id_pedido}/status`, dados);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// PEDIDOS ITENS - Gestão de produção
export const getPedidoItens = async (id_pedido) => {
    try {
        const response = await api.get(`/pedidos-itens/pedido/${id_pedido}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar itens do pedido:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getPedidoItemById = async (id_item_pedido) => {
    try {
        const response = await api.get(`/pedidos-itens/item/${id_item_pedido}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar item do pedido:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateStatusItemPedido = async (id_item_pedido, status, observacoes = null) => {
    try {
        const dados = { status };
        if (observacoes) {
            dados.observacoes_producao = observacoes;
        }
        const response = await api.put(`/pedidos-itens/item/${id_item_pedido}/status`, dados);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status do item:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getItensByStatus = async (status, limite = 50) => {
    try {
        const response = await api.get(`/pedidos-itens/status/${status}?limite=${limite}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar itens por status:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getDashboardProducao = async () => {
    try {
        const response = await api.get('/pedidos-itens/dashboard/producao');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dashboard de produção:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getHistoricoItem = async (id_item_pedido) => {
    try {
        const response = await api.get(`/pedidos-itens/item/${id_item_pedido}/historico`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar histórico do item:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateEspecificacoesPedidoItem = async (id_item_pedido, especificacoes, observacoes = null) => {
    try {
        const dados = { especificacoes };
        if (observacoes) {
            dados.observacoes_producao = observacoes;
        }
        const response = await api.put(`/pedidos-itens/item/${id_item_pedido}/especificacoes`, dados);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar especificações:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// FUNÇÕES AUXILIARES PARA WORKFLOW COMPLETO
// export const criarColeiraComAnaliseIA = async (imagemPet, id_carrinho, dadosAdicionais = {}) => {
//     try {
//         // 1. Analisar cores do pet com IA
//         const analise = await analyzePetColors(imagemPet);
        
//         // 2. Criar item no carrinho com sugestões da IA
//         const itemColeira = {
//             produto_tipo: 'coleira',
//             especificacoes: {
//                 cor_primaria: analise.analise.cores_dominantes[0] || '#000000',
//                 cor_secundaria: analise.analise.cores_dominantes[1] || '#FFFFFF',
//                 tamanho: dadosAdicionais.tamanho || 'M',
//                 material: dadosAdicionais.material || 'nylon',
//                 observacoes: `Coleira sugerida pela IA: ${analise.analise.descricao}`,
//                 imagem_referencia: analise.imageUrl,
//                 ...dadosAdicionais.especificacoes
//             },
//             preco: dadosAdicionais.preco || 29.99,
//             quantidade: dadosAdicionais.quantidade || 1
//         };
        
//         const itemAdicionado = await addItemCarrinho(id_carrinho, itemColeira);
        
//         return {
//             analise: analise,
//             item: itemAdicionado
//         };
//     } catch (error) {
//         console.error('Erro ao criar coleira com análise IA:', error);
//         throw error;
//     }
// };