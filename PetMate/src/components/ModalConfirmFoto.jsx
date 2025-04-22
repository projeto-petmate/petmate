import React from 'react';
import './ModalConfirmFoto.css';

function ModalConfirmFoto({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Remover Foto de Perfil</h3>
                <p>Tem certeza de que deseja remover sua foto de perfil?</p>
                <div className="modal-buttons">
                    <button className="modal-button confirm" onClick={onConfirm}>
                        Confirmar
                    </button>
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmFoto;