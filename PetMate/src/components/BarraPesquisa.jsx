import './BarraPesquisa.css';

function BarraPesquisa() {
  return (
       <div className='pesquisa-container'>
        <input className='barraDePesquisa' type="text" placeholder="Digite aqui para encontrar seu novo amigo!" />
        <img className='iconeLupa' src="/images/procurar.png" alt="" />
      </div>
  )
}

export default BarraPesquisa
