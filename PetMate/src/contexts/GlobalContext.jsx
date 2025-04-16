import { createContext, useState, useEffect } from "react";
import { getUsuarioById, getOngById, updateUsuario as apiUpdateUsuario, deleteUsuario as apiDeleteUsuario } from '../apiService';

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [logado, setLogado] = useState(false);
    const [userLogado, setUserLogado] = useState({
        id: null,
        nome: '',
        email: '',
        senha: '',
        endereco: '',
        telefone: '',
        cpf: '',
        favoritos: '',
        imagem: '',
        tipo: '',
    });
    const [token, setToken] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [ongs, setOngs] = useState([]);

    useEffect(() => {
        const fetchLoggedUser = async () => {
            if (!token) return; 

            try {
                const response = await fetch('http://localhost:3000/loggedUser', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserLogado(data.user);
                    setLogado(true);
                } else {
                    setLogado(false);
                }
            } catch (error) {
                console.error("Erro ao buscar usuário logado:", error);
                setLogado(false);
            }
        };

        fetchLoggedUser();
    }, [token]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await getUsuarioById();
                setUsuarios(data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        const fetchOngs = async () => {
            try {
                const data = await getOngById();
                setOngs(data);
            } catch (error) {
                console.error("Erro ao buscar ONGs:", error);
            }
        };

        fetchUsuarios();
        fetchOngs();
    }, []);

    const Logar = async (email, senha) => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserLogado(data.user);
                setToken(data.token);
                setLogado(true);
            } else {
                const errorData = await response.json();
                return { error: errorData.error };
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            return { error: "Erro ao realizar login" };
        }
    };

    const Logout = () => {
        setLogado(false);
        setUserLogado({
            id: null,
            nome: '',
            email: '',
            senha: '',
            endereco: '',
            telefone: '',
            cpf: '',
            favoritos: '',
            imagem: '',
            tipo: '',
        });
        setToken(null); 
    };

    const updateUsuario = async (id, updatedData) => {
        try {
            const updatedUser = await apiUpdateUsuario(id, updatedData);
            setUserLogado((prevUser) => ({
                ...prevUser,
                ...updatedUser,
            }));
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    };

    const deleteUsuario = async (id) => {
        try {
            await apiDeleteUsuario(id);
            Logout();
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                logado,
                userLogado,
                token,
                Logar,
                Logout,
                updateUsuario,
                deleteUsuario,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};