import { useContext, useState, useEffect } from 'react';
import './JanelaPet.css';
import { PetContext } from "../contexts/PetContext";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { GoAlert } from 'react-icons/go';
import ModalDenuncia from './ModalDenuncia';
import { GlobalContext } from '../contexts/GlobalContext';
import { CgCloseO } from 'react-icons/cg';
import CarrosselPet from './CarrosselPet';
import { getOngById, getUsuarioById } from '../apiService';

export default function JanelaPet({ isOpen, setPetModalOpen }) {
  const { pet } = useContext(PetContext);
  const [doador, setDoador] = useState(null);
  const { openDenuncia, openModalDenuncia, setOpenModalDenuncia, logado } = useContext(GlobalContext);

  useEffect(() => {
    if (pet) {
      const fetchDoador = async () => {
        try {
          let response;
          if (pet.id_usuario) {
            response = await getUsuarioById(pet.id_usuario);
          } else if (pet.id_ong) {
            response = await getOngById(pet.id_ong);
          }
          setDoador(response);
        } catch (error) {
          console.error('Erro ao buscar informações do doador/ONG:', error);
        }
      };
      fetchDoador();
    }
  }, [pet]);

  if (!isOpen || !pet) {
    return null;
  }

  const cidade = doador?.cidade || 'Cidade não informada';
  const bairro = doador?.bairro || 'Bairro não informado';

  const telefone = doador?.telefone;
  const email = doador?.email_contato || doador?.email;
  const endereco = pet.id_usuario ? `${bairro}, ${cidade}` : `${cidade}, ${doador?.endereco}`;
  const nome = doador?.nome_ong || doador?.nome

  const linkWpp = telefone && `https://api.whatsapp.com/send?phone=${'55' + telefone}&text=Ol%C3%A1%2C%20vim%20pelo%20PetMate.%20Estou%20interessado%20no%20pet%20${pet.nome}.`;
  const linkEmail = email && `mailto:${email}?subject=Ado%C3%A7%C3%A3o+PetMate`;
  const linkMaps = endereco && `https://www.google.com/maps/search/?api=1&query=${endereco}`;

  const tagsArray = pet.tags ? pet.tags.split(', ') : [];
  

  const imagensArray = pet.imagens
    ? pet.imagens.split(',').map(s => s.trim()).filter(Boolean)
    : (pet.imagem ? [pet.imagem] : []);


  return (
    <div className='pet_modal_container' onClick={() => setPetModalOpen(false)}>
      <div className='container_modal_pet' onClick={(e) => e.stopPropagation()}>
        <div className="titulo-pet-modal">
          <div className="titulo-nome-pet">
            <h2>{pet.nome}</h2>
          </div>
          <div className="titulo-pet">
            {logado &&
              <div className="texto-denunciar-pet" onClick={openDenuncia}>
                {<GoAlert className='icon-denuncia-pet' />}
                <p>
                  DENUNCIAR
                </p>
              </div>
            }
            <CgCloseO onClick={() => setPetModalOpen(false)} className="icon-fechar-denuncia"></CgCloseO>
          </div>
        </div>
        <img src="/images/barra_marrom.png" className='barra-pet-modal' alt="Barra" />
        <div className="janela-pet-container">
          <div className="modal-pet-1">

            <div className="carrossel-img-pet">
              <CarrosselPet images={imagensArray.length > 0 ? imagensArray : ["/images/default_pet_image.jpg"]} />
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
                  {pet.condicoes !== 'não' ? `${pet.condicoes}` : 'Nenhuma'}
                </div>
              </div>
            </div>
            <div className="info-doador-modal">
              <h2>Quer Adotar?</h2>
              <p>Para adotar este pet, entre em contato com o anunciante:</p>
              {doador && (
                <div className="info-doador-container">
                  <div className="info-doador">
                    <div className="dados-doador">
                      <h4>Nome do anunciante: <div className="dados-doador"> {nome}</div></h4>
                    </div>
                    <div className="dados-doador">
                    </div>
                    <div className="dados-endereco">
                      <div className='info-endereco'>
                        <h4>Estado: </h4>
                        <p>{doador.uf}</p>
                      </div>
                      <div className='info-endereco'>
                        <h4>Cidade:</h4>
                        <p>{doador.cidade}</p>
                      </div>
                    </div>
                  </div>
                  <div className="links-contato">
                    <a href={linkWpp} target='_blank'>
                      <FaWhatsapp className='icon_wpp' />
                    </a>

                    <a href={linkEmail} target='_blank'>
                      <MdOutlineEmail className='iconEmail' />
                    </a>
                    <a href={linkMaps} target='_blank'>
                      <FaMapMarkerAlt className='iconMap' />
                    </a>
                  </div>
                  <ModalDenuncia
                    isOpen={openModalDenuncia}
                    setIsOpen={setOpenModalDenuncia}
                    idObjeto={pet.id_pet}
                    tipo='pet' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}