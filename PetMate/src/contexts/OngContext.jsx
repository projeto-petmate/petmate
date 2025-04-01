import { createContext, useState } from "react";

export const OngContext = createContext()

export const OngContextProvider = ({children}) => {

    const[ong, setOng] = useState()


return(
    <OngContext.Provider value={{ 
                ong,
                setOng
              }}>
                {children}
    </OngContext.Provider>
    )
}