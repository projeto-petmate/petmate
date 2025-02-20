import './SegundaEtapaPet.css'
import { IoMdClose } from "react-icons/io";


function SegundaEtapaPet({
    inptPetEspecie,
    inptPetNome,
    inptPetRaca,
    inptPetIdade,
    inptPetPorte,
    inptPetGenero,
    inptPetDescricao,
    inptPetImagemURL,
    aceitarTermos,
    setEtapa,
    enviarPet,
    erros,
    setModalOpen
}) {

    return (
        <div>
            <div className="modal_conteiner">
                <div className="conteiner_modal">
                    <div className="titulo-cad-pet">
                        <div className="titulo-barra-pet">
                            <h2>Criar anúncio para Pet</h2>
                            <img src="/images/barra_marrom.png" className='barra-pet' />
                        </div>
                        <button onClick={() => setModalOpen(false)} className='botao_modal'>{<IoMdClose className='closeIcon' />}</button>
                    </div>
                    <button onClick={() => { setEtapa(1) }}>Voltar</button>
                    <input type="radio" className='radio-pet-2' />
                    <p>Teste</p>
                    <input type="radio" className='radio-pet-2' />
                    <p>Teste</p>
                    <input type="radio" className='radio-pet-2' />
                    <p>Teste</p>
                    <input type="radio" className='radio-pet-2' />
                    <p>Teste</p>
                    <input type="radio" className='radio-pet-2' />
                    <p>Teste</p>
                </div>
            </div>
        </div>
    )
}

export default SegundaEtapaPet
