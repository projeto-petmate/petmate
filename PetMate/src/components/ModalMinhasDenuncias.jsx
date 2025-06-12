import React from 'react'
import './ModalMinhasDenuncias.css'
import CardDenuncia from '../components/CardDenuncia.jsx'
import { CgCloseO } from 'react-icons/cg';

function ModalMinhasDenuncias({ isOpen, onClose }) {

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="container-minhas-denuncias">
                <div className="titulo-minhas-denuncias">
                    <div>
                        <p className='txt-minhas-denuncias'>Minhas Denúncias</p>
                        <img src="/images/barra_marrom.png" className='barra-denuncias' />
                    </div>
                    <CgCloseO onClick={handleClose} filtrarPorUsuario={false} className="icon-fechar-denuncia" />
                </div>
                <div className="cards-minhas-denuncias">
                    <CardDenuncia filtrarPorUsuario={true} />
                </div>
            </div>
        </div>
    )
}

export default ModalMinhasDenuncias
