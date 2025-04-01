import './BarraPesquisa.css';
import { FaSearch } from 'react-icons/fa';

function BarraPesquisa() {
  return (
    <div className='pesquisa-container'>
      <input 
        className='barraDePesquisa' 
        type="text" 
        placeholder="Digite aqui para encontrar a ONG!" 
      />
      <FaSearch className='lupaIcon' />
    </div>
  );
}

export default BarraPesquisa;