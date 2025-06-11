import React from 'react';
import './ModalExcluirComentario.css';

export default function ModalExcluirComentario({ isExcluirComentario, setComentarioDeleteOpen, onDeleteComentario }) {
    if (!isExcluirComentario) {
        return null;
    }

    return (
        <div className='modal-excluir-comentario'>
            <div className='container-excluir-comentario'>
                <div className="texto-excluir-comentario">
                    <h1>Deseja excluir este comentário?</h1>
                    <p>Esta ação não pode ser desfeita.</p>
                </div>
                <div className='botoes-excluir-comentario'>
                    <button className='botao-modal-excluir-comentario' onClick={onDeleteComentario}>Confirmar</button>
                    <button onClick={() => setComentarioDeleteOpen(false)} className='botao-modal-cancelar-comentario'>Cancelar</button>
                </div>
            </div>
        </div>
    );
}