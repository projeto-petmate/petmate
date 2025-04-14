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
  const [botaoFav, setBotaoFav] = useState(false);
  const vrfOng = JSON.parse(localStorage.getItem("vrfOng"));
  const [mostrarFiltro, setMostrarFiltro] = useState(true); // Estado para controlar a visibilidade dos filtros

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value
    }));
    setFilterOn(value !== '');
  };

  const toggleFavoritos = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      favoritos: !prevFilter.favoritos
    }));
  };

  const clearFilters = () => {
    setFilter({ ordem: 'recentes', favoritos: false });
    setFilterOn(false);
    especieRef.current.value = '';
    porteRef.current.value = '';
    generoRef.current.value = '';
    ordemRef.current.value = 'recentes';
  };

  return (
    <div>
      {/* Botão para mostrar/esconder filtros (visível em dispositivos móveis) */}
      <button
        className="toggle-filtro-btn"
        onClick={() => setMostrarFiltro((prev) => !prev)}
      >
        {mostrarFiltro ? 'Esconder filtros' : 'Mostrar filtros'}
      </button>

      {/* Renderiza a barra de filtros somente se mostrarFiltro for true */}
      {mostrarFiltro && (
        <div className="filtro-container">
          {vrfOng == false && (
            <div className="botao-fav" onClick={() => setBotaoFav(!botaoFav)}>
              {botaoFav === false ? (
                <button
                  onClick={toggleFavoritos}
                  className={`botao-fav-off ${filter.favoritos ? 'ativo' : ''}`}
                >
                  <FaStar className="icon-estrela" /> Favoritos
                </button>
              ) : (
                <button
                  onClick={toggleFavoritos}
                  className={`botao-fav-on ${filter.favoritos ? 'ativo' : ''}`}
                >
                  <FaStar className="icon-estrela" /> Favoritos
                </button>
              )}
            </div>
          )}
          <div className="select-filter">
            <label htmlFor="selectEspecie">Espécie</label>
            <select
              name="especie"
              id="selectEspecie"
              onChange={handleFilterChange}
              ref={especieRef}
            >
              <option value="">Todas as espécies</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="select-filter">
            <label htmlFor="selectPorte">Porte</label>
            <select
              name="porte"
              id="selectPorte"
              onChange={handleFilterChange}
              ref={porteRef}
            >
              <option value="">Todos os portes</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div className="select-filter">
            <label htmlFor="selectGenero">Gênero</label>
            <select
              name="genero"
              id="selectGenero"
              onChange={handleFilterChange}
              ref={generoRef}
            >
              <option value="">Todos os gêneros</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
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
      )}
    </div>
  );
}

export default BarraFiltro;