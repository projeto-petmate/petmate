import React from 'react';
import './ModalExcluirOng.css'; 
import { FiAlertTriangle } from 'react-icons/fi'; 

export default function ModalExcluirOng({ isExcluirOng, setOngDeleteOpen, onDeleteOng }) {
    if (!isExcluirOng) {
        return null;
    }

    return (
        <div className='modal-excluir-ong'>
            <div className='container-excluir-ong'>
                <div className="meio-modal">
                    <FiAlertTriangle className='icon-alerta-ong'/>
                    <div className="texto-excluir-ong">
                        <h1>Deseja excluir esta ONG?</h1>
                        <p>Esta ação não pode ser desfeita.</p>
                    </div>
                    <div className='botoes-excluir-ong'>
                        <button className='botao-modal-excluir-ong' onClick={onDeleteOng}>Confirmar</button>
                        <button onClick={() => setOngDeleteOpen(false)} className='botao-modal-cancelar-ong'>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}