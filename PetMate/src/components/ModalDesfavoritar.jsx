import React from 'react';
import './ModalDesfavoritar.css';

export default function ModalDesfavoritar({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-fundo">
            <div className="modal-container">
                <div className="meio-modal-desfavoritar">
                    <div className="texto-desfavoritar">
                        <h1>Tem certeza que deseja remover este pet dos favoritos?</h1>
                    </div>
                    <div className="botoes">
                        <button onClick={onConfirm} className="botao-confirmar">Confirmar</button>
                        <button onClick={onClose} className="botao-cancelar">Cancelar</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
