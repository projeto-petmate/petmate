import React, { useState } from 'react';
import './ModalDenuncia.css';
import { CgClose } from 'react-icons/cg';

function ModalDenuncia({ isOpen, setIsOpen, setOpenModalDenuncia }) {
    if (!isOpen) {
        return null;
    }

    const [mensagem, setMensagem] = useState('')

    return (
        <div className="modal-denuncia-fundo">
            <div className="container-modal-denuncia">
                <div className="titulo-denuncia">
                    <h2>Denunciar</h2>
                    <CgClose className="botao-fechar-modal" onClick={() => setIsOpen(false)} />
                </div>

                <div className="container-tipo-denuncia">
                    <h4>Tipo de Denúncia</h4>
                    <div className="inputs-tipo-denuncia">
                        <div className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <p>Informações falsas</p>
                        </div>
                        <div className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <p>Práticas suspeitas</p>
                        </div>
                        <div className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <p>Conteúdo ofensivo</p>
                        </div>
                        <div className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <p>Outro</p>
                        </div>
                    </div>
                </div>

                <div className="modal-denuncia-meio">
                    <h4>Descreva o motivo da denúncia:</h4>
                    <textarea placeholder="Digite sua denúncia aqui..." className='input-denuncia' value={mensagem} onChange={(e) => {setMensagem(e.target.value)}} />
                    <button className="botao-enviar-denuncia">Enviar Denúncia</button>
                </div>
            </div>
        </div>
    );
}

export default ModalDenuncia;