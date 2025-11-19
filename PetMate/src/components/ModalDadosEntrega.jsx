import { CgCloseO } from 'react-icons/cg'
import { LuMapPin } from "react-icons/lu";
import './ModalDadosEntrega.css'

export default function ModalDadosEntrega({ isOpen, setIsOpen, pedido }) {
    if (!isOpen) return null

    const endereco = pedido.endereco_entrega

    return (

        <div className="fundo-modal-dados-entrega">
            <div className="container-modal-dados-entrega">
                <div className="container-titulo-modal-dados-entrega">
                    <p className='titulo-modal-dados-entrega'>
                        Informações de Entrega
                        <LuMapPin />
                    </p>
                    <CgCloseO
                        className='icon-fechar-modal-dados-entrega'
                        onClick={() => { setIsOpen(null) }}
                    />
                </div>
                <div className="container-dados-entrega">
                    <div className="coluna-info-entrega-1">
                        <div className='container-info-entrega'>
                            <p>
                                CEP:
                            </p>
                            {endereco.cep}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Cidade:
                            </p>
                            {endereco.cidade}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Nome do Destinatário:
                            </p>
                            <div style={{ textTransform: 'capitalize' }}>
                                {endereco.nome_destinatario}
                            </div>
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Rua:
                            </p>
                            {endereco.logradouro}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Bairro:
                            </p>
                            {endereco.bairro}
                        </div>
                    </div>
                    <div className="coluna-info-entrega-2">
                        <div className='container-info-entrega'>
                            <p>
                                Número da residência:
                            </p>
                            {endereco.numero_residencia}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Complemento:
                            </p>
                            {endereco.complemento || 'Nenhum complemento'}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Telefone de contato:
                            </p>
                            {endereco.telefone_contato}
                        </div>
                        <div className='container-info-entrega'>
                            <p>
                                Observacoes:
                            </p>
                            {pedido.observacoes || 'Nenhuma observação'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}