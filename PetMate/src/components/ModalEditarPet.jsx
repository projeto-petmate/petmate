import { useContext, useEffect, useState } from 'react';
import './ModalEditarPet.css';
import { PetContext } from '../contexts/PetContext';

function ModalEditarPet({ isEditarPet, setPetEditOpen, onEditPet, petToEdit }) {
    const { pet, setPet } = useContext(PetContext);
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [raca, setRaca] = useState('');
    const [descricao, setDescricao] = useState('');
    const [porte, setPorte] = useState('');
    const [genero, setGenero] = useState('');
    const [imagem, setImagem] = useState('');
    const [especie, setEspecie] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInputEdit, setTagInputEdit] = useState('');
    const [initialTags, setInitialTags] = useState([]);

    useEffect(() => {
        if (petToEdit) {
            setNome(petToEdit.nome);
            setIdade(petToEdit.idade);
            setRaca(petToEdit.raca);
            setDescricao(petToEdit.descricao);
            setPorte(petToEdit.porte);
            setGenero(petToEdit.genero);
            setImagem(petToEdit.imagem);
            setEspecie(petToEdit.especie);
            const tagsArray = petToEdit.tags ? petToEdit.tags.split(', ') : [];
            setTags(tagsArray);
            setInitialTags(tagsArray);
        }
    }, [petToEdit]);

    if (!isEditarPet) {
        return null;
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagem(reader.result);
        };
        reader.readAsDataURL(file);
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

    const handleSave = () => {
        const updatedPet = {
            ...petToEdit,
            nome,
            idade,
            raca,
            descricao,
            porte,
            genero,
            imagem,
            especie,
            tags: tags.join(', ')
        };
        onEditPet(updatedPet);
        setPetEditOpen(false);
    };

    const handleClose = () => {
        setTags(initialTags);
        setPetEditOpen(false);
    };

    return (
        <div className="editar-pet-background">
            <div className="editar-pet-container">
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
                    <div className="edit-imagem">
                    <div className="control edit-imagem">
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('file-upload').click()}
                                className="add-img-pet"
                            >
                                Escolher Imagem
                            </button>
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
                            name='input-tag-edit'
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