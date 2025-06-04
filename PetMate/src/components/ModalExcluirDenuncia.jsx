import React from 'react';
import './ModalExcluirPet.css'; // Reutilizando o mesmo CSS do ModalExcluirPet

export default function ModalExcluirDenuncia({ isExcluirDenuncia, setDenunciaDeleteOpen, onDeleteDenuncia }) {
    if (!isExcluirDenuncia) {
        return null;
    }

    return (
        <div className='modal-excluir-pet'>
            <div className='container-excluir-pet'>
                <div className="texto-excluir-pet">
                    <h1>Deseja excluir esta denúncia?</h1>
                    <p>Esta ação não pode ser desfeita.</p>
                </div>
                <div className='botoes-excluir-pet'>
                    <button className='botao-modal-excluir-pet' onClick={onDeleteDenuncia}>Confirmar</button>
                    <button onClick={() => setDenunciaDeleteOpen(false)} className='botao-modal-cancelar-pet'>Cancelar</button>
                </div>
            </div>
        </div>
    );
}