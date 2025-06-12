// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Contato from "../pages/Contato";
// import Adotar from "../pages/Adotar";
// import Landing from "../pages/Landing";
// import Cadastro from "../pages/Cadastro";
// import CadastroONG from "../components/CadastroONG";
// import Login from "../pages/Login";
// import Inicial from "../pages/Inicial";
// import Perfil from "../pages/Perfil";
// import Feedback from "../pages/Feedback";
// import Ongs from "../pages/Ongs";
// import Gerenciamento from "../pages/Gerenciamento";
// import Favoritos from "../pages/Favoritos";
// import RecuperarSenha from "../pages/RecuperarSenha";
// import Denuncias from "../pages/Denuncias";
// import ProtectedRoute from "../components/ProtectedRoute";
// import { useContext } from "react";
// import { GlobalContext } from "../contexts/GlobalContext";

// const AppRouter = () => {
//   const { isAdmin } = useContext(GlobalContext);

//   const router = createBrowserRouter([
//     { path: "/", element: <Landing /> },
//     { path: "/home", element: <Inicial /> },
//     { path: "/contato", element: <Contato /> },
//     { path: "/adotar", element: <Adotar /> },
//     { path: "/cadastro", element: <Cadastro /> },
//     { path: "/cadastro-ong", element: <CadastroONG /> },
//     { path: "/ongs", element: <Ongs /> },
//     { path: "/login", element: <Login /> },
//     { path: "/perfil", element: <Perfil /> },
//     { path: "/feedback", element: <Feedback /> },
//     { path: "/favoritos", element: <Favoritos /> },
//     { path: "/recuperar-senha", element: <RecuperarSenha /> },

//     // Rotas protegidas
//     {
//       path: "/gerenciamento",
//       element: (
//         <ProtectedRoute isAllowed={isAdmin}>
//           <Gerenciamento />
//         </ProtectedRoute>
//       ),
//     },
//     {
//       path: "/denuncias",
//       element: (
//         <ProtectedRoute isAllowed={isAdmin}>
//           <Denuncias />
//         </ProtectedRoute>
//       ),
//     },
//   ]);

//   return <RouterProvider router={router} />;
// };

// export default AppRouter;


//Possível implementação