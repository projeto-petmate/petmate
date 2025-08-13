import React, { Suspense, useEffect, useMemo, useState } from 'react'
import './ModalPersonalizarColeira.css'
import { IoArrowBackCircle } from 'react-icons/io5'
import { CgCloseO } from "react-icons/cg"
import { FaArrowRightLong } from 'react-icons/fa6'
import Swal from 'sweetalert2';
import ColeiraModelo from './ColeiraModelo';
import ModalAvisoFinalizar from './ModalAvisoFinalizar'


export default function ModalPersonalizarColeira({ open, onClose }) {
    if (!open) return null

    const [etapa, setEtapa] = useState(1)
    const [erro, setErro] = useState({})
    // const [tamanho, setTamanho] = useState('')
    // const [gps, setGps] = useState(false)
    // const [corTecido, setCorTecido] = useState('')
    // const [corArgola, setcorArgola] = useState('')
    // const [desenho, setDesenho] = useState('')
    const [abrirAviso, setAbrirAviso] = useState(false)


    // Valores iniciais da coleira
    const [coleira, setColeira] = useState({
        modelo: 'Pescoço',
        tamanho: '',
        corTecido: '',
        corArgola: '',
        corPresilha: '',
        corLogo: '',
        valor: 20
    })

    // Resetar formulário quando abrir o modal
    useEffect(() => {
        if (open) {
            setEtapa(1);
            setColeira({
                modelo: 'Pescoço',
                tamanho: '',
                corTecido: '',
                corArgola: '',
                corPresilha: '',
                corLogo: '',
                valor: 20
            });
            setErro({});
        }
    }, [open]);

    const validarEtapa = async () => {
        const novosErros = {}

        if (etapa === 1 && !coleira.modelo) {
            novosErros.modelo = 'O modelo da coleira é obrigatório.'
        }
        else if (etapa === 1 && !coleira.tamanho) {
            novosErros.tamanho = "Por favor, selecione um tamanho de coleira."
        }
        else if (etapa === 2 && !coleira.corTecido) {
            novosErros.corTecido = "Por favor, selecione uma cor de tecido."
        }
        else if (etapa === 2 && !coleira.corLogo) {
            novosErros.corLogo = "Por favor, selecione uma cor de logo."
        }
        else if (etapa === 3 && !coleira.corArgola) {
            novosErros.corArgola = "Por favor, selecione uma cor de medalha."
        }
        else if (etapa === 3 && !coleira.corPresilha) {
            novosErros.corPresilha = "Por favor, selecione uma cor para a presilha."
        }

        // Verifica se há erros
        if (Object.keys(novosErros).length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Ops...',
                text: Object.values(novosErros)[0],
                confirmButtonColor: '#84644D',
                customClass: {
                    container: 'swal-high-z'
                }
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

        return total
    }, [coleira.modelo])

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

    const fecharModal = () => {
        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            text: "Todas as alterações serão perdidas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DE4628',
            cancelButtonColor: '#84644D',
            confirmButtonText: 'Sair',
            cancelButtonText: 'Continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                setEtapa(1);
                setColeira({
                    modelo: 'Pescoço',
                    tamanho: '',
                    corTecido: '',
                    corArgola: '',
                    corPresilha: '',
                    corLogo: '',
                    valor: 20
                });
                setErro({});
                onClose();
            }
        })
    }

    return (
        <div className='modal-overlay-coleiras'>
            <div className="container-modal-personalizar-coleiras">
                <div className="visualizador-3d-fixo">
                    <ColeiraModelo coleira={coleira} />
                </div>
                {/* Etapa 1: Modelo, tamanho e GPS */}
                {etapa === 1 && (
                    <div className="etapa-1-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <p className='titulo-etapa-personalizar-coleira'>Modelo</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={fecharModal}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            {/* <div className="imagem-modal-personalizar-coleira"> */}
                            {/* <ColeiraModelo coleira={coleira} /> */}
                            {/* </div> */}
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Selecione o modelo da coleira</p>
                                    </div>
                                    <div className="opcoes-modelo">
                                        <label className='radio-modelo'>
                                            <input
                                                type="radio"
                                                name='modelo'
                                                checked={coleira.modelo === "Pescoço"}
                                                onChange={() => { atualizarColeira("modelo", "Pescoço") }}
                                            />
                                            <span>R$ 20 - Pescoço</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input
                                                type="radio"
                                                name='modelo'
                                                checked={coleira.modelo === "Peitoral"}
                                                onChange={() => { atualizarColeira("modelo", "Peitoral") }}
                                            />
                                            <span>R$ 30 - Peitoral</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input
                                                type="radio"
                                                name='modelo'
                                                checked={coleira.modelo === "Cabresto"}
                                                onChange={() => { atualizarColeira("modelo", "Cabresto") }}
                                            />
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
                                            <input type="radio" name='tamanho' checked={coleira.tamanho === "Pequena"} onChange={() => atualizarColeira("tamanho", "Pequena")} />
                                            <span>Pequena</span>
                                        </label>
                                        <label className='radio-tamanho'>
                                            <input type="radio" name='tamanho' checked={coleira.tamanho === "Média"} onChange={() => atualizarColeira("tamanho", "Média")} />
                                            <span>Média</span>
                                        </label>
                                        <label className='radio-tamanho'>
                                            <input type="radio" name='tamanho' checked={coleira.tamanho === "Grande"} onChange={() => atualizarColeira("tamanho", "Grande")} />
                                            <span>Grande</span>
                                        </label>
                                    </div>
                                </div>
                                {/* <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>GPS (R$ 40):</p>
                                    </div>
                                    <div className="opcoes-gps">
                                        <label className='radio-gps'>
                                            <input type="radio" name='gps' checked={coleira.gps === true} onChange={() => atualizarColeira("gps", true)} />
                                            <span id='com-gps'>Com GPS</span>
                                        </label>
                                        <label className='radio-gps'>
                                            <input type="radio" name='gps' checked={coleira.gps === false} onChange={() => atualizarColeira("gps", false)} />
                                            <span>Sem GPS</span>
                                        </label>
                                    </div>
                                </div> */}
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
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={fecharModal}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            {/* <div className="imagem-modal-personalizar-coleira">
                                    <ColeiraModelo coleira={coleira} />
                            </div> */}
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Selecione a cor do tecido:</p>
                                    </div>
                                    <div className="opcoes-cores" id='cores-tecido'>
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Preto"} onChange={() => atualizarColeira("corTecido", "Preto")} />
                                            <span>Preto</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Branco"} onChange={() => atualizarColeira("corTecido", "Branco")} />
                                            <span>Branco</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Bege"} onChange={() => atualizarColeira("corTecido", "Bege")} />
                                            <span>Bege</span>
                                        </label>
                                    </div>
                                    <div className="opcoes-cores">
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Azul"} onChange={() => atualizarColeira("corTecido", "Azul")} />
                                            <span>Azul</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Vermelho"} onChange={() => atualizarColeira("corTecido", "Vermelho")} />
                                            <span>Vermelho</span>
                                        </label>
                                        <label className='radio-cores'>
                                            <input type="radio" name='coresTecido' checked={coleira.corTecido === "Amarelo"} onChange={() => atualizarColeira("corTecido", "Amarelo")} />
                                            <span>Amarelo</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="titulo-opcoes-coleira">
                                    <p>Selecione a cor da logo:</p>
                                </div>
                                <div className="opcoes-cores" id='cores-tecido'>
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Preto"} onChange={() => atualizarColeira("corLogo", "Preto")} />
                                        <span>Preto</span>
                                    </label>
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Branco"} onChange={() => atualizarColeira("corLogo", "Branco")} />
                                        <span>Branco</span>
                                    </label>
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Bege"} onChange={() => atualizarColeira("corLogo", "Bege")} />
                                        <span>Bege</span>
                                    </label>
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
                            <p className='titulo-etapa-personalizar-coleira'>Argola e Presilha</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={fecharModal}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            {/* <div className="imagem-modal-personalizar-coleira">
                                <ColeiraModelo coleira={coleira} />
                            </div> */}
                            <div className="opcoes-coleira">
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Cor da Argola:</p>
                                    </div>
                                    <div className="opcoes-medalha">
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' checked={coleira.corArgola === "Dourado"} onChange={() => atualizarColeira("corArgola", "Dourado")} />
                                            <span>Dourado</span>
                                        </label>
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' checked={coleira.corArgola === "Prata"} onChange={() => atualizarColeira("corArgola", "Prata")} />
                                            <span>Prata</span>
                                        </label>
                                        <label className='radio-medalha'>
                                            <input type="radio" name='medalha' checked={coleira.corArgola === "Bronze"} onChange={() => atualizarColeira("corArgola", "Bronze")} />
                                            <span>Bronze</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="container-opcoes" >
                                    <div className="titulo-opcoes-coleira">
                                        <p>Cor da Presilha:</p>
                                    </div>
                                    <div className="opcoes-desenho" id='cores-presilha'>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Preto"} onChange={() => atualizarColeira("corPresilha", "Preto")} />
                                            <span>Preto</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Branco"} onChange={() => atualizarColeira("corPresilha", "Branco")} />
                                            <span>Branco</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Bege"} onChange={() => atualizarColeira("corPresilha", "Bege")} />
                                            <span>Bege</span>
                                        </label>
                                    </div>
                                    <div className="opcoes-desenho">
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Azul"} onChange={() => atualizarColeira("corPresilha", "Azul")} />
                                            <span>Azul</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Vermelho"} onChange={() => atualizarColeira("corPresilha", "Vermelho")} />
                                            <span>Vermelho</span>
                                        </label>
                                        <label className='radio-desenho'>
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Amarelo"} onChange={() => atualizarColeira("corPresilha", "Amarelo")} />
                                            <span>Amarelo</span>
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
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={fecharModal}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
                            {/* <div className="imagem-modal-personalizar-coleira">
                                    <ColeiraModelo coleira={coleira} />
                            </div> */}
                            <div className="container-opcoes-selecionadas">
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
                                            <p>Cor do Tecido:</p>
                                            <span>{coleira.corTecido}</span>
                                        </div>
                                    </div>
                                       <div className="linha-opcoes-selecionadas">
                                        <div className="opcao-selecionada">
                                            <p>Cor da Logo:</p>
                                            <span>{coleira.corLogo}</span>
                                        </div>
                                    </div>
                                    <div className="linha-opcoes-selecionadas">
                                        <div className="opcao-selecionada">
                                            <p>Cor da Argola:</p>
                                            <span>{coleira.corArgola}</span>
                                        </div>
                                        <div className="opcao-selecionada">
                                            <p>Cor da Presilha:</p>
                                            <span>{coleira.corPresilha}</span>
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
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(2) }} title='Tecido' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(3) }} title='Medalha' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Revisão' />
                            </div>
                            <button
                                className='btn-avancar-etapa-personalizar-coleira'
                                onClick={() => setAbrirAviso(true)}
                            >
                                Finalizar
                            </button>

                            <ModalAvisoFinalizar open={abrirAviso} onClose={() => {
                                setAbrirAviso(false);
                                onClose();
                            }} />

                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}


