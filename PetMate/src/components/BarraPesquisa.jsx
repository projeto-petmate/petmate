import './BarraPesquisa.css';
import { FaSearch } from "react-icons/fa";

function BarraPesquisa() {
  return (
    <div className='pesquisa-container'>
      <input className='barraDePesquisa' type="text" placeholder="Digite aqui para encontrar seu novo amigo!" />
      <FaSearch className='lupaIcon' />
      {/* <img className='iconeLupa' src="/images/procurar.png" alt="" /> */}
    </div>
  )
}

export default BarraPesquisa
