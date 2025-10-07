import { useEffect, useMemo, useState, useContext, useRef } from 'react'
import './ModalPersonalizarColeira.css'
import { IoArrowBackCircle } from 'react-icons/io5'
import { CgCloseO } from "react-icons/cg"
import { FaArrowRightLong } from 'react-icons/fa6'
import Swal from 'sweetalert2';
import ColeiraModelo from './ColeiraModelo';
import ModalAvisoFinalizar from './ModalAvisoFinalizar'
import ModalAnalisarCores from './ModalAnalisarCores'
import { GlobalContext } from '../contexts/GlobalContext';
import { getCarrinhos, addCarrinho, addItemCarrinho, uploadColeiraScreenshot, uploadPetImage } from '../apiService';


export default function ModalPersonalizarColeira({ open, onClose }) {
    const { setAplicarCoresCallback, userLogado, qtdItensCarrinho, setQtdItensCarrinho, debug } = useContext(GlobalContext);
    // const [arquivoTeste, setArquivoTeste] = useState(null);
    const [etapa, setEtapa] = useState(1)
    const [erro, setErro] = useState({})
    const [abrirAviso, setAbrirAviso] = useState(false)
    const [modalCoresOpen, setModalCoresOpen] = useState(false);
    const [modeloKey, setModeloKey] = useState(0);
    const [callbackExecutado, setCallbackExecutado] = useState(false);

    const [coleira, setColeira] = useState({
        modelo: 'Pescoço',
        tamanho: '',
        corTecido: '',
        corArgola: '',
        corPresilha: '',
        corLogo: '',
        valor: 20
    });

    const coleiraModeloRef = useRef();

    const valorTotal = useMemo(() => {
        let total = 0

        if (coleira.modelo === "Pescoço") total += 20
        else if (coleira.modelo === "Peitoral") total += 30
        else if (coleira.modelo === "Cabresto") total += 40

        return total
    }, [coleira.modelo])

    useEffect(() => {
        if (open) {
            console.log('🚀 Modal aberto, resetando estado...');
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
            setCallbackExecutado(false);

            setAplicarCoresCallback(() => (coresAplicar) => {
                console.log('🎨 Aplicando cores da análise de IA:', coresAplicar);

                if (coresAplicar.corTecido) {
                    atualizarColeira("corTecido", coresAplicar.corTecido);
                }
                if (coresAplicar.corLogo) {
                    atualizarColeira("corLogo", coresAplicar.corLogo);
                }
                if (coresAplicar.corArgola) {
                    atualizarColeira("corArgola", coresAplicar.corArgola);
                }
                if (coresAplicar.corPresilha) {
                    atualizarColeira("corPresilha", coresAplicar.corPresilha);
                }

                console.log('✅ Cores aplicadas com sucesso!');

                // setTimeout(() => {
                //     setEtapa(4);
                // }, 500);
            });
        }
    }, [open]);

    useEffect(() => {
        if (open && !callbackExecutado) {
            console.log('🔍 Verificando se há configuração para aplicar...');

            const configSalva = localStorage.getItem('coleiraProntaConfig');
            if (configSalva) {
                try {
                    const config = JSON.parse(configSalva);
                    console.log('📋 Configuração encontrada:', config);

                    setTimeout(() => {
                        console.log('🎨 Aplicando configuração da coleira pronta...');
                        atualizarColeira("modelo", config.modelo);
                        atualizarColeira("tamanho", config.tamanho);
                        atualizarColeira("corTecido", config.corTecido);
                        atualizarColeira("corLogo", config.corLogo);
                        atualizarColeira("corArgola", config.corArgola);
                        atualizarColeira("corPresilha", config.corPresilha);

                        console.log('✅ Configuração aplicada com sucesso!');
                        setCallbackExecutado(true);

                        localStorage.removeItem('coleiraProntaConfig');
                    }, 300);

                } catch (error) {
                    console.error('❌ Erro ao parsear configuração:', error);
                    localStorage.removeItem('coleiraProntaConfig');
                }
            }
        }
    }, [open, callbackExecutado]);

    const fecharModal = () => {
        localStorage.removeItem('coleiraProntaConfig');

        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            text: "Todas as alterações serão perdidas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E63030',
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
                setCallbackExecutado(false);
                // Limpar callback do contexto
                setAplicarCoresCallback(null);
                onClose();
            }
        })
    }

    useEffect(() => {
        setColeira(prev => ({
            ...prev,
            valor: valorTotal
        }))
    }, [valorTotal])

    if (!open) return null


    const handleFecharAviso = (confirmado) => {
        setAbrirAviso(false);

        if (confirmado) {
            console.log('Coleira finalizada:', coleira);

            adicionarAoCarrinho(coleira).then(() => {
                onClose();
            }).catch((error) => {
                console.error('Erro ao adicionar ao carrinho:', error);
                onClose();
            });
        } else {
            console.log('Usuário cancelou a finalização');
        }
    }


    const adicionarAoCarrinho = async (coleira) => {

        try {
            const id_usuario = userLogado?.id_usuario || null;
            const id_ong = userLogado?.id_ong || null;

            if (!id_usuario && !id_ong) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Usuário ou ONG não identificado. Faça login para adicionar ao carrinho.',
                    icon: 'error',
                    confirmButtonColor: '#84644D'
                });
                return;
            }

            let imagemColeiraUrl = null;

            if (coleiraModeloRef.current) {
                try {
                    const imagemBase64 = await coleiraModeloRef.current.captureWithFixedCamera();

                    if (imagemBase64) {
                        Swal.fire({
                            title: 'Salvando coleira personalizada...',
                            text: 'Salvando imagem da personalização',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        imagemColeiraUrl = await uploadColeiraScreenshot(
                            imagemBase64,
                            `coleira-${coleira.modelo}-${Date.now()}.png`
                        );

                        console.log('Imagem enviada ao Cloudinary:', imagemColeiraUrl);
                    } else {
                        console.warn(' Screenshot retornou vazio');
                    }

                } catch (captureError) {
                    console.error('Erro na captura/upload:', captureError);
                }
            } else {
                console.warn('Referência do modelo 3D não encontrada');
            }

            Swal.fire({
                title: 'Adicionando ao carrinho...',
                text: 'Finalizando processo',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            console.log('🛒 Processando carrinho...');

            let carrinhos = await getCarrinhos(id_usuario, id_ong);
            let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'ativo') : null;

            if (!carrinho) {
                console.log('🆕 Criando novo carrinho...');
                carrinho = await addCarrinho({
                    id_usuario: id_usuario,
                    id_ong: id_ong,
                    valor_total: 0
                });
            }

            const id_carrinho = carrinho.id_carrinho || carrinho.id;

            const item = {
                modelo: coleira.modelo,
                tamanho: coleira.tamanho,
                cor_tecido: coleira.corTecido,
                cor_logo: coleira.corLogo,
                cor_argola: coleira.corArgola,
                cor_presilha: coleira.corPresilha,
                valor: coleira.valor,
                quantidade: 1,
                imagem: imagemColeiraUrl
            };

            await addItemCarrinho(id_carrinho, item);

            console.log('✅ Item adicionado ao carrinho com sucesso!');

            setQtdItensCarrinho(qtdItensCarrinho + 1);

            Swal.fire({
                title: 'Sucesso!',
                html: `
                <div style="text-align: center;">
                    <p><strong>Coleira adicionada ao carrinho!</strong></p>
                </div>
            `,
                icon: 'success',
                confirmButtonColor: '#84644D',
                timer: 5000,
                timerProgressBar: true
            });

        } catch (error) {
            console.error('❌ ERRO GERAL:', error);

            Swal.close();

            Swal.fire({
                title: 'Erro!',
                text: `Não foi possível adicionar a coleira ao carrinho: ${error.message}`,
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
        }
    };

    const testarUploadComCaptura = async () => {
        try {

            if (!coleiraModeloRef.current) {
                console.error('❌ Referência do modelo 3D não encontrada');
                Swal.fire({
                    title: 'Erro!',
                    text: 'Modelo 3D não disponível.',
                    icon: 'error',
                    confirmButtonColor: '#84644D'
                });
                return;
            }

            Swal.fire({
                title: 'Testando captura + upload...',
                text: 'Executando teste isolado...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            console.log('📸 ETAPA 1: Capturando screenshot...');
            console.log('🔍 Referência existe?', !!coleiraModeloRef.current);
            console.log('🔍 Função disponível?', typeof coleiraModeloRef.current.captureWithFixedCamera);

            const imagemBase64 = await coleiraModeloRef.current.captureWithFixedCamera();

            console.log('📊 RESULTADO DA CAPTURA:', {
                capturou: !!imagemBase64,
                tipo: typeof imagemBase64,
                tamanho: imagemBase64?.length || 0,
                isDataUrl: imagemBase64?.startsWith('data:'),
                primeiros50chars: imagemBase64?.substring(0, 50) || 'N/A'
            });

            if (!imagemBase64) {
                throw new Error('❌ Captura retornou null/undefined');
            }

            if (!imagemBase64.startsWith('data:image/')) {
                throw new Error('❌ Captura não é uma data URL válida');
            }

            console.log('✅ CAPTURA: Sucesso!');

            console.log('📤 ETAPA 2: Testando upload...');

            Swal.update({
                title: 'Enviando para Cloudinary...',
                text: 'Testando função uploadColeiraScreenshot'
            });

            console.log('🔍 Função uploadColeiraScreenshot existe?', typeof uploadColeiraScreenshot);

            const nomeArquivo = `teste-isolado-${Date.now()}.png`;
            console.log('📁 Nome do arquivo:', nomeArquivo);
            console.log('📦 Parâmetros do upload:', {
                imagemTamanho: imagemBase64.length,
                nomeArquivo: nomeArquivo,
                imagemTipo: imagemBase64.substring(0, 20)
            });

            let imageUrl;
            try {
                console.log('🚀 Chamando uploadColeiraScreenshot...');
                imageUrl = await uploadColeiraScreenshot(imagemBase64, nomeArquivo);
                console.log('📥 Resposta do upload:', imageUrl);
            } catch (uploadError) {
                console.error('❌ ERRO NO UPLOAD:', uploadError);
                console.error('📋 Detalhes completos do erro:', {
                    message: uploadError.message,
                    stack: uploadError.stack,
                    response: uploadError.response,
                    status: uploadError.response?.status,
                    data: uploadError.response?.data
                });
                throw uploadError;
            }

            console.log('📊 RESULTADO DO UPLOAD:', {
                sucesso: !!imageUrl,
                url: imageUrl,
                tipo: typeof imageUrl,
                tamanho: imageUrl?.length || 0
            });

            if (!imageUrl) {
                throw new Error('❌ Upload retornou URL vazia/null');
            }

            console.log('✅ UPLOAD: Sucesso!');
            console.log('🧪 =========================');
            console.log('🧪 TESTE COMPLETO: SUCESSO!');
            console.log('🧪 =========================');

            Swal.fire({
                title: 'Teste Completo: SUCESSO! ✅',
                html: `
                <div style="text-align: left; font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 15px; border-radius: 8px;">
                    <p><strong>✅ CAPTURA 3D:</strong> Sucesso</p>
                    <p><strong>✅ UPLOAD:</strong> Sucesso</p>
                    <p><strong>📏 Tamanho:</strong> ${imagemBase64.length} caracteres</p>
                    <p><strong>🔗 URL:</strong></p>
                    <p style="word-break: break-all; color: blue;">${imageUrl}</p>
                    <hr>
                    <p><strong>🖼️ Preview:</strong></p>
                    <img src="${imageUrl}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />
                </div>
            `,
                icon: 'success',
                confirmButtonColor: '#84644D',
                width: 600
            });

        } catch (error) {
            console.error('❌ =========================');
            console.error('❌ TESTE FALHOU:', error.message);
            console.error('❌ =========================');
            console.error('📋 Stack trace completo:', error.stack);

            Swal.fire({
                title: 'Teste FALHOU! ❌',
                html: `
                <div style="text-align: left; font-family: monospace; font-size: 12px; background: #ffe6e6; padding: 15px; border-radius: 8px;">
                    <p><strong>❌ Erro:</strong> ${error.message}</p>
                    <p><strong>🔍 Tipo:</strong> ${error.constructor.name}</p>
                    ${error.response ? `
                        <p><strong>📡 Status HTTP:</strong> ${error.response.status}</p>
                        <p><strong>📋 Resposta:</strong></p>
                        <pre style="background: #f0f0f0; padding: 5px; border-radius: 4px; white-space: pre-wrap;">${JSON.stringify(error.response.data, null, 2)}</pre>
                    ` : ''}
                </div>
            `,
                icon: 'error',
                confirmButtonColor: '#84644D',
                width: 700
            });
        }
    };

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
            novosErros.corArgola = "Por favor, selecione uma cor de Argola e Presilha."
        }
        else if (etapa === 3 && !coleira.corPresilha) {
            novosErros.corPresilha = "Por favor, selecione uma cor para a presilha."
        }

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

    // const fecharModal = () => {
    //     Swal.fire({
    //         title: 'Tem certeza que deseja sair?',
    //         text: "Todas as alterações serão perdidas.",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#E63030',
    //         cancelButtonColor: '#84644D',
    //         confirmButtonText: 'Sair',
    //         cancelButtonText: 'Continuar'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             setEtapa(1);
    //             setColeira({
    //                 modelo: 'Pescoço',
    //                 tamanho: '',
    //                 corTecido: '',
    //                 corArgola: '',
    //                 corPresilha: '',
    //                 corLogo: '',
    //                 valor: 20
    //             });
    //             setErro({});
    //             onClose();
    //         }
    //     })
    // }

    const testarCaptura = async () => {
        if (coleiraModeloRef.current) {
            try {
                const screenshot = await coleiraModeloRef.current.captureWithFixedCamera();
                if (screenshot) {
                    const link = document.createElement('a');
                    link.download = `coleira-preview-${coleira.modelo}-${Date.now()}.png`;
                    link.href = screenshot;
                    link.click();

                    Swal.fire({
                        title: 'Screenshot Capturado!',
                        text: 'Imagem da coleira foi baixada com posição de câmera padronizada!',
                        icon: 'success',
                        confirmButtonColor: '#84644D'
                    });

                    console.log('✅ Screenshot capturado com câmera resetada!');
                    console.log('📸 Tamanho da imagem:', screenshot.length, 'caracteres');
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Não foi possível capturar o screenshot.',
                        icon: 'error',
                        confirmButtonColor: '#84644D'
                    });
                    console.log('❌ Falha ao capturar screenshot');
                }
            } catch (error) {
                console.error('Erro na captura:', error);
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro durante a captura do screenshot.',
                    icon: 'error',
                    confirmButtonColor: '#84644D'
                });
            }
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Componente 3D não está disponível.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
        }
    };

    const debugColeira = async () => {
        atualizarColeira("modelo", "Cabresto")
        atualizarColeira("tamanho", "Média")
        atualizarColeira("corTecido", "Azul")
        atualizarColeira("corLogo", "Branco")
        atualizarColeira("corArgola", "Prata")
        atualizarColeira("corPresilha", "Preto")
    }

    return (
        <div className='modal-overlay-coleiras'>
            <div className="container-modal-personalizar-coleiras">
                <div className="visualizador-3d-fixo">
                    <ColeiraModelo
                        ref={coleiraModeloRef}
                        key={modeloKey}
                        coleira={coleira}
                    />
                </div>
                {etapa === 1 && (
                    <div className="etapa-1-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <p className='titulo-etapa-personalizar-coleira'>Modelo</p>
                            {/* <button onClick={testarCaptura}>teste</button> */}
                            {
                                debug &&
                                <button onClick={debugColeira}>debug</button>
                            }
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
                                            <span>Pescoço</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input
                                                type="radio"
                                                name='modelo'
                                                checked={coleira.modelo === "Peitoral"}
                                                onChange={() => { atualizarColeira("modelo", "Peitoral") }}
                                            />
                                            <span>Peitoral</span>
                                        </label>
                                        <label className='radio-modelo'>
                                            <input
                                                type="radio"
                                                name='modelo'
                                                checked={coleira.modelo === "Cabresto"}
                                                onChange={() => { atualizarColeira("modelo", "Cabresto") }}
                                            />
                                            <span>Cabresto</span>
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
                                <div className="container-opcoes">
                                    <div className="titulo-opcoes-coleira">
                                        <p>Quer sugestões personalizadas?</p>
                                    </div>
                                    <button
                                        className="btn-analisar-cores"
                                        onClick={() => setModalCoresOpen(true)}
                                        type="button"
                                    >
                                        Sugestão de Cores com IA
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo e Tamanho' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Tecido e Logo' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Argola e Presilha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {etapa === 2 && (
                    <div className="etapa-2-coleira">
                        <div className="container-titulo-modal-personalizar-coleira">
                            <IoArrowBackCircle className='btn-voltar-etapa-personalizar-coleira' onClick={voltarEtapa}>Voltar</IoArrowBackCircle>
                            <p className='titulo-etapa-personalizar-coleira'>Cor do Tecido</p>
                            <CgCloseO className='btn-fechar-modal-personalizar-coleira' onClick={fecharModal}>Sair</CgCloseO>
                        </div>
                        <div className="meio-modal-personalizar-coleira">
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
                                <div className="opcoes-cores">
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Preto"} onChange={() => atualizarColeira("corLogo", "Preto")} />
                                        <span>Preto</span>
                                    </label>
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Branco"} onChange={() => atualizarColeira("corLogo", "Branco")} />
                                        <span>Branco</span>
                                    </label>
                                    <label className='radio-cores'>
                                        <input type="radio" name='coresLogo' checked={coleira.corLogo === "Marrom"} onChange={() => atualizarColeira("corLogo", "Marrom")} />
                                        <span>Marrom</span>
                                    </label>
                                </div>
                                <div className="opcoes-cores">
                                    <label className='radio-desenho'>
                                        <input type="radio" name='desenho' checked={coleira.corLogo === "Azul"} onChange={() => atualizarColeira("corLogo", "Azul")} />
                                        <span>Azul</span>
                                    </label>
                                    <label className='radio-desenho'>
                                        <input type="radio" name='desenho' checked={coleira.corLogo === "Vermelho"} onChange={() => atualizarColeira("corLogo", "Vermelho")} />
                                        <span>Vermelho</span>
                                    </label>
                                    <label className='radio-desenho'>
                                        <input type="radio" name='desenho' checked={coleira.corLogo === "Amarelo"} onChange={() => atualizarColeira("corLogo", "Amarelo")} />
                                        <span>Amarelo</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="etapas-personalizar-coleira">
                            <div className="visor-etapas">
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo e Tamanho' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Tecido e Logo' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Argola e Presilha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
                {/* Etapa 3: Argola e Presilha */}
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
                                    <div className="opcoes-argola">
                                        <label className='radio-argola'>
                                            <input type="radio" name='argola' checked={coleira.corArgola === "Dourado"} onChange={() => atualizarColeira("corArgola", "Dourado")} />
                                            <span>Dourado</span>
                                        </label>
                                        <label className='radio-argola'>
                                            <input type="radio" name='argola' checked={coleira.corArgola === "Prata"} onChange={() => atualizarColeira("corArgola", "Prata")} />
                                            <span>Prata</span>
                                        </label>
                                        <label className='radio-argola'>
                                            <input type="radio" name='argola' checked={coleira.corArgola === "Bronze"} onChange={() => atualizarColeira("corArgola", "Bronze")} />
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
                                            <input type="radio" name='desenho' checked={coleira.corPresilha === "Marrom"} onChange={() => atualizarColeira("corPresilha", "Marrom")} />
                                            <span>Marrom</span>
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
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo e Tamanho' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(2) }} title='Tecido e Logo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Argola e Presilha' />
                                <img src="/images/elipse-vazia.png" alt="elipse vazia" title='Revisão' />
                            </div>
                            <button className='btn-avancar-etapa-personalizar-coleira' onClick={proximaEtapa}>Avançar <FaArrowRightLong /></button>
                        </div>
                    </div>
                )}
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
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(1) }} title='Modelo e Tamanho' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(2) }} title='Tecido e Logo' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" onClick={() => { setEtapa(3) }} title='Argola e Presilha' />
                                <img src="/images/elipse-preenchida.png" className='elipse-clicavel' alt="elipse preenchida" title='Revisão' />
                            </div>
                            <button
                                className='btn-avancar-etapa-personalizar-coleira'
                                id='btn-finalizar-coleira'
                                onClick={() => setAbrirAviso(true)}
                            >
                                Finalizar
                            </button>
                            <ModalAvisoFinalizar
                                open={abrirAviso}
                                onClose={handleFecharAviso}
                            />
                        </div>
                    </div>
                )}
            </div>
            <ModalAnalisarCores
                open={modalCoresOpen}
                onClose={() => setModalCoresOpen(false)}
            />
        </div >
    )
}