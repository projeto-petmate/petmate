import './ModalAvisoFinalizar.css'
import { FaCheck } from 'react-icons/fa'

export default function ModalAvisoAdicionarCarrinho({ open, onClose }) {
    if (!open) return null

    return (
        <div className="fundo-janela-ong">
            <div className="container-janela-ong">
                <img src="/images/alerta.png" alt="Alerta" className='icone-alerta' />
                <p className="mensagem-aviso">
                    Ao finalizar o produto editado será<br />
                    adicionado automaticamente no carrinho
                </p>
                <button className="botao-finalizar-aviso" onClick={onClose}>
                    Finalizar <FaCheck />
                </button>
            </div>
        </div>
    )
}
