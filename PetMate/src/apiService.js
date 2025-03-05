import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001', 
});

// Users
export const getUsuarios = async () => {
    const response = await api.get('/usuarios');
    return response.data;
};

export const getUsuarioById = async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
};

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
    const response = await api.get(`/ongs/${id}`);
    return response.data;
};

export const addOng = async (ong) => {
    const response = await api.post('/ongs', ong);
    return response.data;
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