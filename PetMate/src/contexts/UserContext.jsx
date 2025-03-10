import { createContext, useState } from "react";
import axios from 'axios';

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {


    const [inptNomeCadastro, setInptNomeCadastro] = useState('')
    const [inptEmailCadastro, setInptEmailCadastro] = useState('')
    const [inptSenhaCadastro, setInptSenhaCadastro] = useState('')
    const [inptEnderecoCadastro, setInptEnderecoCadastro] = useState('')
    const [inptCpfCadastro, setInptCpfCadastro] = useState('')
    const [inptTelefoneCadastro, setInptTelefoneCadastro] = useState('')
    const [termosCadastro, setTermosCadastro] = useState(false)
    const [users, setUsers] = useState([])
    const [comentarios, setComentarios] = useState([])
    

    const addUser = (novoUser) => {
        setUsers([...users, novoUser])
    }



    const addComentario = async (novoComentario) => {
        try {
            const userLogado = JSON.parse(localStorage.getItem("userLogado"));
            if (!userLogado || !userLogado.id_usuario) {
                throw new Error("Usuário não está logado ou ID do usuário não encontrado");
            }
    
            const comentarioData = {
                ...novoComentario,
                id_usuario: userLogado.id_usuario 
            };
    
            const response = await axios.post("http://localhost:3000/comentarios", comentarioData);
            setComentarios([...comentarios, response.data]);
        } catch (error) {
            console.error("Erro ao adicionar comentario:", error);
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
            termosCadastro, setTermosCadastro,
            users, setUsers, addUser,
            comentarios, setComentarios, addComentario,
            fetchComentarios
        }}>
            {children}
        </UserContext.Provider>
    )
}