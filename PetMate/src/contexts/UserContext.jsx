import { createContext, useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import axios from 'axios';

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

    const addUser = (novoUser) => {
        setUsers([...users, novoUser])
    }


    const addComentario = async (novoComentario) => {
        try {
            if (!userLogado || !userLogado.id_usuario) {
                throw new Error("Usuário não está logado ou ID do usuário não encontrado");
            }
    
            const comentarioData = {
                ...novoComentario,
                id_usuario: userLogado.id_usuario, 
            };
    
            const response = await axios.post("http://localhost:3000/comentarios", comentarioData);
            setComentarios((prevComentarios) => [...prevComentarios, response.data]); 
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
        }
    };

    const fetchComentarios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/comentarios");
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
            comentarios, setComentarios, addComentario,
            fetchComentarios
        }}>
            {children}
        </UserContext.Provider>
    )
}