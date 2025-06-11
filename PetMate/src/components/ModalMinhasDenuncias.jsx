import React from 'react'
import './ModalMinhasDenuncias.css'
import CardDenuncia from '../components/CardDenuncia.jsx'
import { CgCloseO } from 'react-icons/cg';

function ModalMinhasDenuncias({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="conteiner-modal-minhas-denuncias">
                <CardDenuncia />
                    <CgCloseO onClick={onClose} className="icon-fechar-denuncia">
                    </CgCloseO>
            </div>
        </div>
    )
}

export default ModalMinhasDenuncias
