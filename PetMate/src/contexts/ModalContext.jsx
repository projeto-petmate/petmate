import { createContext, useState } from "react";

export const ModalContext = createContext()

export const ModalContextProvider = ({children}) => {

    const[openModal, setOpenModal] = useState(false)


return(
    <ModalContext.Provider value={{ 
                openModal,
                setOpenModal,
              }}>
                {children}
    </ModalContext.Provider>
    )
}