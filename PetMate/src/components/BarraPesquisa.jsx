import './BarraPesquisa.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function BarraPesquisa() {
  const navigate = useNavigate();

  const handleFocus = () => {
    navigate('/adotar'); // Redireciona para a tela de adoção
  };

  return (
    <div className='pesquisa-container'>
      <input 
        className='barraDePesquisa' 
        type="text" 
        placeholder="Digite aqui para encontrar seu novo amigo!" 
        onFocus={handleFocus} // Chamando a função ao focar
      />
      <FaSearch className='lupaIcon' />
    </div>
  );
}

export default BarraPesquisa;
