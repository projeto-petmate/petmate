import React from 'react';
import './ModalExcluirUser.css';

export default function ModalExcluirUser({ isExcluirUser, setUserDeleteOpen, onDeleteUser }) {
  if (!isExcluirUser) {
    return null;
  }

  return (
    <div className="modal-excluir-user">
      <div className="container-excluir-user">
        <div className="texto-excluir-user">
          <h1>Deseja excluir este usuário?</h1>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        <div className="botoes-excluir-user">
          <button className="botao-modal-excluir-user" onClick={onDeleteUser}>Confirmar</button>
          <button onClick={() => setUserDeleteOpen(false)} className="botao-modal-cancelar-user">Cancelar</button>
        </div>
      </div>
    </div>
  );
}