import React from 'react';
import './ModalExclusaoDeConta.css';

export default function ModalExclusaoDeConta({ isExclui, setContaExcluiOpen, onDelete }) {
    if (!isExclui) {
        return null;
    }

    return (
        <div>
            <div className='modal_conteiner_Exclui'>
                <div className='conteiner_modal_Exclui'>
                    <div className="meio-modal">
                        <div className="texto_Exclui">
                            <h1>Deseja excluir sua conta e todos seus anúncios?</h1> 
                            <p> Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className='Botao_Exclui'>
                            <button className='botao-modal-excluir-conta' onClick={onDelete}>Confirmar</button>
                            <button onClick={() => setContaExcluiOpen(false)} className='botao-modal-cancelar-conta'>{'Cancelar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}