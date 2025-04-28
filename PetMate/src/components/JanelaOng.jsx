import React, { useContext } from 'react'
import './JanelaOng.css'
import { OngContext } from '../contexts/OngContext'
import { IoMdClose } from 'react-icons/io'
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { PiInstagramLogoFill } from "react-icons/pi";


export default function JanelaOng({ isOpen, setOpenModalOng }) {
    const { ong } = useContext(OngContext)

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
                                <p><IoLogoWhatsapp className="iconeWhats"/> <strong>WhatsApp:</strong> {ong.telefone}</p>
                                <p><MdEmail className="iconeEmail" /> <strong>Email:</strong> {ong.email}</p>
                            </div>
                            <div className="redesSociais-ong">
                                <h3>Redes Sociais:</h3>
                                <p><PiInstagramLogoFill className="iconeInsta" /> <strong>Instagram:</strong> @{ong.instagram}</p>
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