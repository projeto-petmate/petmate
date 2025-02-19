import React from 'react';
import './ModalExcluirPet.css';

export default function ModalExcluirPet({ isExcluirPet, setPetDeleteOpen, onDeletePet }) {
    if (!isExcluirPet) {
        return null;
    }

    return (
        <div className='modal-excluir-pet'>
            <div className='container-excluir-pet'>
                <div className="texto-excluir-pet">
                    <h1>Deseja excluir este anúncio?</h1>
                    <h1>Esta ação não pode ser desfeita.</h1>
                </div>
                <div className='Botao_Exclui'>
                    <button className='botao_modal_excluir' onClick={onDeletePet}>Confirmar</button>
                    <button onClick={() => setPetDeleteOpen(false)} className='botao_modal_cancelar'>Cancelar</button>
                </div>
            </div>
        </div>
    );
}