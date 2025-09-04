import './ModalAvisoFinalizar.css'
import { FaCheck } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5';
import { FiAlertTriangle } from "react-icons/fi";

export default function ModalAvisoAdicionarCarrinho({ open, onClose }) {
    if (!open) return null

        const handleFinalizar = () => {
        onClose(true);
    }

    const handleVoltar = () => {
        onClose(false); 
    }

    return (
        <div className="fundo-janela-ong">
            <div className="modal-aviso">
                <FiAlertTriangle className='icon-alerta' />
                <p className="mensagem-aviso">
                    Ao finalizar o produto personalizado será<br />
                    adicionado automaticamente no carrinho.
                </p>
                <div className="container-botoes-aviso">
                    <button className="botao-finalizar-aviso" onClick={handleFinalizar}>
                        Finalizar <FaCheck className='iconFinalizarC'/>
                    </button>
                    <button className="botao-cancelar-aviso" onClick={handleVoltar}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    )
}