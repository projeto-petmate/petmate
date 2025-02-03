import { createContext, useState } from "react";

export const UserContext = createContext()

export const UserContextProvider = ({children}) => {


    const[inptNomeCadastro, setInptNomeCadastro] = useState('')
    const[inptEmailCadastro, setInptEmailCadastro] = useState('')
    const[inptSenhaCadastro, setInptSenhaCadastro] = useState('')
    const[inptEnderecoCadastro, setInptEnderecoCadastro] = useState('')
    const[inptCpfCadastro, setInptCpfCadastro] = useState('')
    const[inptTelefoneCadastro, setInptTelefoneCadastro] = useState('')
    const [termosCadastro, setTermosCadastro] = useState(false)
    const [ users, setUsers ] = useState([ ])
    // const [ pet, setPet ] = useState() 



const addUser = (novoUser) => {

    setUsers([...users, novoUser])

}

   


return(
    <UserContext.Provider value={{ 

        inptNomeCadastro, setInptNomeCadastro,
        inptEmailCadastro, setInptEmailCadastro,
        inptSenhaCadastro, setInptSenhaCadastro,
        inptTelefoneCadastro, setInptTelefoneCadastro,
        inptEnderecoCadastro, setInptEnderecoCadastro,
        inptCpfCadastro, setInptCpfCadastro,
        termosCadastro, setTermosCadastro,
        users, setUsers, addUser
              }}>
                {children}
    </UserContext.Provider>
    )
}