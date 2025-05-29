import React, { useContext, useState } from 'react';
import './ModalDenuncia.css';
import { CgClose } from 'react-icons/cg';
import { criarDenuncia } from '../apiService';
import Swal from 'sweetalert2';
import { GlobalContext } from '../contexts/GlobalContext';


function ModalDenuncia({ isOpen, setIsOpen, idObjeto, tipo }) {
    if (!isOpen) {
        return null;
    }

    const [mensagem, setMensagem] = useState('')
    const [motivo, setMotivo] = useState('')
    const [erros, setErros] = useState({});
    const { userLogado } = useContext(GlobalContext)
    let id_user = userLogado.id_usuario
    const validarDenuncia = async () => {
        const novosErros = {};

        if (!mensagem) {
            novosErros.mensagem = 'A mensagem é obrigatória.'
        }
        else if (mensagem.length < 7) {
            novosErros.mensagem = 'A mensagem é muito curta.'
        }
        if (!motivo) {
            novosErros.motivo = 'Você precisa selecionar o motivo da denúncia.'
        }

        if (Object.keys(novosErros).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: Object.values(novosErros)[0],
                confirmButtonColor: '#84644D',
            });
            return false;
        }

        setErros(novosErros)
        return Object.keys(novosErros).length === 0;
    }
    const enviarDenuncia = async () => {

        const denunciaValida = await validarDenuncia();
        if (!denunciaValida) {
            return;
        }

        const novaDenuncia = {
            mensagem: mensagem,
            motivo: motivo,
            tipo_objeto: tipo,
            id_objeto: idObjeto,
            id_denunciante: id_user,
        }
        try {
            const data = await criarDenuncia(novaDenuncia)
            if (data) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Denuncia enviada com sucesso!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setTimeout(() => {
                    setIsOpen(false)
                }, 1500)
            }
        } catch (error) {
            const mensagemErro = error.response?.data?.error || 'Erro ao enviar denúncia. Tente novamente.'
            console.error(mensagemErro)
        }
    }

    return (
        <div className="modal-denuncia-fundo">
            <div className="container-modal-denuncia">
                <div className="titulo-denuncia">
                    <h2>Denunciar</h2>
                    <CgClose className="botao-fechar-modal" onClick={() => setIsOpen(false)} />
                </div>

                <div className="container-motivo-denuncia">
                    <h4 className='titulo-motivo-denuncia'>Motivo da Denúncia</h4>
                    <div className="inputs-motivo-denuncia">
                        <label className="radio-denuncia">
                            <input type="radio" name='motivo-denuncia' onChange={(e) => { setMotivo('Informações falsas') }} />
                            <span className='span-denuncia'>Informações falsas</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='motivo-denuncia' onChange={(e) => { setMotivo('Práticas suspeitas') }} />
                            <span className='span-denuncia'>Práticas suspeitas</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='motivo-denuncia' onChange={(e) => { setMotivo('Conteúdo ofensivo') }} />
                            <span className='span-denuncia'>Conteúdo ofensivo</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='motivo-denuncia' onChange={(e) => { setMotivo('Outro') }} />
                            <span className='span-denuncia'>Outro</span>
                        </label>
                    </div>
                </div>

                <div className="modal-denuncia-meio">
                    <h4>Descreva o motivo da denúncia:</h4>
                    {Object.values(erros).map((erro, index) => (
                        <p key={index} className="erro-mensagem">{erro}</p>
                    ))}
                    <textarea placeholder="Digite sua denúncia aqui..." className='input-denuncia' value={mensagem} onChange={(e) => { setMensagem(e.target.value) }} />
                    <button className="botao-enviar-denuncia" onClick={enviarDenuncia}>Enviar Denúncia</button>
                </div>
            </div>
        </div>
    );
}

export default ModalDenuncia;