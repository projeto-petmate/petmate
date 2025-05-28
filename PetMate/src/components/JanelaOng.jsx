import React, { useContext, useState } from 'react';
import './JanelaOng.css';
import { OngContext } from '../contexts/OngContext';
import { IoMdClose } from 'react-icons/io';
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram, FaMapMarkedAlt } from "react-icons/fa";
import { GoAlert } from 'react-icons/go';
import ModalDenuncia from './ModalDenuncia';

export default function JanelaOng({ isOpen, setOpenModalOng }) {
    const { ong } = useContext(OngContext);
    const [openModalDenuncia, setOpenModalDenuncia] = useState(false)
    const telefone = ong?.telefone_contato || ong?.telefone;
    const email = ong?.email_contato || ong?.email;
    const endereco = ong?.endereco_ong || ong?.endereco;

    const linkWpp = telefone ? `https://wa.me/${telefone}` : "#";
    const linkEmail = email ? `mailto:${email}?subject=` : "#";
    const linkMaps = endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}` : "#";
    const linkInstagram = ong?.instagram ? `https://instagram.com/${ong.instagram}` : "#";

    if (!isOpen || !ong) {
        return null;
    }

    return (
        <div className='fundo-janela-ong' onClick={() => setOpenModalOng(false)}>
            <div className="container-janela-ong" onClick={(e) => e.stopPropagation()}>
                <div className="titulo-ong-modal">
                    <h2>{ong.nome_ong}</h2>
                    <div className="container-denunciar-ong">
                    <div className="texto-denunciar-ong" onClick={() => setOpenModalDenuncia(true)}>
                        {<GoAlert className='icon-denunciar-ong' />}
                        <p>
                            DENUNCIAR
                        </p>
                    </div>
                    <button onClick={() => setOpenModalOng(false)} className='botao-fechar-ong'>
                        <IoMdClose className='closeIcon' />
                    </button>
                    </div>
                </div>

                <div className="info-ong">
                    <div className="img-ong">
                        <img src={ong.foto_perfil} alt="logo da ong" className='logo-ong' />
                    </div>
                    <div className="dados-ong">
                        <div className="contato-redes">
                            <div className="contato-ong">
                                <h3>Contato:</h3>
                                <div className="ctt-ong">
                                    <a href={linkWpp} target="_blank" rel="noopener noreferrer">
                                        <FaWhatsapp className="icone-wpp-ong" />
                                        <strong> WhatsApp:</strong>
                                    </a>
                                    <p>{telefone}</p>
                                </div>
                                <div className="ctt-ong">
                                    <a href={linkEmail}>
                                        <MdOutlineMail className="icone-email-ong" />
                                        <strong> Email:</strong>
                                    </a>
                                    <p>{email}</p>
                                </div>
                                <div className="ctt-ong">
                                    <a href={linkMaps} target="_blank" rel="noopener noreferrer">
                                        <FaMapMarkedAlt className="icone-mapa-ong" />
                                        <strong> Endereço:</strong>
                                    </a>
                                    <p>{endereco}</p>
                                </div>
                            </div>
                            <div className="redesSociais-ong">
                                <h3>Redes Sociais:</h3>
                                <a href={linkInstagram} target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="iconeInsta" />
                                    <strong> Instagram:</strong>
                                    <p>@{ong.instagram}</p>
                                </a>

                            </div>
                        </div>
                        <div className="descricao-ong">
                            <h3>Descrição:</h3>
                            <p>{ong.descricao}</p>
                        </div>
                        <ModalDenuncia
                           isOpen={openModalDenuncia}
                           setIsOpen={setOpenModalDenuncia}
                           idObjeto={ong.id_ong}
                           tipo={'ongs'} />
                    </div>
                </div>
            </div>
        </div>
    );
}