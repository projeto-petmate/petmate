import React, { useState } from 'react';
import './ModalDenuncia.css';
import { CgClose } from 'react-icons/cg';

function ModalDenuncia({ isOpen, setIsOpen, idObjeto }) {
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
                    <h4 className='titulo-tipo-denuncia'>Tipo de Denúncia</h4>
                    <div className="inputs-tipo-denuncia">
                        <label className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <span className='span-denuncia'>Informações falsas</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <span className='span-denuncia'>Práticas suspeitas</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <span className='span-denuncia'>Conteúdo ofensivo</span>
                        </label>
                        <label className="radio-denuncia">
                            <input type="radio" name='tipo-denuncia' />
                            <span className='span-denuncia'>Outro</span>
                        </label>
                    </div>
                </div>

                <div className="modal-denuncia-meio">
                    <h4>Descreva o motivo da denúncia:</h4>
                    {/* <p>{idObjeto}</p> */}
                    <textarea placeholder="Digite sua denúncia aqui..." className='input-denuncia' value={mensagem} onChange={(e) => {setMensagem(e.target.value)}} />
                    <button className="botao-enviar-denuncia">Enviar Denúncia</button>
                </div>
            </div>
        </div>
    );
}

export default ModalDenuncia;