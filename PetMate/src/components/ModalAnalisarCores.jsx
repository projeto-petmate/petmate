import React, { useState, useRef } from 'react';
import './ModalAnalisarCores.css'; // Corrigido o nome do arquivo CSS
import { CgCloseO } from "react-icons/cg";
import { FiUpload, FiCamera } from 'react-icons/fi';
import { analyzePetColors } from '../apiService';
import Swal from 'sweetalert2';

export default function ModalAnalisarCores({ open, onClose }) {
    const [loading, setLoading] = useState(false);
    const [analisar, setAnalisar] = useState(null);
    const [petImage, setPetImage] = useState(null);
    const fileInputRef = useRef(null);

    if (!open) return null;

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: 'Erro',
                text: 'Por favor, selecione apenas arquivos de imagem.',
                icon: 'error',
                confirmButtonColor: '#84644D'
            });
            return;
        }

        // Validar tamanho do arquivo (máx 5MB)
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
            setAnalisar(result.analysis); // Corrigido: o backend retorna 'analysis', não 'analisar'
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

    const handleClose = () => {
        setAnalisar(null);
        setPetImage(null);
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

    return (
        <div className="modal-overlay">
            <div className="modal-analisar-cores">
                <div className="modal-header">
                    <h2>🎨 Análise de Cores para Coleira</h2>
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
                                <h3>Envie uma foto do seu pet</h3>
                                <p>
                                    Nossa IA analisará as cores do seu pet e sugerirá as melhores 
                                    combinações de cores para uma coleira personalizada.
                                </p>
                                
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
                                    accept="image/*"
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
                            <div className="pet-image-container">
                                <img src={petImage} alt="Pet analisado" className="analyzed-pet-image" />
                            </div>

                            <div className="analisar-content">
                                <div 
                                    className="analisar-text"
                                    dangerouslySetInnerHTML={{ __html: formatAnalisar(analisar) }}
                                />
                            </div>

                            <div className="action-buttons">
                                <button 
                                    className="btn secondary"
                                    onClick={() => {
                                        setAnalisar(null);
                                        setPetImage(null);
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
