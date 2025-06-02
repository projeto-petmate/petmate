import React, { useState } from 'react';
import './ModalStatus.css';

export default function ModalStatus({ isOpen, setIsOpen, idDenuncia, onStatusUpdate }) {
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async (status) => {
        try {
            setLoading(true);
            await onStatusUpdate(idDenuncia, { status });
            setLoading(false);
            setIsOpen(false); 
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-status-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-status-container" onClick={(e) => e.stopPropagation()}>
                <h2>Atualizar Status</h2>
                <p>Escolha o novo status para a denúncia:</p>
                <div className="status-buttons">
                    <button className="status-btn pendente" onClick={() => handleUpdateStatus('pendente')} disabled={loading}>
                        Pendente
                    </button>
                    <button className="status-btn analise" onClick={() => handleUpdateStatus('em análise')} disabled={loading}>
                        Em Análise
                    </button>
                    <button className="status-btn resolvido" onClick={() => handleUpdateStatus('resolvido')} disabled={loading}>
                        Resolvido
                    </button>
                </div>
                <button className="close-modal-btn" onClick={() => setIsOpen(false)}>Cancelar</button>
            </div>
        </div>
    );
}