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
    inptPetImagemURL,
    aceitarTermos,
    setEtapa,
    enviarPet,
    erros,
    setModalOpen
}) {
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = () => {
        if (tagInput.trim() !== '') {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        enviarPet(tags);
    };

    return (
        <div>
            <div className="modal_conteiner">
                <div className="conteiner-modal-2">
                    <div className="titulo-cad-pet">
                        <div className="titulo-barra-pet">
                            <h2>Adicionar detalhes sobre o pet</h2>
                            <img src="/images/barra_marrom.png" className='barra-pet' />
                        </div>
                        <div className="botoes-cad-pet">
                            <IoArrowBackCircle onClick={() => { setEtapa(1) }} className='botao_modal_voltar' />
                            <CgCloseO onClick={() => setModalOpen(false)} className='botao_modal_2' />
                        </div>
                    </div>

                    <div className="tags-container">
                        <label htmlFor="input-tag"></label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            id='input-tag'
                            placeholder="Ex: Vacinado, Castrado, Brincalhão"
                        />
                        <button type="button" onClick={handleAddTag} className='add-tag'>Adicionar</button>
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
                    {erros.geral && <p className="erro-mensagem">{erros.geral}</p>}

                    <button onClick={handleSubmit} className="botao-enviar-pet">Enviar</button>
                </div>
            </div>
        </div>
    );
}

export default SegundaEtapaPet;