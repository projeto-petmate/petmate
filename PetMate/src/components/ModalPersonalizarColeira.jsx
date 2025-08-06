import { useEffect, useMemo, useState } from 'react'
import './ModalPersonalizarColeira.css'
import { IoArrowBackCircle } from 'react-icons/io5'
import { CgCloseO } from "react-icons/cg"
import { FaArrowRightLong } from 'react-icons/fa6'
import Swal from 'sweetalert2';

export default function ModalPersonalizarColeira({ open, onClose }) {
    if (!open) return null

    const [etapa, setEtapa] = useState(1)
    const [erro, setErro] = useState({})
    // const [tamanho, setTamanho] = useState('')
    // const [gps, setGps] = useState(false)
    // const [corTecido, setCorTecido] = useState('')
    // const [corMedalha, setCorMedalha] = useState('')
    // const [desenho, setDesenho] = useState('')

    // Valores iniciais da coleira
    const [coleira, setColeira] = useState({
        modelo: '',
        tamanho: '',
        gps: null,
        corTecido: '',
        corMedalha: '',
        desenho: '',
        valor: 0
    })

    const validarEtapa = async () => {
        const novosErros = {}

        if (etapa === 1 && !coleira.modelo) {
            novosErros.modelo = 'O modelo da coleira é obrigatório.'
        }
        else if (etapa === 1 && !coleira.tamanho) {
            novosErros.tamanho = "Por favor, selecione um tamanho de coleira."
        } else if (etapa === 1 && coleira.gps === null) {
            novosErros.gps = "Por favor, selecione se deseja GPS ou não."
        }
        else if (etapa === 2 && !coleira.corTecido) {
            novosErros.corTecido = "Por favor, selecione uma cor de tecido."
        } else if (etapa === 3 && !coleira.corMedalha) {
            novosErros.corMedalha = "Por favor, selecione uma cor de medalha."
        } else if (etapa === 3 && !coleira.desenho) {
            novosErros.desenho = "Por favor, selecione um desenho para a medalha."
        }

        // Verifica se há erros
        if (Object.keys(novosErros).length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops..',
                text: Object.values(novosErros)[0],
                confirmButtonColor: '#84644D',
            })
            return false
        }

        setErro(novosErros)
        return Object.keys(novosErros).length === 0
    }

    const valorTotal = useMemo(() => {
        let total = 0

        // Valor do modelo
        if (coleira.modelo === "Pescoço") total += 20
        else if (coleira.modelo === "Peitoral") total += 30
        else if (coleira.modelo === "Cabresto") total += 40

        // Valor do GPS
        if (coleira.gps) total += 40

        return total
    }, [coleira.modelo, coleira.gps])

    // Atualiza o valor total da coleira
    useEffect(() => {
        setColeira(prev => ({
            ...prev,
            valor: valorTotal
        }))
    }, [valorTotal])

    const atualizarColeira = (campo, valor) => {
        setColeira(prevColeira => ({
            ...prevColeira,
            [campo]: valor
        }))
    }

    const proximaEtapa = async () => {
        const etapaCompleta = await validarEtapa();

        if (!etapaCompleta) return;

        if (etapa < 4) {
            setEtapa(etapa + 1)
        }
    }

    const voltarEtapa = () => {
        if (etapa > 1) {
            setEtapa(etapa - 1)
        } else {
            setEtapa(1)
        }
    }
    return (
        <div className='modal-overlay-coleiras'>
            <div className="container-modal-personalizar-coleiras">

                {/* Etapa 1: Modelo, tamanho e GPS */}
                {etapa === 1 && (
                    <div className="etapa-1-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <p className='titulo-etapa-personalizar-coleira'>Modelo</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Selecione o modelo da coleira</p>
                                    </div>
                                    <div className="opcoes-modelo">
                                        <label className='radio-modelo'>
                                            <input type="radio" name='modelo' onChange={() => { atualizarColeira("modelo", "Pescoço")}} />
                                            <span>R$ 20 - Pescoço</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input type="radio" name='modelo' onChange={() => { atualizarColeira("modelo", "Peitoral")}} />
                                            <span>R$ 30 - Peitoral</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input type="radio" name='modelo' onChange={() => { atualizarColeira("modelo", "Cabresto")}} />
                                            <span>R$ 40 - Cabresto</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Selecione o tamanho da coleira</p>
                                    </div>
                                    <div className="opcoes-tamanho">
                                        <label className='radio-tamanho'>
                                            <input type="radio" name='tamanho' onChange={() => atualizarColeira("tamanho", "Pequena")} />
                                            <span>Pequena</span>
                                        </label>
                                        <label className='radio-tamanho'>
                                            <input type="radio" name='tamanho' onChange={() => atualizarColeira("tamanho", "Média")} />
                                            <span>Média</span>
                                        </label>
                                        <label className='radio-tamanho'>
                                            <input type="radio" name='tamanho' onChange={() => atualizarColeira("tamanho", "Grande")} />
                                            <span>Grande</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>GPS (R$ 40):</p>
                                    </div>
                                    <div className="opcoes-gps">
                                        <label className='radio-gps'>
                                            <input type="radio" name='gps' onChange={() =>  atualizarColeira("gps", true)} />
                                            <span id='com-gps'>Com GPS</span>
                                        </label>
                                        <label className='radio-gps'>
                                            <input type="radio" name='gps' onChange={() => atualizarColeira("gps", false)} />
                                            <span>Sem GPS</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Tecido' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Medalha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {/* Etapa 2: Cor do Tecido */}
                {etapa === 2 && (
                    <div className="etapa-2-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Cor do Tecido</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Selecione a cor do tecido:</p>
                                    </div>
                                    <div className="opcoes-cores" id='cores-tecido'>
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Preto")} />
                                            <span>Preto</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Branco")} />
                                            <span>Branco</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Verde")} />
                                            <span>Verde</span>
                                        </label>
                                    </div>
                                    <div className="opcoes-cores">
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Azul")} />
                                            <span>Azul</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Vermelho")} />
                                            <span>Vermelho</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='cores' onChange={() => atualizarColeira("corTecido", "Amarelo")} />
                                            <span>Amarelo</span>
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Tecido' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Medalha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {/* Etapa 3: Medalha */}
                {etapa === 3 && (
                    <div className="etapa-3-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Medalha</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Cor da Medalha:</p>
                                    </div>
                                    <div className="opcoes-medalha">
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' onChange={() => atualizarColeira("corMedalha", "Dourado")} />
                                            <span>Dourado</span>
                                        </label>
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' onChange={() => atualizarColeira("corMedalha", "Prata")} />
                                            <span>Prata</span>
                                        </label>
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' onChange={() => atualizarColeira("corMedalha", "Bronze")} />
                                            <span>Bronze</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Desenho da Medalha:</p>
                                    </div>
                                    <div className="opcoes-desenho">
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' onChange={() => atualizarColeira("desenho", "Estrela")} />
                                            <span>Estrela</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' onChange={() => atualizarColeira("desenho", "Coração")} />
                                            <span>Coração</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' onChange={() => atualizarColeira("desenho", "Osso")} />
                                            <span>Osso</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' onChange={() => atualizarColeira("desenho", "Sem desenho")} />
                                            <span>Sem desenho</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(2) }} title='Tecido' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Medalha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {/* // Etapa 4: Revisão */}
                {etapa === 4 && (
                    <div className="etapa-4-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Revisar Coleira</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={onClose}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            <div className="imagem-modal-personalizar-coleira">
                                <img className='img-coleira-perso' src="/images/coleiraex.png" alt="" />
                            </div>
                            <div className="opcoes-selecionadas">
                                <div className="linha-opcoes-selecionadas">
                                    <div className="opcao-selecionada">
                                        <p>Modelo:</p>
                                        <span>{coleira.modelo}</span>
                                    </div>
                                    <div className="opcao-selecionada">
                                        <p>Tamanho:</p>
                                        <span>{coleira.tamanho}</span>
                                    </div>
                                </div>
                                <div className="linha-opcoes-selecionadas">

                                    <div className="opcao-selecionada">
                                        <p>GPS:</p>
                                        <span>{coleira.gps ? "Sim" : "Não"}</span>
                                    </div>
                                    <div className="opcao-selecionada">
                                        <p>Cor do Tecido:</p>
                                        <span>{coleira.corTecido}</span>
                                    </div>
                                </div>
                                <div className="linha-opcoes-selecionadas">

                                    <div className="opcao-selecionada">
                                        <p>Cor da Medalha:</p>
                                        <span>{coleira.corMedalha}</span>
                                    </div>
                                    <div className="opcao-selecionada">
                                        <p>Desenho:</p>
                                        <span>{coleira.desenho}</span>
                                    </div>
                                </div>
                                <div className="linha-opcoes-selecionadas">
                                    <div className="opcao-selecionada">
                                        <p>Valor:</p>
                                        <span>R${coleira.valor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(2) }} title='Tecido' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(3) }} title='Medalha' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={onClose}>Finalizar</button>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}

