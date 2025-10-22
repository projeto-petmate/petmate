import { createContext, useState, useEffect } from "react";
import { getUsuarioById, getOngById, updateUsuario as apiUpdateUsuario, deleteUsuario as apiDeleteUsuario, getDenuncias, getQuantidadeItensCarrinho } from '../apiService';

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const API_BASE_URL = 'http://localhost:3000';
    const [logado, setLogado] = useState(false);
    // Debug
    const [debug, setDebug] = useState(true)
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
    const [openModalDenuncia, setOpenModalDenuncia] = useState(false)
    const [denuncias, setDenuncias] = useState([]);
    const [filtrosDenuncias, setFiltrosDenuncias] = useState({
        status: '',
        tabela: '',
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [qtdItensCarrinho, setQtdItensCarrinho] = useState(0);

    const [combinacoesCores, setCombinacoesCores] = useState({
        alternativa1: null,
        alternativa2: null
    });
    const [aplicarCoresCallback, setAplicarCoresCallback] = useState(null);
    const [sugestoes] = useState([
        {
            id: 1,
            modelo: 'Peitoral',
            tamanho: '',
            cor_tecido: 'Preto',
            cor_logo: 'Branco',
            cor_argola: 'Prata',
            cor_presilha: 'Branco',
            valor: '30.00',
            imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1758217351/pets/i4nyci8zkjlccnkn1gqd.png',
            quantidade: 1
        },
        {
            id: 2,
            modelo: 'Cabresto',
            tamanho: '',
            cor_tecido: 'Azul',
            cor_logo: 'Branco',
            cor_argola: 'Prata',
            cor_presilha: 'Preto',
            valor: '40.00',
            imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1759774404/pets/i5spm3pwsznymouxqy3s.png',
            quantidade: 1
        },
        {
            id: 3,
            modelo: 'Pescoço',
            tamanho: '',
            cor_tecido: 'Vermelho',
            cor_logo: 'Branco',
            cor_argola: 'Prata',
            cor_presilha: 'Branco',
            valor: '20.00',
            imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1759862647/pets/azykonxvryops0rumyi9.png',
            quantidade: 1
        }
    ])

    useEffect(() => {
        const fetchLoggedUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) return;

            setToken(storedToken);

            try {
                const response = await fetch(`${API_BASE_URL}/loggedUser`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const user = data.user;

                    if (user.id_usuario || user.id_ong) {
                        setUserLogado(user);
                        setLogado(true);

                        if (user.tipo === 'admin') {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }

                        await carregarQuantidadeItensCarrinho(user);
                    } else {
                        console.error("Erro: ID do usuário ou ONG não definido.");
                        setLogado(false);
                    }
                } else {
                    console.error("Token inválido ou expirado.");
                    Logout();
                }
            } catch (error) {
                console.error("Erro ao buscar usuário logado:", error);
                setLogado(false);
            }
        };

        fetchLoggedUser();
    }, []);

    const openDenuncia = async () => {
        if (logado) {
            setOpenModalDenuncia(true)
        } else {
            navigate('/login')
        }
    }

    const fetchUsuarios = async () => {
        if (!userLogado?.id) {
            console.error("Erro: ID do usuário não definido.");
            return;
        }

        try {
            const data = await getUsuarioById(userLogado.id);
            setUsuarios(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const fetchOngs = async () => {
        if (!userLogado?.id) {
            console.error("Erro: ID da ONG não definido.");
            return;
        }

        try {
            const data = await getOngById(userLogado.id);
            setOngs(data);
        } catch (error) {
            console.error("Erro ao buscar ONGs:", error);
        }
    };

    const Logar = async (email, senha, tipo) => {
        try {
            const endpoint = tipo === 'ong' ? '/loginOng' : '/login';
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;

                if (user.id_usuario || user.id_ong) {
                    setUserLogado(user);
                    setToken(data.token);
                    localStorage.setItem('token', data.token);
                    setLogado(true);

                    await carregarQuantidadeItensCarrinho(user);
                } else {
                    console.error("Erro: ID do usuário ou ONG não definido.");
                    return { error: "Erro interno: ID do usuário ou ONG não encontrado." };
                }
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
        setIsAdmin(false)
        setToken(null);
        setQtdItensCarrinho(0);
        localStorage.removeItem('token');
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


    useEffect(() => {
        const fetchDenuncias = async () => {
            try {
                const data = await getDenuncias();
                setDenuncias(data);
            } catch (error) {
                console.error('Erro ao buscar denúncias:', error);
            }
        };

        fetchDenuncias();
    }, []);

    const filtrarDenuncias = () => {
        let denunciasFiltradas = [...denuncias];

        if (filtrosDenuncias.status) {
            denunciasFiltradas = denunciasFiltradas.filter((d) => d.status === filtrosDenuncias.status);
        }

        if (filtrosDenuncias.tabela) {
            denunciasFiltradas = denunciasFiltradas.filter((d) => d.tipo_objeto === filtrosDenuncias.tabela);
        }

        return denunciasFiltradas;
    };

    if (!userLogado) {
        return <div className="loading">Carregando...</div>;
    }
    const adicionarDenuncia = (novaDenuncia) => {
        setDenuncias((prevDenuncias) => [...prevDenuncias, novaDenuncia]);
    };

    useEffect(() => {
        setIsAdmin(userLogado.tipo === 'admin');
    }, [userLogado]);

    const carregarQuantidadeItensCarrinho = async (user = userLogado) => {
        if (!user?.id_usuario && !user?.id_ong) {
            setQtdItensCarrinho(0);
            return;
        }

        try {
            const qtd = await getQuantidadeItensCarrinho({
                id_usuario: user?.id_usuario || null,
                id_ong: user?.id_ong || null
            });
            setQtdItensCarrinho(qtd || 0);
            return qtd || 0;
        } catch (error) {
            console.error('Erro ao carregar quantidade de itens no carrinho:', error);
            setQtdItensCarrinho(0);
            return 0;
        }
    };

    const sincronizarCarrinho = async () => {
        return await carregarQuantidadeItensCarrinho();
    };




    return (
        <GlobalContext.Provider
            value={{
                logado,
                userLogado,
                setUserLogado,
                token,
                Logar,
                Logout,
                updateUsuario,
                deleteUsuario,
                openDenuncia,
                openModalDenuncia,
                setOpenModalDenuncia,
                denuncias,
                setDenuncias,
                filtrosDenuncias,
                setFiltrosDenuncias,
                filtrarDenuncias,
                adicionarDenuncia,
                isAdmin,
                combinacoesCores,
                setCombinacoesCores,
                aplicarCoresCallback,
                setAplicarCoresCallback,
                qtdItensCarrinho,
                setQtdItensCarrinho,
                debug,
                sugestoes,
                carregarQuantidadeItensCarrinho,
                sincronizarCarrinho,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};