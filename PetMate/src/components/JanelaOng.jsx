import React, { useContext } from 'react'
import './JanelaOng.css'
import { OngContext } from '../contexts/OngContext'
import { IoMdClose } from 'react-icons/io'
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram, FaMapMarkedAlt } from "react-icons/fa";

export default function JanelaOng({ isOpen, setOpenModalOng }) {
    const { ong } = useContext(OngContext)

    const telefone = ong?.telefone_contato || ong?.telefone;
    const email = ong?.email_ong || ong?.email;
    const endereco = ong?.endereco_ong || ong?.endereco;

    const linkWpp = telefone ? `https://api.whatsapp.com/send?phone=${'55' + telefone}&text=Ol%C3%A1!%20Estou%20interessado%20em%20${ong.nome}.` : "#";
    const linkEmail = email ? `mailto:${email}?subject=Ado%C3%A7%C3%A3o+PetMate` : "#";
    const linkMaps = endereco ? `https://www.google.com/maps/search/?api=1&query=${endereco}` : "#";

    if (!isOpen || !ong) {
        return null
    }
    return (
        <div className='fundo-janela-ong'>
            <div className="container-janela-ong">
                <div className="titulo-ong-modal">
                    <h2>{ong.nome_ong}</h2>
                    <button onClick={() => setOpenModalOng(false)} className='botao-fechar-ong'>
                        <IoMdClose className='closeIcon' />
                    </button>
                </div>
                <div className="info-ong">
                    <div className="img-ong">
                        <img src={ong.foto_ong} alt="logo da ong" className='logo-ong' />
                    </div>
                    <div className="dados-ong">
                        <div className="contato-redes">
                            <div className="contato-ong">
                                <h3>Contato:</h3>
                                <div className="ctt-ong">
                                    <p><a href={linkWpp}><FaWhatsapp className="icone-wpp-ong" /></a> <strong>WhatsApp:</strong> {ong.telefone}</p>
                                </div>
                                <div className="ctt-ong">
                                    <p><a href={linkEmail}><MdOutlineMail className="icone-email-ong" /></a> <strong>Email:</strong> {ong.email}</p>
                                </div>
                                <div className="ctt-ong">
                                    <p><a href={linkMaps}><FaMapMarkedAlt className="icone-mapa-ong" /></a> <strong>Endereco:</strong> {ong.endereco_ong}</p>
                                </div>
                            </div>
                            <div className="redesSociais-ong">
                                <h3>Redes Sociais:</h3>
                                <p><FaInstagram className="iconeInsta" /> <strong>Instagram:</strong> @ tralalero_tralala{ong.instagram}</p>
                            </div>
                        </div>
                        <div className="descricao-ong">
                            <h3>Descrição:</h3>
                            <p>{ong.descricao_ong}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}