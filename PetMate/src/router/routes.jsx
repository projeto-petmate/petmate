import { createBrowserRouter } from "react-router-dom"; 
import Contato from "../pages/Contato";
import Adotar from "../pages/Adotar";
import Landing from "../pages/Landing";
import Cadastro from "../pages/Cadastro";
import CadastroONG from "../components/CadastroONG";
import Login from "../pages/Login";
import Inicial from "../pages/Inicial";
import Perfil from "../pages/Perfil";
import Feedback from "../pages/Feedback";
import Ongs from "../pages/Ongs";

const router = createBrowserRouter([
    {path: "/", element: <Landing />},
    {path: "/home", element: <Inicial />},
    {path: "/contato", element: <Contato />},
    {path: "/adotar", element: <Adotar />},
    {path: "/contato", element: <Contato />},
    {path: "/cadastro", element: <Cadastro />},
    {path: "/CadastroONG", element: <CadastroONG />},
    {path: "/ongs", element: <Ongs />},
    {path: "/login", element: <Login />},
    {path: "/perfil", element: <Perfil/>},
    {path: "/feedback", element: <Feedback/>},

])

export default router;