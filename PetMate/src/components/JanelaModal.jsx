import React, { useState, useContext } from 'react';
import './Navbar.css';
import './JanelaModal.css';
import { PetContext } from "../contexts/PetContext";
import { useNavigate } from 'react-router-dom';
import SegundaEtapaPet from './SegundaEtapaPet';
import { IoMdClose } from "react-icons/io";
import { CgCloseO } from "react-icons/cg";

export default function JanelaModal({ isOpen, setModalOpen }) {
  const { addPet } = useContext(PetContext);
  const navigate = useNavigate();

  const [inptPetEspecie, setInptPetEspecie] = useState('');
  const [inptPetNome, setInptPetNome] = useState('');
  const [inptPetRaca, setInptPetRaca] = useState('');
  const [inptPetIdade, setInptPetIdade] = useState('');
  const [inptPetPorte, setInptPetPorte] = useState('');
  const [inptPetGenero, setInptPetGenero] = useState('');
  const [inptPetDescricao, setInptPetDescricao] = useState('');
  const [inptPetImagemURL, setInptPetImagemURL] = useState('');
  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [erros, setErros] = useState({});
  const [etapa, setEtapa] = useState(1);

  if (!isOpen) {
    return null;
  }

  const validarFormulario = () => {
    if (!inptPetEspecie || !inptPetNome || !inptPetRaca || !inptPetIdade || !inptPetPorte || !inptPetGenero || !inptPetDescricao || !inptPetImagemURL || !aceitarTermos) {
      return { geral: 'Todos os campos são obrigatórios e você deve aceitar os termos e condições.' };
    }
    return {};
  };

  const CadastrarPet = async (e) => {
    e.preventDefault();

    const novosErros = validarFormulario();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    enviarPet();
  };

  const enviarPet = async (tags) => {
    const novoPet = {
      especie: inptPetEspecie,
      nome: inptPetNome,
      raca: inptPetRaca,
      idade: inptPetIdade,
      porte: inptPetPorte,
      genero: inptPetGenero,
      descricao: inptPetDescricao,
      imagem: inptPetImagemURL,
      tags: tags.join(', '), 
    };

    try {
      await addPet(novoPet);
      console.log('Pet cadastrado:', novoPet);
      setModalOpen(false);
      window.location.reload();
  } catch (error) {
      setErros({ geral: 'Erro ao cadastrar pet. Tente novamente.' });
  }
};

  return (
    <div className='modal_conteiner'>
      <div className='conteiner_modal'>
        {etapa === 1 ? (
          <form className="cad-pet-container" onSubmit={(e) => { e.preventDefault(); setEtapa(2); }}>
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
                    <label>Espécie:</label>
                    <select
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
                  <div className="label-inpt">
                    <label>Nome do Pet:</label>
                    <input
                      type="text"
                      value={inptPetNome}
                      onChange={(e) => setInptPetNome(e.target.value)}
                    />
                  </div>
                </div>
                <div className="linha-inpt">
                  <div className="label-inpt">
                    <label>Raça:</label>
                    <input
                      type="text"
                      value={inptPetRaca}
                      onChange={(e) => setInptPetRaca(e.target.value)}
                    />
                  </div>
                  <div className="label-inpt">
                    <label>Idade:</label>
                    <input
                      type="text"
                      value={inptPetIdade}
                      onChange={(e) => setInptPetIdade(e.target.value)}
                    />
                  </div>
                </div>
                <div className="linha-inpt">
                  <div className="label-inpt">
                    <label>Porte:</label>
                    <select
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
                  <div className="genero-pet">
                    <label>Gênero:</label>
                    <div className="radio-pet">
                      <select
                            type="select"
                            name="especie-pet"
                            value={inptPetGenero}
                            onChange={(e) => setInptPetGenero(e.target.value)}>
                            <option value=""></option>
                            <option value="Fêmea">Fêmea</option>
                            <option value="Macho">Macho</option>
                        </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="label-inpt">
              <label>Imagem URL:</label>
              <input
                className='inptImgPet'
                type="text"
                placeholder='Adicione a URL da imagem do seu Pet!'
                value={inptPetImagemURL}
                onChange={(e) => setInptPetImagemURL(e.target.value)}
              />
            </div>

            <div className="descricao-pet-cad">
              <label>Descrição:</label>
              <input
                type="text"
                placeholder='Adicione uma descrição para seu anúncio!'
                value={inptPetDescricao}
                onChange={(e) => setInptPetDescricao(e.target.value)}
              />
            </div>

            {erros.geral && <p className="erro-mensagem">{erros.geral}</p>}
            {/* <div className="termos-cadastro-pet">
              <div className="termos-pet">
                <input
                  type="checkbox"
                  checked={aceitarTermos}
                  onChange={(e) => setAceitarTermos(e.target.checked)}
                />
                <p className='termos-1'>
                  Ao preencher o formulário acima você concorda com os nossos
                </p>
                <a href="#" className='link-termos'>Termos de Uso.</a>
              </div>
            </div> */}
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
            inptPetImagemURL={inptPetImagemURL}
            aceitarTermos={aceitarTermos}
            setEtapa={setEtapa}
            enviarPet={enviarPet}
            erros={erros}
            setModalOpen={setModalOpen}
          />
        )}
      </div>
    </div>
  );
}