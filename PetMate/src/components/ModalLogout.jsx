import React from 'react';
import './ModalLogout.css';

export default function ModalLogout({ isLogout, setLogoutOpen, onLogout }) {
    if (!isLogout) {
        return null;
    }

    return (
        <div>
            <div className='modal-logout'>
                <div className='conteiner-modal-logout'>
                    <div className="meio-modal">
                        <div className="texto_logout">
                            <h1>Tem certeza que deseja sair?</h1> 
                        </div>
                        <div className='botoes-logout'>
                            <button className='botao-modal-logout' onClick={onLogout}>Sair</button>
                            <button onClick={() => setLogoutOpen(false)} className='botao-cancelar-logout'>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}