import './BarraPesquisa.css';
import { FaSearch } from 'react-icons/fa';

function BarraPesquisa({ valor, setValor }) {
  return (
    <div className='pesquisa-container'>
      <input 
        className='barraDePesquisa' 
        type="text" 
        placeholder="Digite aqui para encontrar a ONG!" 
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <FaSearch className='lupaIcon' />
    </div>
  );
}

export default BarraPesquisa;