import { useContext } from 'react';
import './FiltroDenuncias.css'
import { GlobalContext } from '../contexts/GlobalContext';

function FiltroDenuncias() {
    const { filtrosDenuncias, setFiltrosDenuncias } = useContext(GlobalContext);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltrosDenuncias((prevFiltros) => ({
            ...prevFiltros,
            [name]: value,
        }));
    };

    const limparFiltros = () => {
        setFiltrosDenuncias({
            status: '',
            tabela: '',
        });
    };
    return (
        <div>
            <div className="container-filtro-denuncias">
                <div className="container-select-denuncia">
                    <label htmlFor="select-status" className='label-select-denuncia'>Status</label>
                    <select
                        name="status"
                        id="select-status"
                        className='select-denuncia'
                        value={filtrosDenuncias.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todos</option>
                        <option value="pendente">Pendente</option>
                        <option value="em análise">Em análise</option>
                        <option value="resolvido">Resolvido</option>
                    </select>
                </div>
                <div className="container-select-denuncia">
                    <label htmlFor="select-tabela" className='label-select-denuncia'>Tabela</label>
                    <select
                        name="tabela"
                        id="select-tabela"
                        className='select-denuncia'
                        value={filtrosDenuncias.tabela}
                        onChange={handleFilterChange}
                    >
                        <option value="">Todas</option>
                        <option value="pets">Pets</option>
                        <option value="ongs">ONGs</option>
                        <option value="comentarios">Feedbacks</option>
                    </select>
                </div>
                <button className='limpar-filtros-denuncia' onClick={limparFiltros}>Limpar Filtros</button>
            </div>
        </div>
    )
}

export default FiltroDenuncias
