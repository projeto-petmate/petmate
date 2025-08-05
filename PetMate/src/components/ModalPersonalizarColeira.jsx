import { useState } from 'react';
import './ModalPersonalizarColeira.css';
import { IoArrowBackCircle } from 'react-icons/io5';
import { CgCloseO } from "react-icons/cg";
import { FaArrowRightLong } from 'react-icons/fa6';


export default function ModalPersonalizarColeira({ open, onClose }) {
    if (!open) return null;
    const [etapa, setEtapa] = useState(1);

    const proximaEtapa = () => {
        if (etapa < 4) {
            setEtapa(etapa + 1);
        }
    }

    const voltarEtapa = () => {
        if (etapa > 1) {
            setEtapa(etapa - 1);
        } else {
            setEtapa(1);
        }
    }
    return (
        <div className='modal-overlay-coleiras'>
            <div className="container-modal-personalizar-coleiras">

                {etapa === 1 && (
                    <div className="etapa-1-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <p className='titulo-etapa-personalizar-coleira'>Modelo</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <div className="titulo-opcoes-coleira">
                                    <p>Selecione o modelo da coleira</p>
                                </div>
                                <div className="opcoes-modelo">
                                    <button>Pescoço</button>
                                    <button>Peitoral</button>
                                    <button>Cabresto</button>
                                </div>
                                <div className="titulo-opcoes-coleira">
                                    <p>Selecione o tamanho da coleira</p>
                                </div>
                                <div className="opcoes-tamanho">
                                    <button>Pequena</button>
                                    <button>Média</button>
                                    <button>Grande</button>
                                </div>
                                <div className="titulo-opcoes-coleira">
                                    <p>GPS:</p>
                                </div>
                                <div className="opcoes-gps">
                                    <button>Com GPS</button>
                                    <button>Sem GPS</button>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">

                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}

                {etapa === 2 && (
                    <div className="etapa-2-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Cor do Tecido</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <button></button>
                                <button></button>
                                <button></button>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">

                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}

                {etapa === 3 && (
                    <div className="etapa-3-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Medalha da Coleira</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <input type="radio" />
                                <input type="radio" />
                                <input type="radio" />
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">

                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {etapa === 4 && (
                    <div className="etapa-4-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Revisar Coleira</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">

                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={onClose}>Finalizar</button>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}

