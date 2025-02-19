import { createContext, useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import { getUsuarioById, updateUsuario as apiUpdateUsuario, deleteUsuario as apiDeleteUsuario } from '../apiService';

export const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [logado, setLogado] = useState(() => {
        const savedLogado = localStorage.getItem("logado");
        return savedLogado !== null ? JSON.parse(savedLogado) : false;
    });
    const [mudarTipo, setMudarTipo] = useState(false);
    const [userLogado, setUserLogado] = useState(() => {
        const savedUserLogado = localStorage.getItem("userLogado");
        return savedUserLogado !== null ? JSON.parse(savedUserLogado) : null;
    });
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        localStorage.setItem("logado", JSON.stringify(logado));
        localStorage.setItem("userLogado", JSON.stringify(userLogado));
    }, [logado, userLogado]);

    const Logar = (email, senha) => {
        const usuario = usuarios.find((user) => user.email === email);
        if (usuario) {
            if (usuario.senha === senha) {
                setUserLogado(usuario);
                setLogado(true);
                localStorage.setItem("logado", JSON.stringify(true));
                localStorage.setItem("userLogado", JSON.stringify(usuario));
            } else {
                return { error: "Senha incorreta" };
            }
        } else {
            return { error: "Usuário não encontrado" };
        }
    };

    const Logout = () => {
        setLogado(false);
        setUserLogado(null);
        localStorage.removeItem("logado");
        localStorage.removeItem("userLogado");
    };

    const MostrarSenha = () => {
        const inputSenha = document.getElementById('inputSenha');
        if (inputSenha.type === 'password') {
            setMudarTipo(true);
            inputSenha.type = 'text';
        } else {
            setMudarTipo(false);
            inputSenha.type = 'password';
        }
    };

    const PhoneInput = () => {
        return (
            <div>
                <InputMask
                    mask="(99) 999999999"
                    placeholder="(XX) XXXXX-XXXX"
                >
                    {(inputProps) => <input {...inputProps} type="tel" />}
                </InputMask>
            </div>
        );
    };

    const CpfInput = () => {
        return (
            <div>
                <InputMask
                    mask="999.999.999-99"
                    placeholder="XXX.XXX.XXX-XX"
                >
                    {(inputProps) => <input {...inputProps} type="text" />}
                </InputMask>
            </div>
        );
    };

    const updateUsuario = async (id, updatedData) => {
        try {
            const updatedUser = await apiUpdateUsuario(id, updatedData);
            setUserLogado(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;
        }
    };
    

    const deleteUsuario = async (id) => {
        try {
            await apiDeleteUsuario(id);
            Logout();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw error;
        }
    };

    return (
        <GlobalContext.Provider value={{
            mudarTipo,
            MostrarSenha,
            logado,
            Logar,
            Logout,
            PhoneInput,
            CpfInput,
            userLogado,
            setUserLogado,
            updateUsuario,
            deleteUsuario
        }}>
            {children}
        </GlobalContext.Provider>
    );
};