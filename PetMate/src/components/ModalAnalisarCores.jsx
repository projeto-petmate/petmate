import React, { useState, useRef, useContext } from 'react';
import './ModalAnalisarCores.css';
import { CgCloseO } from "react-icons/cg";
import { FiUpload, FiCamera } from 'react-icons/fi';
import { analyzePetColors } from '../apiService';
import Swal from 'sweetalert2';
import { GlobalContext } from '../contexts/GlobalContext';

export default function ModalAnalisarCores({ open, onClose }) {
    const {
        combinacoesCores,
        setCombinacoesCores,
        aplicarCoresCallback,
        setAplicarCoresCallback
    } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);
    const [analisar, setAnalisar] = useState(null);
    const [petImage, setPetImage] = useState(null);
    const fileInputRef = useRef(null);


    if (!open) return null;

    const extrairCombinacoes = (text) => {
        if (!text) return { alternativa1: null, alternativa2: null };

        const mapearCor = (cor, tipo) => {
            const corLimpa = cor.trim().toLowerCase();

            if (tipo === 'tecido' || tipo === 'presilha') {
                const mapaTecidoPresilha = {
                    'preto': 'Preto',
                    'branco': 'Branco',
                    'bege': 'Bege',
                    'azul': 'Azul',
                    'vermelho': 'Vermelho',
                    'amarelo': 'Amarelo',
                    'marrom': 'Marrom'
                };
                return mapaTecidoPresilha[corLimpa] || 'Preto';
            }

            if (tipo === 'logo') {
                const mapaLogo = {
                    'preto': 'Preto',
                    'branco': 'Branco',
                    'bege': 'Bege',
                    'marrom': 'Marrom'
                };
                return mapaLogo[corLimpa] || 'Preto';
            }

            if (tipo === 'argola') {
                const mapaArgola = {
                    'dourado': 'Dourado',
                    'prata': 'Prata',
                    'bronze': 'Bronze'
                };
                return mapaArgola[corLimpa] || 'Prata';
            }

            return '';
        };

        try {
            const regex1 = /🎨.*?Combinação Recomendada:\s*(.*?)(?=💡|📝|$)/s;
            const match1 = text.match(regex1);
            let alternativa1 = null;

            if (match1) {
                const conteudo1 = match1[1];

                const tecido1 = conteudo1.match(/\*\*Tecido:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const logo1 = conteudo1.match(/\*\*Logo:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const argola1 = conteudo1.match(/\*\*Argola:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const presilha1 = conteudo1.match(/\*\*Presilha:\*\*\s*(.+?)(?:\n|$)/m)?.[1];


                if (tecido1 && logo1 && argola1 && presilha1) {
                    alternativa1 = {
                        corTecido: mapearCor(tecido1, 'tecido'),
                        corArgola: mapearCor(argola1, 'argola'),
                        corPresilha: mapearCor(presilha1, 'presilha'),
                        corLogo: mapearCor(logo1, 'logo')
                    };
                }
            }

            const regex2 = /💡.*?Alternativa 2:\s*(.*?)(?=📝|$)/s;
            const match2 = text.match(regex2);
            let alternativa2 = null;

            if (match2) {
                const conteudo2 = match2[1];

                const tecido2 = conteudo2.match(/\*\*Tecido:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const logo2 = conteudo2.match(/\*\*Logo:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const argola2 = conteudo2.match(/\*\*Argola:\*\*\s*(.+?)(?:\n|$)/m)?.[1];
                const presilha2 = conteudo2.match(/\*\*Presilha:\*\*\s*(.+?)(?:\n|$)/m)?.[1];


                if (tecido2 && logo2 && argola2 && presilha2) {
                    alternativa2 = {
                        corTecido: mapearCor(tecido2, 'tecido'),
                        corArgola: mapearCor(argola2, 'argola'),
                        corPresilha: mapearCor(presilha2, 'presilha'),
                        corLogo: mapearCor(logo2, 'logo')
                    };
                }
            }

            return { alternativa1, alternativa2 };

        } catch (error) {
            console.error('Erro ao extrair combinações:', error);
            return { alternativa1: null, alternativa2: null };
        }
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: 'Erro',
                text: 'Por favor, selecione apenas arquivos de imagem.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: 'Erro',
                text: 'A imagem deve ter no máximo 5MB.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
            return;
        }

        setLoading(true);

        try {
            const result = await analyzePetColors(file);
            setPetImage(result.imageUrl);
            setAnalisar(result.analysis);

            const combinacoesExtraidas = extrairCombinacoes(result.analysis);
            setCombinacoesCores(combinacoesExtraidas);
        } catch (error) {
            console.error('Erro na análise:', error);
            Swal.fire({
                title: 'Erro na Análise',
                text: 'Não foi possível analisar a imagem. Tente novamente.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
        } finally {
            setLoading(false);
        }
    };

    const aplicarAlternativa = (numero) => {

        const alternativa = numero === 1 ? combinacoesCores.alternativa1 : combinacoesCores.alternativa2;

        if (alternativa && aplicarCoresCallback) {
            try {
                aplicarCoresCallback(alternativa);
                handleClose();
            } catch (error) {
                console.error('Erro ao aplicar cores:', error);
            }
        } else {
            console.error('Alternativa não encontrada ou callback não definido');
            console.error('alternativa:', alternativa);
            console.error('aplicarCoresCallback:', aplicarCoresCallback);
            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível extrair as cores desta alternativa. Tente novamente.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
        }
    };

    const handleClose = () => {
        setAnalisar(null);
        setPetImage(null);
        setCombinacoesCores({ alternativa1: null, alternativa2: null });
        onClose();
    };

    const formatAnalisar = (text) => {
        if (!text) return '';

        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/🐕 \*\*(.*?)\*\*/g, '🐕 <strong>$1</strong>')
            .replace(/🎨 \*\*(.*?)\*\*/g, '🎨 <strong>$1</strong>')
            .replace(/💡 \*\*(.*?)\*\*/g, '💡 <strong>$1</strong>')
            .replace(/📝 \*\*(.*?)\*\*/g, '📝 <strong>$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    const selecionarEsquemaUm = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "O esquema de cores será aplicado.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#84644D',
            cancelButtonColor: '#84644D',
            confirmButtonText: 'Aplicar alternativa 1',
            cancelButtonText: 'Voltar',
            customClass: {
                cancelButton: 'btn-close-custom',
                confirmButton: 'btn-confirm-custom',
            }

        }).then((result) => {
            if (result.isConfirmed) {
                aplicarAlternativa(1)
            }
        })
    }

    const selecionarEsquemaDois = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "O esquema de cores será aplicado.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#84644D',
            cancelButtonColor: '#84644D',
            confirmButtonText: 'Aplicar alternativa 2',
            cancelButtonText: 'Voltar',
            customClass: {
                cancelButton: 'btn-close-custom',
                confirmButton: 'btn-confirm-custom',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                aplicarAlternativa(2)
            }
        })
    };

    return (
        <div className="modal-overlay">
            <div className="modal-analisar-cores">
                <div className="modal-header">
                    <h2>Análise de Cores para Coleira</h2>
                    <button className="close-button" onClick={handleClose}>
                        <CgCloseO />
                    </button>
                </div>

                <div className="modal-content">
                    {!analisar ? (
                        <div className="upload-section">
                            <div className="upload-area">
                                <div className="upload-icon">
                                    <FiCamera size={48} />
                                </div>
                                <div className="titulo-analisar">
                                    <h3>Envie uma foto do seu pet</h3>
                                    <p>
                                        Nossa IA analisará as cores do seu pet e sugerirá as melhores
                                        combinações de cores para uma coleira personalizada.
                                    </p>
                                </div>

                                <div className="upload-buttons">
                                    <button
                                        className="upload-btn primary"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                Analisando...
                                            </>
                                        ) : (
                                            <>
                                                <FiUpload />
                                                Escolher Foto
                                            </>
                                        )}
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="tips-section">
                                <h4>📸 Dicas para uma boa foto:</h4>
                                <ul>
                                    <li>• Use boa iluminação natural</li>
                                    <li>• Certifique-se de que o pet está bem visível</li>
                                    <li>• Evite sombras que possam alterar as cores</li>
                                    <li>• Foque nas cores da pelagem e características físicas</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="analisar-section">
                            {/* <div className="pet-image-container"> */}
                            { /*<img src={petImage} alt="Pet analisado" className="analyzed-pet-image" />*/}
                            {/* </div> */}

                            <div className="analisar-content">
                                <div
                                    className="analisar-text"
                                    dangerouslySetInnerHTML={{ __html: formatAnalisar(analisar) }}
                                />
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="btn-alternativa"
                                    onClick={selecionarEsquemaUm}
                                    disabled={!combinacoesCores.alternativa1}>
                                    Aplicar combinação recomendada
                                </button>
                                <button
                                    className="btn-alternativa"
                                    onClick={selecionarEsquemaDois}
                                    disabled={!combinacoesCores.alternativa2}>
                                    Aplicar segunda alternativa
                                </button>
                                <button
                                    className="btn secondary"
                                    onClick={() => {
                                        setAnalisar(null);
                                        setPetImage(null);
                                        setCombinacoesCores({ alternativa1: null, alternativa2: null });
                                        fileInputRef.current.value = null;
                                    }}
                                >
                                    Nova Análise
                                </button>
                                <button
                                    className="btn primary"
                                    onClick={handleClose}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
