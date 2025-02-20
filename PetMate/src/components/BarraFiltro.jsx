import React, { useContext, useRef } from 'react';
import { PetContext } from '../contexts/PetContext';
import './BarraFiltro.css';

function BarraFiltro() {
  const { filter, setFilter, filterOn, setFilterOn } = useContext(PetContext);
  const especieRef = useRef(null);
  const porteRef = useRef(null);
  const generoRef = useRef(null);
  const ordemRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value
    }));
    setFilterOn(value !== '');
  };

  const clearFilters = () => {
    setFilter({ ordem: 'recentes'});
    setFilterOn(false);
    especieRef.current.value = '';
    porteRef.current.value = '';
    generoRef.current.value = '';
    ordemRef.current.value = 'recentes';
  };

  return (
    <div className="filtro-container">
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
        <select name="genero" id="selectGenero" onChange={handleFilterChange} ref={generoRef}>
          <option value=""></option>
          <option value="Fêmea">Fêmea</option>
          <option value="Macho">Macho</option>
        </select>
      </div>
      <div className="select-filter">
        <label htmlFor="selectOrdem">Ordem</label>
        <select name="ordem" id="selectOrdem" onChange={handleFilterChange} ref={ordemRef}>
          {/* <option value=""></option> */}
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