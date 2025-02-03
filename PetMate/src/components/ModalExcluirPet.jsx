import React from 'react';
import './ModalExcluirPet.css';

export default function ModalExcluirPet({ isExcluirPet, setPetDeleteOpen, onDeletePet }) {
    if (!isExcluirPet) {
        return null;
    }

    return (
        <div>
            <div className='modal_conteiner_Exclui'>
                <div className='conteiner_modal_Exclui'>
                    <div className="meio-modal">
                        <div className="texto_Exclui">
                            <h1>Deseja excluir este anúncio? </h1>
                            <h1> Esta ação não pode ser desfeita.</h1>
                        </div>
                        <div className='Botao_Exclui'>
                            <button className='botao_modal_excluir' onClick={onDeletePet}>Confirmar</button>
                            <button onClick={() => setPetDeleteOpen(false)} className='botao_modal_cancelar'>{'Cancelar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}