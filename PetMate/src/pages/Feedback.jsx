import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import { deleteComentario, getComentarios } from '../apiService';
import './Feedback.css'
import { UserContext } from '../contexts/UserContext';
import { FaUserCircle } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ModalExcluirComentario from '../components/ModalExcluirComentario';
import Swal from 'sweetalert2'
import Footer from '../components/Footer';
import { GlobalContext } from '../contexts/GlobalContext';
import LastPage from '../components/LastPage';
import { GoAlert } from 'react-icons/go';
import ModalDenuncia from '../components/ModalDenuncia';

function Feedback() {
    const { comentarios, adicionarComentario, setComentarios } = useContext(UserContext);
    const [inptComentario, setInptComentario] = useState('');
    // const { addComentario } = useContext(UserContext);
    const [erros, setErros] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [openModalExcluirComentario, setOpenModalExcluirComentario] = useState(false);
    const { userLogado, logado, openDenuncia, openModalDenuncia, setOpenModalDenuncia } = useContext(GlobalContext);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const vrfOng = userLogado?.id_ong ? true : false;

    // const [openModalDenuncia, setOpenModalDenuncia] = useState(false);
    const [idComentarioDenunciado, setIdComentarioDenunciado] = useState(null);
    
    const abrirModalDenuncia = (id_comentario) => {
        setIdComentarioDenunciado(id_comentario);
        setOpenModalDenuncia(true); 
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
           enviarComentario;
        }
    };

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const response = await getComentarios(); 
                // console.log('Comentários recebidos:', response);
                setComentarios(response || []);
            } catch (error) {
                console.error('Erro ao buscar comentários:', error);
                setComentarios([]); 
            }
        };

        fetchComentarios();
    }, [setComentarios]);



    const handleDeleteComment = async () => {
        try {
            await deleteComentario(commentToDelete.id_comentario);
            setComentarios(comentarios.filter(comentario => comentario.id_comentario !== commentToDelete.id_comentario));
            setOpenModalExcluirComentario(false);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Comentário apagado com sucesso!",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Erro ao deletar comentario', error);
        }
    };

    const enviarComentario = async (e) => {
        const novoComentario = {
            texto: inptComentario,
            id_usuario: vrfOng ? null : userLogado.id_usuario, 
            id_ong: vrfOng ? userLogado.id_ong : null,
            data_criacao: new Date().toISOString(),
        };
    
        try {
            if (inptComentario.length >= 8) {
                await adicionarComentario(novoComentario);
                console.log('Comentário cadastrado:', novoComentario);
                setErros('');
                setInptComentario('');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Comentário enviado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "<strong>Erro ao enviar comentário</strong>",
                    html: `
                        <p style="color: #84644D; font-size: 16px;">
                           O comentário deve ter no mínimo 8 caracteres!
                        </p>
                    `,
                    background: "#F6F4F1",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#84644D",
                    customClass: {
                        popup: "custom-swal-popup",
                        title: "custom-swal-title",
                        confirmButton: "custom-swal-button",
                    },
                    showClass: {
                        popup: "animate__animated animate__fadeInDown",
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                    },
                });
            }
        } catch (error) {
            setErros({ geral: 'Erro ao enviar comentário. Tente novamente.' });
        }
    };
    function capitalizeFirstLetter(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    

    return (
        <div>
            <Navbar />
            <div className="feedback-container">
                <div className="banner-container">
                    <img src="./images/banner-feedback.svg" loading='lazy' alt="banner-feedback" className='banner-feedback' />
                </div>
                <div className="titulo-feedback">
                    <h2>Feedbacks</h2>
                    <p>Faça comentários de feedback sobre o sistema!</p>
                </div>
                {logado === true ?
                    <div className="add-feedback-container">
                        <div className='add-feedback-titulo'>
                            <p>Deixe seu comentário:</p>
                        </div>
                        <div className="add-feedback">
                            <input value={inptComentario} onChange={(e) => setInptComentario(e.target.value)} className='inpt-feedback' placeholder="Deixe seu comentário aqui..." />
                            <button onClick={enviarComentario} className='botao-add-feedback'>Enviar</button>
                        </div>
                        <div className="erros-feedback">
                            {erros && <p className="erro-comentario">{erros}</p>}
                        </div>
                    </div>
                    : ''}

                <div className="lista-comentarios">
                    {comentarios.map((c) => (
                        <div key={c.id_comentario} className="comentario">
                            <div className="comentario-container">
                                <div className="comentario-info">
                                    <div className="comentario-nome">
                                        {c.foto_user ? (
                                            <img src={c?.foto_user} alt="Foto do Usuário" className="icon-comentario" />
                                        ) : (
                                            <FaUserCircle className="icon-comentario" />
                                        )}
                                        <h3>{c.nome_user}</h3>
                                    </div>
                                    <div className="container-denunciar-comentario">
                                        {logado && userLogado &&  userLogado.id_usuario !== c.id_usuario ? (
                                            <div className="texto-denunciar-comentario" onClick={() => {abrirModalDenuncia(c.id_comentario)}}>
                                                <GoAlert className='icon-denuncia-comentario' />
                                                <p>
                                                    DENUNCIAR
                                                </p>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div className="apagar-comentario">
                                            {userLogado && userLogado.id_usuario === c.id_usuario ? (
                                                <IoTrashOutline
                                                    onClick={() => {
                                                        setCommentToDelete(c);
                                                        setOpenModalExcluirComentario(true);
                                                    }}
                                                    className="botao-excluir-comentario"
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="comentario-texto">
                                    <p>{capitalizeFirstLetter(c.texto)}</p>
                                </div>
                                <ModalDenuncia
                                    isOpen={openModalDenuncia}
                                    setIsOpen={setOpenModalDenuncia}
                                    idObjeto={idComentarioDenunciado}
                                    tipo='comentario' />
                            </div>
                        </div>
                    ))}
                </div>
                {/* {showSuccessPopup && (
                    <div className="success-popup-perfil">
                        <p>Comentário enviado com sucesso!</p>
                    </div>
                )} */}
            </div>
            <ModalExcluirComentario
                isExcluirComentario={openModalExcluirComentario}
                setComentarioDeleteOpen={setOpenModalExcluirComentario}
                onDeleteComentario={handleDeleteComment}
            />
            <LastPage />
            <Footer />
        </div>

    )
}

export default Feedback
