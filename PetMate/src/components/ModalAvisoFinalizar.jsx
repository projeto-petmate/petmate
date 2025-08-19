import './ModalAvisoFinalizar.css'
import { FaCheck } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5';

export default function ModalAvisoAdicionarCarrinho({ open, onClose }) {
    if (!open) return null

    return (
        <div className="fundo-janela-ong">
            <div className="modalAviso">
                <img src="/images/avisoFinalizar.png" alt="Alerta" className='icone-alertaModal' />
                <p className="mensagem-aviso">
                    Ao finalizar o produto editado será<br />
                    adicionado automaticamente no carrinho.
                </p>
                <div className="container-botoes-aviso">
                    <button className="botao-cancelar-aviso" onClick={onClose}>
                        Cancelar <IoCloseSharp className='iconCancelarC'/>
                    </button>
                    <button className="botao-finalizar-aviso" onClick={onClose}>
                        Finalizar <FaCheck className='iconFinalizarC'/>
                    </button>
                </div>
            </div>
        </div>
    )
}