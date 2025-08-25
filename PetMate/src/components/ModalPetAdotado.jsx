import './ModalPetAdotado.css';
import { FaShieldDog } from 'react-icons/fa6';

export default function ModalPetAdotado({ isMarcarPet, setOpenModalPetAdotado, onMarcarPet, petAdotado }) {
    if (!isMarcarPet) {
        return null;
    }

    return (
        <div className='modal-adotar-pet'>
            <div className='container-adotar-pet'>
                <div className="meio-modal">
                    <FaShieldDog className='icon-alerta-adotado'/>
                    <div className="texto-adotar-pet">
                        {petAdotado.disponivel ?
                        <h1>Deseja marcar este pet como adotado?</h1>
                        :
                        <h1>Deseja marcar este pet como disponivel para adoção?</h1> 
                         }
                        <p>Você poderá alterar o status futuramente, se necessário.</p>
                    </div>
                    <div className='botoes-adotar'>
                    <button className='botao-modal-adotar-pet' onClick={() => onMarcarPet(petAdotado.id_pet)}>Confirmar</button>
                        <button className='botao-modal-cancelar-adotado' onClick={() => setOpenModalPetAdotado(false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}