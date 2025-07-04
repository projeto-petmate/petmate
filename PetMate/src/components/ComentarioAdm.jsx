import { useContext, useEffect, useState } from 'react';
import { deleteComentario, getComentarios } from '../apiService';
import './ComentarioAdm.css';
import { UserContext } from '../contexts/UserContext';
import { FaUserCircle } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ModalExcluirComentario from '../components/ModalExcluirComentario';
import Swal from 'sweetalert2';
import { GlobalContext } from '../contexts/GlobalContext';


function ComentarioAdm({ idComentario }) {
    const { isAdmin } = useContext(GlobalContext);
    const { comentarios, setComentarios } = useContext(UserContext);
    const [nomesComentarios, setNomesComentarios] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [openModalExcluirComentario, setOpenModalExcluirComentario] = useState(false);

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const data = await getComentarios();
                setComentarios(data);
            } catch (error) {
                console.error("Erro ao buscar comentários:", error);
            }
        };

        fetchComentarios();
    }, [setComentarios]);

    // useEffect(() => {
    //     const fetchNomesUsuarios = async () => {
    //         try {
    //             const nomesComentarios = await Promise.all(comentarios.map(async (comentario) => {
    //                 const usuario = await getUsuarioById(comentario.id_usuario);
    //                 return { ...comentario, nomeUsuario: usuario.nome };
    //             }));
    //             setNomesComentarios(nomesComentarios);
    //         } catch (error) {
    //             console.error("Erro ao buscar nomes dos usuários:", error);
    //         }
    //     };

    //     if (comentarios.length > 0) {
    //         fetchNomesUsuarios();
    //     }
    // }, [comentarios]);

    const handleDeleteComment = async () => {
        try {
            await deleteComentario(commentToDelete.id_comentario);
            setComentarios(comentarios.filter(comentario => comentario.id_comentario !== commentToDelete.id_comentario));
            setOpenModalExcluirComentario(false);
            Swal.fire({
                position: "mid",
                icon: "success",
                title: "Comentário apagado com sucesso!",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Erro ao deletar comentário', error);
        }
    };
    const comentariosFiltrados = idComentario ? comentarios.filter((c) => c.id_comentario === idComentario) : comentarios;

    return (
        <div>
            <div className="comentario-adm-container">
                {/* <div className="titulo-comentarios-adm">
                    <h2>Comentários</h2>
                    <p>Gerencie os comentários enviados pelos usuários.</p>
                </div> */}
                <div className="lista-comentarios-adm">
                    {comentariosFiltrados.map((c) => (
                        <div key={c.id_comentario} className="comentario">
                            <div className="comentario-container">
                                <div className="comentario-info">
                                    <div className="comentario-nome">
                                        {c.foto_user ? (
                                            <img src={c.foto_user} alt="Foto do Usuário" className="icon-comentario" />
                                        ) : (
                                            <FaUserCircle className="icon-comentario" />
                                        )}
                                        <h3>{c.nome_user}</h3>
                                    </div>
                                    <div className="apagar-comentario">
                                        {isAdmin &&
                                            <IoTrashOutline
                                                onClick={() => {
                                                    setCommentToDelete(c);
                                                    setOpenModalExcluirComentario(true);
                                                }}
                                                className="botao-excluir-comentario"
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="comentario-texto">
                                    <p>{c.texto}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ModalExcluirComentario
                isExcluirComentario={openModalExcluirComentario}
                setComentarioDeleteOpen={setOpenModalExcluirComentario}
                onDeleteComentario={handleDeleteComment}
            />
        </div>
    );
}

export default ComentarioAdm;