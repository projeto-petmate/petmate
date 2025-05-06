import React from 'react';
import './ModalExclusaoDeConta.css';

export default function ModalExclusaoDeConta({ isExclui, setContaExcluiOpen, onDelete }) {
    if (!isExclui) {
        return null;
    }

    return (
        <div>
            <div className='modal_conteiner_excluir_conta'>
                <div className='conteiner_modal_excluir_conta'>
                    <div className="meio-modal">
                        <div className="texto_excluir_conta">
                            <h1>Deseja excluir sua conta e todos seus anúncios?</h1> 
                            <p> Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className='botoes-excluir-conta'>
                            <button className='botao-modal-excluir-conta' onClick={onDelete}>Confirmar</button>
                            <button onClick={() => setContaExcluiOpen(false)} className='botao-modal-cancelar-excluir-conta'>{'Cancelar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}