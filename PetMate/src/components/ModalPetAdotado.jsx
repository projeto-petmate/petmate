import React from 'react';
import './ModalPetAdotado.css';

export default function ModalPetAdotado({ isMarcarPet, setOpenModalPetAdotado, onMarcarPet }) {
    if (!isMarcarPet) {
        return null;
    }

    return (
        <div className='modal-adotar-pet'>
            <div className='container-adotar-pet'>
                <div className="texto-adotar-pet">
                    <h1>Deseja marcar este pet como adotado?</h1>
                    <p>Você poderá alterar o status futuramente, se necessário.</p>
                </div>
                <div className='Botao_Adotar'>
                <button className='botao-modal-adotar-pet' onClick={() => onMarcarPet(petAdotado.id_pet)}>Confirmar</button>
                    <button onClick={() => setOpenModalPetAdotado(false)} className='botao-modal-cancelar-pet'>Cancelar</button>
                </div>
            </div>
        </div>
    );
}