import React, { useState } from 'react';
import './SegundaEtapaPet.css';
import { IoArrowBackCircle } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";
import Swal from 'sweetalert2'

function SegundaEtapaPet({
    inptPetEspecie,
    inptPetNome,
    inptPetRaca,
    inptPetIdade,
    inptPetPorte,
    inptPetGenero,
    inptPetDescricao,
    inptPetImagens,
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
    const [radioCondicoes, setRadioCondicoes] = useState('');
    const [inptCondicoes, setInptCondicoes] = useState('')
    const [condicoes, setCondicoes] = useState('')

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

        if (!inptPetEspecie || !inptPetNome || !inptPetRaca || !inptPetIdade || !inptPetPorte || !inptPetGenero || !inptPetDescricao || !inptPetImagens.length || !tags.length) {
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
            Swal.fire({
                icon: "error",
                title: "<strong>Erro ao enviar anúncio</strong>",
                html: `
                    <p style="color: #84644D; font-size: 16px;">
                        Algum campo obrigatório não foi preenchido!
                    </p>
                `,
                background: "#F6F4F1",
                color: "#654833",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#84644D",
                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    confirmButton: "custom-swal-button",
                },
                showClass: {
                    popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                },
            });
            return;
        }
        const condicoesAtualizadas = radioCondicoes === 'sim' ? inptCondicoes : 'Nenhuma';
        enviarPet(tags, condicoesAtualizadas);

    };



    return (
        <div>
            <div className="modal-anunciar-segunda-etapa" onClick={() => setModalOpen(false)}>
                <div className="container-modal-2" onClick={(e) => e.stopPropagation()}>
                    <div className="titulo-cad-pet">
                        <div className="titulo-barra-pet">
                            <h2>Adicionar características do pet</h2>
                            <img src="/images/barra_marrom.png" className='barra-pet' />
                        </div>
                        <div className="botoes-cad-pet">
                            <IoArrowBackCircle onClick={() => { setEtapa(1) }} className='botao-modal-voltar' />
                            <CgCloseO onClick={() => setModalOpen(false)} className='botao-modal-2' />
                        </div>
                    </div>
                    <div className="container-meio-segunda-etapa">


                        <div className="condicoes-container">
                            <div className="condicoes-pet">
                                <div className='condicoes-texto'>
                                    <p>
                                        O pet possui alguma condição especial?
                                    </p>
                                </div>
                                <div className="radio-condicoes">
                                    <label htmlFor="radio-pet-nao">Não</label>
                                    <input type="radio" id='radio-pet-nao' name='radio-pet'
                                        value={radioCondicoes}
                                        onChange={() => setRadioCondicoes('não')} />
                                </div>
                                <div className="radio-condicoes">
                                    <label htmlFor="radio-pet-sim">Sim</label>
                                    <input type="radio" id='radio-pet-sim' name='radio-pet'
                                        value={radioCondicoes}
                                        onChange={() => setRadioCondicoes('sim')} />
                                </div>
                            </div>
                            <div className="input-condicao">
                                {radioCondicoes === 'sim' &&
                                    <label htmlFor="input-condicao">Descreva a condição especial do pet:
                                        <input type="text" name="" id="input-condicao"
                                            placeholder='Ex: Depende de remédios'
                                            value={inptCondicoes}
                                            onChange={(e) => setInptCondicoes(e.target.value)} />
                                    </label>
                                }
                            </div>
                        </div>

                        <div className="tags-container">
                            <div className="tag-button">
                                <div className="container-input-tag">
                                    <label htmlFor="input-tag">{'Características'}</label>
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
                    </div>


                    <div className="erro-cad-pet">
                        {/* {localErros.imagem && <p className="erro-mensagem-pet">{localErros.imagem}</p>} */}
                        {/* {localErros.campos && <p className="erro-mensagem-pet">{localErros.campos}</p>} */}
                        {/* {localErros.termos && <p className="erro-mensagem-pet">{localErros.termos}</p>} */}
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