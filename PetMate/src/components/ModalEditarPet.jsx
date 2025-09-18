import { useContext, useEffect, useState } from 'react';
import './ModalEditarPet.css';
import { PetContext } from '../contexts/PetContext';
import { uploadPetImage } from '../apiService';
import { TbPhotoExclamation } from 'react-icons/tb';
import Swal from 'sweetalert2'

function ModalEditarPet({ isEditarPet, setPetEditOpen, onEditPet, petToEdit }) {
    const { setPets } = useContext(PetContext);
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [raca, setRaca] = useState('');
    const [descricao, setDescricao] = useState('');
    const [porte, setPorte] = useState('');
    const [genero, setGenero] = useState('');
    const [especie, setEspecie] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInputEdit, setTagInputEdit] = useState('');
    const [initialTags, setInitialTags] = useState([]);
    const [imagens, setImagens] = useState([]);
    const [imagemPreviews, setImagemPreviews] = useState([]);


    useEffect(() => {
        if (petToEdit) {
            setNome(petToEdit.nome);
            setIdade(petToEdit.idade);
            setRaca(petToEdit.raca);
            setDescricao(petToEdit.descricao);
            setPorte(petToEdit.porte);
            setGenero(petToEdit.genero);
            setEspecie(petToEdit.especie);
            const tagsArray = petToEdit.tags ? petToEdit.tags.split(', ') : [];
            setTags(tagsArray);
            setInitialTags(tagsArray);

            let imgs = [];
            if (petToEdit.imagens) {
                imgs = petToEdit.imagens.split(',').map(s => s.trim()).filter(Boolean);
            } else if (petToEdit.imagem) {
                imgs = [petToEdit.imagem];
            }
            setImagens(imgs);
            setImagemPreviews(imgs);
        }
    }, [petToEdit]);

    useEffect(() => {
        if (isEditarPet && petToEdit) {
            const imgs = petToEdit.imagens
                ? petToEdit.imagens.split(',').map(s => s.trim()).filter(Boolean)
                : (petToEdit.imagem ? [petToEdit.imagem] : []);
            setImagemPreviews(imgs);
            setImagens(imgs);
            setTags(petToEdit.tags ? petToEdit.tags.split(',').map(s => s.trim()) : []);
        }
    }, [isEditarPet, petToEdit]);

    if (!isEditarPet) {
        return null;
    }


    const handleRemoveImage = (idx) => {
        setImagemPreviews(prev => prev.filter((_, i) => i !== idx));
        setImagens(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSetPrincipal = (idx) => {
        setImagemPreviews(prev => {
            const arr = [...prev];
            const [img] = arr.splice(idx, 1);
            arr.unshift(img);
            return arr;
        });
        setImagens(prev => {
            const arr = [...prev];
            const [img] = arr.splice(idx, 1);
            arr.unshift(img);
            return arr;
        });
    };

    const handleAddTag = () => {
        if (tagInputEdit.trim() !== '') {
            setTags([...tags, tagInputEdit.trim()]);
            setTagInputEdit('');
        }
    };

    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (imagemPreviews.length + files.length > 4) {
            Swal.fire({
              icon: 'warning',
              title: 'Limite de imagens',
              text: 'Você pode adicionar no máximo 4 imagens por pet.',
              confirmButtonColor: "#654833",
            });
            e.target.value = '';
            return;
          }
    
        const maxSize = 2 * 1024 * 1024;
        const validFiles = [];
        const newPreviews = [];
    
        for (const file of files) {
            if (file.size > maxSize) {
                Swal.fire({
                    icon: "warning",
                    title: "Imagem muito grande!",
                    text: "Cada imagem deve ter no máximo 2MB.",
                    confirmButtonColor: "#654833"
                });
                continue;
            }
            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }
    
        setImagens(prev => [...prev, ...validFiles]);
        setImagemPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const handleSave = async () => {
        if (imagemPreviews.length < 1) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "<span style='font-size: 22px;'>O anúncio precisa ter pelo menos uma foto!</span>",
                showConfirmButton: true,
                confirmButtonColor: '#654833',
                width: 500,
            });
            return;
        }

        Swal.fire({
            title: 'Enviando imagens...',
            html: '<b>Aguarde enquanto as imagens são enviadas.</b>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
    
        let uploadedUrls = [];
        try {
            uploadedUrls = await Promise.all(
                imagens.map(img =>
                    img instanceof File ? uploadPetImage(img) : img
                )
            );
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao enviar imagens",
                text: "Tente novamente.",
                confirmButtonColor: "#654833"
            });
            return;
        }
        Swal.close();
    
        const updatedPet = {
            ...petToEdit,
            nome,
            idade,
            raca,
            descricao,
            porte,
            genero,
            especie,
            imagens: uploadedUrls.join(','),
            tags: tags.join(', ')
        };
        onEditPet(updatedPet);
        setPetEditOpen(false);
        setPets((prevPets) =>
            prevPets.map((pet) => (pet.id_pet === updatedPet.id_pet ? updatedPet : pet))
        );
    };

    const handleClose = () => {
        setTags(initialTags);
        setPetEditOpen(false);
    };

    return (
        <div className="editar-pet-background" onClick={() => handleClose()}>
            <div className="editar-pet-container" onClick={(e) => e.stopPropagation()}>
                <h2>Editar Pet</h2>
                <div className="linha-edit">
                    <div className="editar-pet-container-1">
                        <label htmlFor="nome-pet">Nome</label>
                        <input
                            type="text"
                            name="nome-pet"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label htmlFor="idade-pet">Idade</label>
                        <input
                            type="text"
                            name="idade-pet"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                        />
                        <label htmlFor="raca-pet">Raça</label>
                        <input
                            type="text"
                            name="raca-pet"
                            value={raca}
                            onChange={(e) => setRaca(e.target.value)}
                        />
                    </div>

                    <div className="editar-pet-container-2">
                        <label htmlFor="especie-pet">Espécie</label>
                        <select
                            type="select"
                            name="especie-pet"
                            value={especie}
                            onChange={(e) => setEspecie(e.target.value)}>
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <label htmlFor="porte-pet">Porte</label>
                        <select
                            type="select"
                            name="porte-pet"
                            value={porte}
                            onChange={(e) => setPorte(e.target.value)}>
                            <option value="Pequeno">Pequeno</option>
                            <option value="Médio">Médio</option>
                            <option value="Grande">Grande</option>
                        </select>
                        <label htmlFor="genero-pet">Gênero</label>
                        <select
                            type="select"
                            name="genero-pet"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}>
                            <option value="Fêmea">Fêmea</option>
                            <option value="Macho">Macho</option>
                        </select>
                    </div>
                </div>

                <div className="coluna-edit">
                    <div className="edit-imagem-pet">
                        <div className="add-img">
                            <label htmlFor="imagemURL" className='labelImg'>Imagem:</label>
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('file-upload').click()}
                                className="botao-add-img"
                            >
                                Escolher Imagem
                            </button>
                        </div>
                        <div className="img-preview-edit">
                            {imagemPreviews.map((img, idx) => (
                                <div key={idx} className="img-preview-wrapper">
                                    <img
                                        src={img}
                                        alt={`Pré-visualização ${idx + 1}`}
                                        className={`imagem-preview ${idx === 0 ? 'imagem-principal' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="botao-excluir-img-pet"
                                        title="Excluir Imagem"
                                    >✕</button>
                                    {idx !== 0 && (
                                        <TbPhotoExclamation
                                            type="button"
                                            onClick={() => handleSetPrincipal(idx)}
                                            className="botao-img-principal-pet"
                                            title="Definir imagem como principal"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="edit-desc">
                        <label htmlFor="descricao-pet">Descrição</label>
                        <input
                            type="text"
                            name="descricao-pet"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                </div>

                <div className="tags-container-edit">
                    <label htmlFor="input-tag">Detalhes</label>
                    <div className="tag-edit-line">
                        <input
                            type="text"
                            value={tagInputEdit}
                            onChange={(e) => setTagInputEdit(e.target.value)}
                            className='input-tag-edit'
                            placeholder="Ex: Vacinado, Castrado, Brincalhão"
                        />
                        <button type="button" onClick={handleAddTag} className='add-tag-edit'>+</button>
                    </div>
                    <div className="tags-list-edit">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag-item-edit">
                                <div className="texto-tag-edit">
                                    {tag}
                                </div>
                                <button type="button" onClick={() => handleRemoveTag(index)} className='remove-tag'>x</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="botoes-edit-pet">
                    <button onClick={handleSave} className='botao-edit-salvar'>Salvar</button>
                    <button onClick={handleClose} className='botao-edit-fechar'>Fechar</button>
                </div>


            </div>
        </div>
    );
}

export default ModalEditarPet;