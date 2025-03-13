import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import { deleteComentario, getComentarios } from '../apiService';
import './Feedback.css'
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ModalExcluirComentario from '../components/ModalExcluirComentario';
import Loading from '../components/Loading';


function Feedback() {
    const { comentarios, setComentarios } = useContext(UserContext);
    const [nomesComentarios, setNomesComentarios] = useState([]);
    const [inptComentario, setInptComentario] = useState('');
    const { addComentario } = useContext(UserContext);
    const [erros, setErros] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [openModalExcluirComentario, setOpenModalExcluirComentario] = useState(false);
    const userLogado = JSON.parse(localStorage.getItem("userLogado"));
    const logado = JSON.parse(localStorage.getItem("logado"));

    <Loading />
    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const data = await getComentarios();
                setComentarios(data);
            } catch (error) {
                console.error("Erro ao buscar comentarios:", error);
            }
        };

        fetchComentarios();
    }, [setComentarios]);

    useEffect(() => {
        const fetchNomesUsuarios = async () => {
            try {
                const nomesComentarios = await Promise.all(comentarios.map(async (comentario) => {
                    const response = await axios.get(`http://localhost:3000/usuarios/${comentario.id_usuario}`);
                    return { ...comentario, nomeUsuario: response.data.nome };
                }));
                setNomesComentarios(nomesComentarios);
            } catch (error) {
                console.error("Erro ao buscar nomes dos usuários:", error);
            }
        };

        if (comentarios.length > 0) {
            fetchNomesUsuarios();
        }
    }, [comentarios]);

    const handleDeleteComment = async () => {
        try {
            await deleteComentario(commentToDelete.id_comentario);
            setComentarios(comentarios.filter(comentario => comentario.id_comentario !== commentToDelete.id_comentario));
            setOpenModalExcluirComentario(false);
        } catch (error) {
            console.error('Erro ao deletar comentario', error);
        }
    };

    const enviarComentario = async (e) => {
        const novoComentario = {
            texto: inptComentario,
        }

        try {
            if (inptComentario.length > 8) {
                await addComentario(novoComentario)
                console.log('Comentario cadastrado:', novoComentario)
                setErros('')
                setInptComentario('')
            } else {
                setErros('Comentário deve ter no mínimo 8 caracteres.')
            }
        } catch (error) {
            setErros({ geral: 'Erro ao enviar comentario. Tente novamente.' })
        }
    }

    // let id_user_logado = userLogado.id_usuario;;

    return (
        <div>
            <Navbar />
            <div className="feedback-container">
                <div className="banner-container">
                    <img src="./images/banner-feedback.svg" alt="banner-feedback" className='banner-feedback' />
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
                    {nomesComentarios.map((c) => (
                        <div key={c.id_comentario} className="comentario">
                            <div className="comentario-container">
                                <div className="comentario-info">
                                    <div className="comentario-nome">
                                        <FaUserCircle className="icon-comentario" />
                                        <h3>{c.nomeUsuario}</h3>
                                    </div>
                                    <div className="apagar-comentario">
                                        {userLogado && userLogado.id_usuario === c.id_usuario
                                            ?
                                            <IoTrashOutline onClick={() => { setCommentToDelete(c); setOpenModalExcluirComentario(true) }} className='botao-excluir-comentario' />
                                            : ''}
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

    )
}

export default Feedback
