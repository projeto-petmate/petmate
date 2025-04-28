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
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
};


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
    const response = await api.put('/login/', {email, senha})
    return response.data;
}

export const loginOng = async (email, senha) => {
    const response = await api.put('/loginOng/', {email, senha})
    return response.data;
}