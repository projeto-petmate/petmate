import { createContext, useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { addComentario, addUsuario, getComentarios } from "../apiService";

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {


    const [inptNomeCadastro, setInptNomeCadastro] = useState('')
    const [inptEmailCadastro, setInptEmailCadastro] = useState('')
    const [inptSenhaCadastro, setInptSenhaCadastro] = useState('')
    const [inptEnderecoCadastro, setInptEnderecoCadastro] = useState('')
    const [inptCpfCadastro, setInptCpfCadastro] = useState('')
    const [inptTelefoneCadastro, setInptTelefoneCadastro] = useState('')
    const [inptEstadoUser, setInptEstadoUser] = useState('')
    const [inptCidadeUser, setInptCidadeUser] = useState('')
    const [inptBairroUser, setInptBairroUser] = useState('')
    const [inptGeneroUser, setInptGeneroUser] = useState('')
    const [termosCadastro, setTermosCadastro] = useState(false)
    const [users, setUsers] = useState([])
    const [comentarios, setComentarios] = useState([])
    const { userLogado } = useContext(GlobalContext);

    const addUser = async (novoUser) => {
        try {
            const response = await addUsuario(novoUser);
            
            setUsers([...users, response.data]);
            
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
            throw error; 
        }
    }

const adicionarComentario = async (novoComentario) => {
    try {
        if (!userLogado) {
            throw new Error("Usuário não está logado ou ID do usuário não encontrado");
        }

        const comentarioData = {
            ...novoComentario,
            id_usuario: userLogado.tipo === 'user' ? userLogado.id_usuario : novoComentario.id_usuario,
            id_ong: userLogado.tipo === 'ong' ? userLogado.id_ong : novoComentario.id_ong,
        };

        const response = await addComentario(comentarioData);
        setComentarios((prevComentarios) => [...prevComentarios, response]);
    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
    }
};
    const fetchComentarios = async () => {
        try {
            const response = await getComentarios();
            setComentarios(response.data);
        } catch (error) {
            console.error("Erro ao buscar comentarios:", error);
        }
    };




    return (
        <UserContext.Provider value={{

            inptNomeCadastro, setInptNomeCadastro,
            inptEmailCadastro, setInptEmailCadastro,
            inptSenhaCadastro, setInptSenhaCadastro,
            inptTelefoneCadastro, setInptTelefoneCadastro,
            inptEnderecoCadastro, setInptEnderecoCadastro,
            inptCpfCadastro, setInptCpfCadastro,
            inptEstadoUser, setInptEstadoUser,
            inptCidadeUser, setInptCidadeUser,
            inptBairroUser, setInptBairroUser,
            inptGeneroUser, setInptGeneroUser,
            termosCadastro, setTermosCadastro,
            users, setUsers, addUser,
            comentarios, setComentarios, adicionarComentario,
            fetchComentarios
        }}>
            {children}
        </UserContext.Provider>
    )
}