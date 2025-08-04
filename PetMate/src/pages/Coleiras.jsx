import './Coleiras.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Coleiras() {
    return (
        <div>
            <Navbar />
            <div className="container-pg-coleiras">
                <div className="banner-coleiras">
                    <img src="/images/banner_processos.svg"
                        className='banner-coleiras' />
                </div>
                <div className="titulo-coleiras">
                    <h2>Coleiras para pets</h2>
                    <p>Encontre ou personalize uma coleira para seu companheiro!</p>
                </div>

                <div className="carrossel-coleiras">

                </div>

                <div className="personalizar-coleira">
                    <div className="titulo-personalizar-coleira">
                        <h2>Personalize a coleira do seu pet</h2>
                        <p>Escolha entre uma variedade de estilos, cores e tamanhos para criar uma coleira única que combine com a personalidade do seu pet.</p>
                    </div>

                    <div className="card-personalizar-coleira">
                        <div className="imagem-personalizar-coleira">
                            <img src="/images/gatoleira.jfif" alt="" />
                        </div>
                        <div className="botao-personalizar-coleira">
                            <button className="botao-personalizar">
                                Personalizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Coleiras
