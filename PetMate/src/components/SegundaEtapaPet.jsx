import React, { useState } from 'react';
import './SegundaEtapaPet.css';
import { IoArrowBackCircle } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";

function SegundaEtapaPet({
    inptPetEspecie,
    inptPetNome,
    inptPetRaca,
    inptPetIdade,
    inptPetPorte,
    inptPetGenero,
    inptPetDescricao,
    inptPetImagem,
    aceitarTermos,
    setAceitarTermos,
    setEtapa,
    enviarPet,
    erros,
    setModalOpen
}) {
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [localErros, setLocalErros] = useState({});

    const handleAddTag = () => {
        if (tagInput.trim() !== '') {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const validarFormulario = () => {
        const novosErros = {};
        // if (inptPetImagemURL && !inptPetImagemURL.includes('https')) {
        //     novosErros.imagem = 'A URL da imagem deve conter https.';
        // }
        if (!inptPetEspecie || !inptPetNome || !inptPetRaca || !inptPetIdade || !inptPetPorte || !inptPetGenero || !inptPetDescricao || !inptPetImagem) {
            novosErros.campos = 'Todos os campos são obrigatórios.';
        }
        if (!aceitarTermos) {
            novosErros.termos = 'Você deve aceitar os termos e condições.';
        }
        return novosErros;
    };

    const handleSubmit = () => {
        const novosErros = validarFormulario();
        if (Object.keys(novosErros).length > 0) {
            setLocalErros(novosErros);
            return;
        }
        enviarPet(tags);
    };

    return (
        <div>
            <div className="modal_conteiner">
                <div className="conteiner-modal-2">
                    <div className="titulo-cad-pet">
                        <div className="titulo-barra-pet">
                            <h2>Adicionar características do pet</h2>
                            <img src="/images/barra_marrom.png" className='barra-pet' />
                        </div>
                        <div className="botoes-cad-pet">
                            <IoArrowBackCircle onClick={() => { setEtapa(1) }} className='botao_modal_voltar' />
                            <CgCloseO onClick={() => setModalOpen(false)} className='botao_modal_2' />
                        </div>
                    </div>

                    <div className="tags-container">
                        <div className="tag-button">
                            <div className="label-input-tag">
                                <label htmlFor="input-tag">{'Características (opcional)'}</label>
                                <div className="tag-button">
                                    <input
                                        type="text"
                                        className='input-tag-cad'
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        id='input-tag'
                                        placeholder="Ex: Vacinado, Castrado, Brincalhão"
                                    />
                                    <button type="button" onClick={handleAddTag} className='add-tag'>+</button>
                                </div>
                            </div>
                        </div>
                        <div className="tags-list">
                            {tags.map((tag, index) => (
                                <div key={index} className="tag-item">
                                    <div className="texto-tag">
                                        {tag}
                                    </div>
                                    <button type="button" onClick={() => handleRemoveTag(index)} className='remove-tag'>x</button>
                                </div>
                            ))}
                        </div>
                    </div>
                   

                        <div className="erro-cad-pet">
                        {localErros.imagem && <p className="erro-mensagem-pet">{localErros.imagem}</p>}
                        {localErros.campos && <p className="erro-mensagem-pet">{localErros.campos}</p>}
                        {localErros.termos && <p className="erro-mensagem-pet">{localErros.termos}</p>}
                    </div>
                    <div className="termos-cadastro-pet">
                        <div className="termos-pet">
                            <input
                                type="checkbox"
                                className='radio-termos'
                                checked={aceitarTermos}
                                onChange={(e) => setAceitarTermos(e.target.checked)}
                            />
                            <p className='termos-1'>
                                Ao preencher este formulário você concorda com os nossos
                            </p>
                            <a href="#" className='link-termos'>Termos de Uso.</a>
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="botao-enviar-pet">Enviar</button>
                </div>
            </div>
        </div>
    );
}

export default SegundaEtapaPet;