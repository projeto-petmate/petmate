import React, { useState, useContext } from 'react'
import './Navbar.css'
import './JanelaModal.css'
import { PetContext } from "../contexts/PetContext"
import { useNavigate } from 'react-router-dom'
import SegundaEtapaPet from './SegundaEtapaPet'
import { IoMdClose } from "react-icons/io"
import { CgCloseO } from "react-icons/cg"

export default function JanelaModal({ isOpen, setModalOpen }) {
  const { addPet } = useContext(PetContext)
  const navigate = useNavigate()

  const [inptPetEspecie, setInptPetEspecie] = useState('')
  const [inptPetNome, setInptPetNome] = useState('')
  const [inptPetRaca, setInptPetRaca] = useState('')
  const [inptPetIdade, setInptPetIdade] = useState('')
  const [inptPetPorte, setInptPetPorte] = useState('')
  const [inptPetGenero, setInptPetGenero] = useState('')
  const [inptPetDescricao, setInptPetDescricao] = useState('')
  const [inptPetImagem, setInptPetImagem] = useState('')
  const [imagemPreview, setImagemPreview] = useState(null)
  const [aceitarTermos, setAceitarTermos] = useState(false)
  const [erros, setErros] = useState({})
  const [etapa, setEtapa] = useState(1)

  if (!isOpen) {
    return null
  }

  const validarFormulario = () => {
    if (!inptPetEspecie || !inptPetNome || !inptPetRaca || !inptPetIdade || !inptPetPorte || !inptPetGenero || !inptPetDescricao || !inptPetImagem || !aceitarTermos) {
      return { geral: 'Todos os campos são obrigatórios e você deve aceitar os termos e condições.' }
    }
    return {}
  }

  const CadastrarPet = async (e) => {
    e.preventDefault()

    const novosErros = validarFormulario()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    enviarPet()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setInptPetImagem(reader.result)
      setImagemPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const enviarPet = async (tags = [], condicoes = '') => {
    const novoPet = {
      especie: inptPetEspecie,
      nome: inptPetNome,
      raca: inptPetRaca,
      idade: inptPetIdade,
      porte: inptPetPorte,
      genero: inptPetGenero,
      descricao: inptPetDescricao,
      imagem: inptPetImagem,
      tags: tags.join(', '),
      condicoes: condicoes,
    }

    try {
      await addPet(novoPet)
      console.log('Pet cadastrado:', novoPet)
      setModalOpen(false)
      window.location.reload()
    } catch (error) {
      setErros({ geral: 'Erro ao cadastrar pet. Tente novamente.' })
    }
  }

  return (
    <div className='modal_conteiner' onClick={() => setModalOpen(false)}>
      <div className='conteiner_modal' onClick={(e) => e.stopPropagation()}>
        {etapa === 1 ? (
          <form className="cad-pet-container" onSubmit={(e) => { e.preventDefault(); setEtapa(2) }}>
            <div className="titulo-cad-pet">
              <div className="titulo-barra-pet">
                <h2>Criar anúncio para Pet</h2>
                <img src="/images/barra_marrom.png" className='barra-pet' />
              </div>
              <CgCloseO onClick={() => setModalOpen(false)} className='botao_modal_2' />
            </div>
            <div className="inputs-pet">
              <div className="inpts-pet-1">
                <div className="linha-inpt">
                  <div className="label-inpt">
                    <label htmlFor="nomePet">Nome do Pet:</label>
                    <input
                      id="nomePet"
                      type="text"
                      placeholder='Nome do seu Pet'
                      value={inptPetNome}
                      onChange={(e) => setInptPetNome(e.target.value)}
                    />
                  </div>
                  <div className="label-inpt">
                    <label htmlFor="selectEspecie">Espécie:</label>
                    <select
                      id="selectEspecie"
                      name="selectEspecie"
                      value={inptPetEspecie}
                      onChange={(e) => setInptPetEspecie(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="Cachorro">Cachorro</option>
                      <option value="Gato">Gato</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
                <div className="linha-inpt">
                  <div className="label-inpt">
                    <label htmlFor="idadePet">Idade:</label>
                    <input
                      id="idadePet"
                      type="text"
                      placeholder='Idade do seu Pet'
                      value={inptPetIdade}
                      onChange={(e) => setInptPetIdade(e.target.value)}
                    />
                  </div>
                  <div className="label-inpt">
                    <label htmlFor="selectPorte">Porte:</label>
                    <select
                      id="selectPorte"
                      name="selectPorte"
                      value={inptPetPorte}
                      onChange={(e) => setInptPetPorte(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="Pequeno">Pequeno</option>
                      <option value="Médio">Médio</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </div>
                </div>
                <div className="linha-inpt">
                  <div className="label-inpt">
                    <label htmlFor="racaPet">Raça:</label>
                    <input
                      id="racaPet"
                      type="text"
                      placeholder='Raça do seu Pet'
                      value={inptPetRaca}
                      onChange={(e) => setInptPetRaca(e.target.value)}
                    />
                  </div>
                  <div className="label-inpt">
                    <label htmlFor="selectGenero">Gênero:</label>
                    <select
                      id="selectGenero"
                      name="selectGenero"
                      value={inptPetGenero}
                      onChange={(e) => setInptPetGenero(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="Fêmea">Fêmea</option>
                      <option value="Macho">Macho</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="label-inpt-img">
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
              {imagemPreview === null ? '' :
                <div className="img-preview" >
                  {imagemPreview && (
                    <img src={imagemPreview} alt="Pré-visualização" className="imagem-preview" />
                  )}
                </div>
              }

            </div>

            <div className="descricao-pet-cad">
              <label htmlFor="descricaoPet">Descrição:</label>
              <input
                id="descricaoPet"
                type="text"
                placeholder='Adicione uma descrição para seu anúncio!'
                value={inptPetDescricao}
                onChange={(e) => setInptPetDescricao(e.target.value)}
              />
            </div>

            <button type="submit" className='botao-cad-pet'>Próxima Etapa</button>
          </form>
        ) : (
          <SegundaEtapaPet
            inptPetEspecie={inptPetEspecie}
            inptPetNome={inptPetNome}
            inptPetRaca={inptPetRaca}
            inptPetIdade={inptPetIdade}
            inptPetPorte={inptPetPorte}
            inptPetGenero={inptPetGenero}
            inptPetDescricao={inptPetDescricao}
            inptPetImagem={inptPetImagem}
            aceitarTermos={aceitarTermos}
            setAceitarTermos={setAceitarTermos}
            setEtapa={setEtapa}
            enviarPet={enviarPet}
            erros={erros}
            setModalOpen={setModalOpen}
          />
        )}
      </div>
    </div>
  )
}