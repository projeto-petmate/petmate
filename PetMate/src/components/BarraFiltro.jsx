import React, { useContext, useEffect, useRef, useState } from 'react';
import { PetContext } from '../contexts/PetContext';
import './BarraFiltro.css';
import { FaStar } from "react-icons/fa6";

function BarraFiltro() {
  const { filter, setFilter, filterOn, setFilterOn, favoritos } = useContext(PetContext);
  const especieRef = useRef(null);
  const porteRef = useRef(null);
  const generoRef = useRef(null);
  const ordemRef = useRef(null);
  const [botaoFav, setBotaoFav] = useState(false)

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value
    }));
    setFilterOn(value !== '');
  };

  // função para alternar favoritos
  const toggleFavoritos = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      favoritos: !prevFilter.favoritos
    }));
  };

  const clearFilters = () => {
    // reset de favoritos
    setFilter({ ordem: 'recentes', favoritos: false });
    setFilterOn(false);
    especieRef.current.value = '';
    porteRef.current.value = '';
    generoRef.current.value = '';
    ordemRef.current.value = 'recentes';
  };
  

  return (
    <div className="filtro-container">
      <div className="botao-fav" onClick={() => setBotaoFav(!botaoFav)}>
        {botaoFav === false ? <button onClick={toggleFavoritos} className={`botao-fav-off ${filter.favoritos ? 'ativo' : ''}`}><FaStar className="icon-estrela" /> Favoritos</button> : <button onClick={toggleFavoritos} className={`botao-fav-on ${filter.favoritos ? 'ativo' : ''}`}><FaStar className="icon-estrela" />Favoritos</button>}
          <div className="estrela">
            {/* <FaStar className="icon-estrela" /> */}
            {/* Favoritos */}
          </div>
     
      </div>
      <div className="select-filter">
        <label htmlFor="selectEspecie">Espécie</label>
        <select name="especie" id="selectEspecie" onChange={handleFilterChange} ref={especieRef}>
          <option value=""></option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      <div className="select-filter">
        <label htmlFor="selectPorte">Porte</label>
        <select name="porte" id="selectPorte" onChange={handleFilterChange} ref={porteRef}>
          <option value=""></option>
          <option value="Pequeno">Pequeno</option>
          <option value="Médio">Médio</option>
          <option value="Grande">Grande</option>
        </select>
      </div>
      <div className="select-filter">
        <label htmlFor="selectGenero">Gênero</label>
        <select name="genero" id="selectGeneroFiltro" onChange={handleFilterChange} ref={generoRef}>
          <option value=""></option>
          <option value="Fêmea">Fêmea</option>
          <option value="Macho">Macho</option>
        </select>
      </div>
      <div className="select-filter">
        <label htmlFor="selectOrdem">Ordem</label>
        <select name="ordem" id="selectOrdem" onChange={handleFilterChange} ref={ordemRef}>
          <option value="recentes">Mais recentes</option>
          <option value="antigos">Mais antigos</option>
        </select>
      </div>
      <button onClick={clearFilters} className='botao-limpar'>
        Limpar Filtros
      </button>
    </div>
  );
}

export default BarraFiltro;