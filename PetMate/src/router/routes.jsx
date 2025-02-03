import { createBrowserRouter } from "react-router-dom"; 
import Contato from "../pages/Contato";
import Adotar from "../pages/Adotar";
import Landing from "../pages/Landing";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import Inicial from "../pages/Inicial";
import Perfil from "../pages/Perfil";

const router = createBrowserRouter([
    {path: "/", element: <Landing />},
    {path: "/home", element: <Inicial />},
    {path: "/contato", element: <Contato />},
    {path: "/adotar", element: <Adotar />},
    {path: "/contato", element: <Contato />},
    {path: "/cadastro", element: <Cadastro />},
    {path: "/login", element: <Login />},
    {path: "/perfil", element: <Perfil/>},

])

export default router;
