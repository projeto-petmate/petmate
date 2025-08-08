import './ModalAvisoFinalizar.css'
import { FaCheck } from 'react-icons/fa'
import { CgCloseO } from 'react-icons/cg';

export default function ModalAvisoAdicionarCarrinho({ open, onClose }) {
    if (!open) return null

    return (
        <div className="fundo-janela-ong">
            <div className="container-janela-ong">
                <CgCloseO onClick={onClose} className="modal-closeF" />
                <img src="/images/avisoFinalizar.png" alt="Alerta" className='icone-alertaModal' />
                <p className="mensagem-aviso">
                    Ao finalizar o produto editado será<br />
                    adicionado automaticamente no carrinho.
                </p>
                <button className="botao-finalizar-aviso" onClick={onClose}>
                    Finalizar <FaCheck className='iconFinalizarC'/>
                </button>
            </div>
        </div>
    )
}
