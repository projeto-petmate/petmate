import React from 'react';
import './ModalExcluirPet.css';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ModalExcluirPet({ isExcluirPet, setPetDeleteOpen, onDeletePet }) {
    if (!isExcluirPet) {
        return null;
    }

    return (
        <div className='modal-excluir-pet'>
            <div className='container-excluir-pet'>
                <div className="meio-modal">
                    <FiAlertTriangle className='icon-alerta-pet'/>
                    <div className="texto-excluir-pet">
                        <h1>Deseja excluir este anúncio?</h1>
                        <p>Esta ação não pode ser desfeita.</p>
                    </div>
                    <div className='botoes-excluir-pet'>
                        <button className='botao-modal-excluir-pet' onClick={onDeletePet}>Confirmar</button>
                        <button onClick={() => setPetDeleteOpen(false)} className='botao-modal-cancelar-pet'>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}