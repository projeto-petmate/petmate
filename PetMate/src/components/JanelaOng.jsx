import React, { useContext } from 'react'
import './JanelaOng.css'
import { OngContext } from '../contexts/OngContext'
import { IoMdClose } from 'react-icons/io'

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
                    <button onClick={() => setOpenModalOng(false)} className='botao-fechar-ong'>{<IoMdClose className='closeIcon' />}</button>
                </div>
                <div className="info-ong">
                    <div className="img-ong">
                        <img src={ong.foto_ong} alt="logo da ong" className='logo-ong' />
                    </div>
                    <div className="dados-ong">
                        <div className="telefone-ong">
                            <h3>Telefone de Contato:</h3>
                            <p>{ong.telefone}</p>
                        </div>
                        <div className="telefone-denuncia">
                            <h3>Telefone de Denúncias:</h3>
                            <p>{ong.telefone_denuncia}</p>
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
