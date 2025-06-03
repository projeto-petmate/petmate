import React from 'react';
import './ModalConfirmarEdit.css';

export default function ModalConfirmarEdit({ isOpen, setEditConfirmOpen, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='modal-confirmar-edit'>
            <div className='container-modal-confirmar-edit'>
                <div className="meio-modal">
                    <div className="texto-confirmar-edit">
                        <h1>Deseja atualizar os dados do perfil?</h1>
                    </div>
                    <div className='botoes-confirmar-edit'>
                        <button className='botao-modal-confirmar-edit' onClick={onConfirm}>Confirmar</button>
                        <button onClick={() => setEditConfirmOpen(false)} className='botao-cancelar-confirmar-edit'>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}