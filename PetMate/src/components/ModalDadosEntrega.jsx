import { CgCloseO } from 'react-icons/cg'
import './ModalDadosEntrega.css'

export default function ModalDadosEntrega({ isOpen, setIsOpen, pedido }) {
    if (!isOpen) return null

    const endereco = pedido.endereco_entrega

    return (

        <div className="fundo-modal-dados-entrega">
            <div className="container-modal-dados-entrega">
                <div className="titulo-modal-dados-entrega">
                    <CgCloseO
                        onClick={() => { setIsOpen(null) }} />
                </div>
                <div className="modal-dados-entrega">
                    <div>
                        cep:
                        {endereco.cep}
                    </div>
                    <div>
                        cidade:
                        {endereco.cidade}
                    </div>
                    <div>
                        Nome do Destinatário:
                        {endereco.nome_destinatario}
                    </div>
                    <div>
                        Rua:
                        {endereco.logradouro}
                    </div>
                    <div>
                        Bairro:
                        {endereco.bairro}
                    </div>
                    <div>
                        Número da residência:
                        {endereco.numero_residencia}
                    </div>
                    <div>
                        Complemento:
                        {endereco.complemento || 'Nenhum complemento'}
                    </div>
                    <div>
                        Telefone de contato:
                        {endereco.telefone_contato}
                    </div>
                    <div>
                        Observacoes:
                        {pedido.observacoes || 'Nenhuma observação'}
                    </div>
                </div>
            </div>
        </div>
    )
}