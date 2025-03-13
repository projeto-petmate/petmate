import React, { useContext, useState, useEffect } from 'react'
import './JanelaPet.css'
import { PetContext } from "../contexts/PetContext"
import axios from 'axios'
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa"
import { MdOutlineEmail } from "react-icons/md"
import { IoMdClose } from "react-icons/io"

export default function JanelaPet({ isOpen, setPetModalOpen }) {
  const { pet } = useContext(PetContext)
  const [doador, setDoador] = useState(null)

  useEffect(() => {
    if (pet && pet.id_usuario) {
      const fetchDoador = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/usuarios/${pet.id_usuario}`)
          setDoador(response.data)
        } catch (error) {
          console.error('Erro ao buscar informações do doador:', error)
        }
      }
      fetchDoador()
    }
  }, [pet])

  if (!isOpen || !pet) {
    return null
  }

  const linkWpp = doador ? `https://api.whatsapp.com/send?phone=${'55' + doador.telefone}&text=Ol%C3%A1!%20Estou%20interessado%20em%20${pet.nome}.` : "#"
  const linkEmail = doador ? `mailto:${doador.email}?subject=Ado%C3%A7%C3%A3o+PetMate` : "#"
  const linkMaps = doador ? `https://www.google.com/maps/search/?api=1&query=${doador.endereco}` : "#"

  const tagsArray = pet.tags ? pet.tags.split(', ') : []

  return (
    <div className='pet_modal_conteiner'>
      <div className='conteiner_modal_pet'>
        <div className="titulo-pet-modal">
          <h2>{pet.nome}</h2>
          <button onClick={() => setPetModalOpen(false)} className='botao-fechar-pet'>{<IoMdClose className='closeIcon' />}</button>
        </div>
        <img src="/images/barra_marrom.png" className='barra-pet-modal' alt="Barra" />
        <div className="card-pet-container">
          <div className="modal-pet-1">

            <div className="img-modal">
              <img
                src={pet.imagem ? pet.imagem : "/images/default_pet_image.jpg"}
                alt={`Imagem de ${pet.nome}`}
                className="pet-image"
              />
            </div>

            <div className="descricao-pet">
              <div className="desc-title">
                <p>Informações</p>
              </div>
              <div className="detalhes-pet">
                <div className='detalhePet'>
                  <p>Raça</p> <h4>{pet.raca}</h4>
                </div>
                <div className='detalhePet'>
                  <p>Idade</p> <h4>{pet.idade}</h4>
                </div>
                <div className='detalhePet'>
                  <p>Porte</p> <h4>{pet.porte}</h4>
                </div>
                <div className='detalhePet'>
                  <p>Gênero</p> <h4>{pet.genero}</h4>
                </div>
              </div>
              <p className='desc-title-2'>Descrição</p>
              <p className='descPet'> {pet.descricao}</p>
            </div>
          </div>

          <div className="modal-pet-2">
            <div className="info-container">
              <p className='info-title'>
                Características de {pet.nome}
              </p>
              <div className="pet-tag-container">
                {tagsArray.map((tag, index) => (
                  <span key={index} className="pet-tag">{tag}</span>
                ))}
              </div>
              <div className="info-condicoes-pet">
                <p className='info-title'>
                  Condições especiais
                </p>
                <div className="info-condicoes">
                  {pet.condicoes != 'não' ? `${pet.condicoes}` : 'Nenhuma'}
                </div>
              </div>
            </div>

            <div className="info-doador-modal">
              <h2>Quer Adotar?</h2>
              <p>Para adotar este pet, entre em contato com o protetor:</p>
              {doador && (
                <div className="info-doador">
                  <p>Nome do anunciante: <div className="dados-doador"> {doador.nome}</div></p>
                  <p>Endereço: <div className="dados-doador"> {doador.endereco}</div></p>
                  <div className="links-contato">
                    <a href={linkWpp}>
                      <FaWhatsapp className='icon_wpp' />
                    </a>

                    <a href={linkEmail}>
                      <MdOutlineEmail className='iconEmail' />
                    </a>

                    <a href={linkMaps}>
                      <FaMapMarkerAlt className='iconMap' />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}