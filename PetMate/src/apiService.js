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
    if (!email) {
        console.error("Erro: Email do usuário não fornecido.");
        throw new Error("Email do usuário não fornecido.");
    }
    try {
        const response = await api.get(`/users/email/${email}`);
        return response.data.exists; 
    } catch (error) {
        console.error('Erro ao buscar usuário ou ONG:', error);
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


export const listarDenuncias = async () => {
    try {
        const response = await api.get('/denuncias');
        return response.data; 
    } catch (error) {
        console.error('Erro ao listar denúncias:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const buscarDenunciaPorId = async (id) => {
    try {
        const response = await api.get(`/denuncias/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const criarDenuncia = async (denuncia) => {
    try {
        const response = await api.post('/denuncias', denuncia);
        return response.data; 
    } catch (error) {
        console.error('Erro ao criar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export const atualizarDenuncia = async (id, denuncia) => {
    try {
        const response = await api.put(`/denuncias/${id}`, denuncia);
        return response.data; 
    } catch (error) {
        console.error('Erro ao atualizar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deletarDenuncia = async (id) => {
    try {
        const response = await api.delete(`/denuncias/${id}`);
        return response.data; 
    } catch (error) {
        console.error('Erro ao deletar denúncia:', error.response ? error.response.data : error.message);
        throw error;
    }
};