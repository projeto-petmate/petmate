import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import { getComentarios } from '../apiService';
import './Feedback.css'
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";


function Feedback() {
    const { comentarios, setComentarios } = useContext(UserContext);
    const [nomesComentarios, setNomesComentarios] = useState([]);
    const [inptComentario, setInptComentario] = useState('');
    const { addComentario } = useContext(UserContext);

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

    const enviarComentario = async (e) => {
        const novoComentario = {
            texto: inptComentario,
        }

        try {
            await addComentario(novoComentario)
            console.log('Comentario cadastrado:', novoComentario)
            setInptComentario('')
            // window.location.reload()
        } catch (error) {
            setErros({ geral: 'Erro ao enviar comentario. Tente novamente.' })
        }
    }

    return (
        <div>
            <Navbar />
            <div className="feedback-container">
                <div className="titulo-feedback">
                    <h2>Feedbacks</h2>
                    <p>Faça comentários de feedback sobre o sistema!</p>
                </div>
                <div className="add-feedback-container">
                    <div className='add-feedback-titulo'>
                        <p>Deixe seu comentário:</p>
                    </div>
                    <div className="add-feedback">
                        <input onChange={ (e) => setInptComentario(e.target.value) } className='inpt-feedback' placeholder="Deixe seu comentário aqui..." />
                        <button onClick={enviarComentario} className='botao-add-feedback'>Enviar</button>
                    </div>
                </div>
                <div className="lista-comentarios">
                    {nomesComentarios.map((c) => (
                        <div key={c.id_comentario} className="comentario">
                            <div className="comentario-container">
                                <div className="comentario-nome">
                                    <FaUserCircle className="icon-comentario" />
                                    <h3>{c.nomeUsuario}</h3>
                                </div>
                                <div className="comentario-texto">
                                    <p>{c.texto}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Feedback
