import React, { useState, useContext, useEffect } from 'react'
import './Navbar.css'
import './ModalAnunciarPet.css'
import { PetContext } from "../contexts/PetContext"
import { useNavigate } from 'react-router-dom'
import SegundaEtapaPet from './SegundaEtapaPet'
import { CgCloseO } from "react-icons/cg"
import Swal from 'sweetalert2'
import { GlobalContext } from "../contexts/GlobalContext";
import { uploadPetImage } from '../apiService';
import './CarrosselPet.css';

export default function ModalAnunicarPet({ isOpen, setModalOpen }) {
  const { addPet, setPets, pets } = useContext(PetContext)
  const { userLogado } = useContext(GlobalContext);
  const [inptPetEspecie, setInptPetEspecie] = useState('')
  const [inptPetNome, setInptPetNome] = useState('')
  const [inptPetRaca, setInptPetRaca] = useState('')
  const [inptPetIdade, setInptPetIdade] = useState('')
  const [inptPetPorte, setInptPetPorte] = useState('')
  const [inptPetGenero, setInptPetGenero] = useState('')
  const [inptPetDescricao, setInptPetDescricao] = useState('')
  const [inptPetImagens, setInptPetImagens] = useState([]);
  const [imagemPreview, setImagemPreview] = useState([]);
  const [aceitarTermos, setAceitarTermos] = useState(false)
  const [erros, setErros] = useState({})
  const [etapa, setEtapa] = useState(1)
  const vrfOng = userLogado?.id_ong ? true : false;
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      imagemPreview.forEach(previewUrl => URL.revokeObjectURL(previewUrl));
      setImagemPreview([]);
      setInptPetImagens([]);
      setInptPetEspecie('');
      setInptPetNome('');
      setInptPetRaca('');
      setInptPetIdade('');
      setInptPetPorte('');
      setInptPetGenero('');
      setInptPetDescricao('');
      setAceitarTermos(false);
      setErros({});
      setEtapa(1);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null
  }

  const validarFormulario = () => {
    const novosErros = {};
    if (!inptPetEspecie) novosErros.especie = 'Espécie é obrigatória.';
    if (!inptPetNome) novosErros.nome = 'Nome é obrigatório.';
    if (!inptPetRaca) novosErros.raca = 'Raça é obrigatória.';
    if (!inptPetIdade) novosErros.idade = 'Idade é obrigatória.';
    if (!inptPetPorte) novosErros.porte = 'Porte é obrigatório.';
    if (!inptPetGenero) novosErros.genero = 'Gênero é obrigatório.';
    if (!inptPetDescricao) novosErros.descricao = 'Descrição é obrigatória.';
    if (imagemPreview.length === 0) novosErros.imagem = 'Pelo menos uma imagem é obrigatória.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };




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
  const files = Array.from(e.target.files);
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (imagemPreview.length + files.length > 4) {
    Swal.fire({
      icon: 'warning',
      title: 'Limite de imagens',
      text: 'Você pode adicionar no máximo 4 imagens por pet.'
    });
    return;
  }

  const validFiles = [];
  const previews = [];
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
    previews.push(URL.createObjectURL(file));
  }

  setInptPetImagens(prev => [...prev, ...validFiles]);
  setImagemPreview(prev => [...prev, ...previews]);
};

  const handleRemoveImage = (idx) => {
    setImagemPreview(prev => prev.filter((_, i) => i !== idx));
    setInptPetImagens(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSetPrincipal = (idx) => {
    setImagemPreview(prev => {
      const arr = [...prev];
      const [img] = arr.splice(idx, 1);
      arr.unshift(img);
      return arr;
    });
    setInptPetImagens(prev => {
      const arr = [...prev];
      const [img] = arr.splice(idx, 1);
      arr.unshift(img);
      return arr;
    });
  };

  const enviarPet = async (tags = [], condicoes = '') => {
    if (!userLogado) {
      console.error("Erro: Usuário não está logado.");
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
        inptPetImagens.map(file => uploadPetImage(file))
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

    const novoPet = {
      especie: inptPetEspecie,
      nome: inptPetNome,
      raca: inptPetRaca,
      idade: inptPetIdade,
      porte: inptPetPorte,
      genero: inptPetGenero,
      descricao: inptPetDescricao,
      imagens: uploadedUrls.join(','),
      tags: tags.join(', '),
      condicoes: condicoes,
      id_usuario: vrfOng ? null : userLogado.id_usuario,
      id_ong: vrfOng ? userLogado.id_ong : null,
      disponivel: true,
      data_criacao: new Date().toISOString(),
    };

    try {
      const response = await addPet(novoPet);
      console.log('Pet cadastrado:', response);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Anúncio enviado com sucesso!",
        showConfirmButton: false,
        timer: 2000,
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
    }
  };

  return (
    <div className='modal-anunciar-fundo'>
      <div className='container-modal-anunciar'>
        {etapa === 1 ? (
          <form className="cad-pet-container" onSubmit={(e) => { e.preventDefault(); setEtapa(2) }}>
            <div className="titulo-cad-pet">
              <div className="titulo-barra-pet">
                <h2>Criar anúncio para Pet</h2>
                <img src="/images/barra_marrom.png" className='barra-pet' />
              </div>
              <CgCloseO onClick={() => setModalOpen(false)} className='botao-modal-2' />
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
                      <option value="" disabled>Espécie do Pet</option>
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
                      <option value="" disabled>Porte do Pet</option>
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
                      id="selectGeneroCad"
                      name="selectGenero"
                      value={inptPetGenero}
                      onChange={(e) => setInptPetGenero(e.target.value)}
                    >
                      <option value="" disabled>Gênero do Pet</option>
                      <option value="Fêmea">Fêmea</option>
                      <option value="Macho">Macho</option>
                    </select>
                  </div>
                </div>
              </div>
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
            inptPetImagens={inptPetImagens}
            setInptPetImagens={setInptPetImagens}
            imagemPreview={imagemPreview}
            setImagemPreview={setImagemPreview}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            handleSetPrincipal={handleSetPrincipal}
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