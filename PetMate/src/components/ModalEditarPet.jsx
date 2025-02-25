import { useContext, useEffect, useState } from 'react'
import './ModalEditarPet.css'
import { PetContext } from '../contexts/PetContext'

function ModalEditarPet({ isEditarPet, setPetEditOpen, onEditPet, petToEdit }) {
    const { pet, setPet } = useContext(PetContext)
    const [nome, setNome] = useState('')
    const [idade, setIdade] = useState('')
    const [raca, setRaca] = useState('')
    const [descricao, setDescricao] = useState('')
    const [porte, setPorte] = useState('')
    const [genero, setGenero] = useState('')
    const [imagem, setImagem] = useState('')
    const [especie, setEspecie] = useState('')
    const [tags, setTags] = useState('')

    useEffect(() => {
        if (petToEdit) {
            setNome(petToEdit.nome)
            setIdade(petToEdit.idade)
            setRaca(petToEdit.raca)
            setDescricao(petToEdit.descricao)
            setPorte(petToEdit.porte)
            setGenero(petToEdit.genero)
            setImagem(petToEdit.imagem)
            setEspecie(petToEdit.especie)
            setTags(petToEdit.tags)
        }
    }, [petToEdit])

    if (!isEditarPet) {
        return null
    }

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
            tags
        }
        onEditPet(updatedPet)
    }

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
                        <label htmlFor="descricao-pet">Descrição</label>
                        <input
                            type="text"
                            name="descricao-pet"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className="editar-pet-container-2">
                        <label htmlFor="porte-pet">Porte</label>
                        <input
                            type="text"
                            name="porte-pet"
                            value={porte}
                            onChange={(e) => setPorte(e.target.value)}
                        />
                        <label htmlFor="genero-pet">Gênero</label>
                        <input
                            type="text"
                            name="genero-pet"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                        />
                        <label htmlFor="imagem-pet">Imagem URL</label>
                        <input
                            type="text"
                            name="imagem-pet"
                            value={imagem}
                            onChange={(e) => setImagem(e.target.value)}
                        />
                        <label htmlFor="especie-pet">Espécie</label>
                        <input
                            type="text"
                            name="especie-pet"
                            value={especie}
                            onChange={(e) => setEspecie(e.target.value)}
                        />
                    </div>
                </div>

                <label htmlFor="tags-pet">Tags</label>
                <input
                    type="text"
                    name="tags-pet"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button onClick={handleSave}>Salvar</button>
                <button onClick={() => setPetEditOpen(false)}>Fechar</button>
            </div>
        </div>
    )
}

export default ModalEditarPet