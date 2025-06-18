import React, { useEffect, useState, useContext } from 'react';
import { OngContext } from '../contexts/OngContext';
import { getOngs, deleteOng, updateOng } from '../apiService';
import './OngsAdm.css';
import JanelaOng from './JanelaOng';
import { IoTrash, IoTrashOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';
import ModalExcluirOng from './ModalExcluirOng';
import ModalEditarOng from './ModalEditarOng';
import { GlobalContext } from '../contexts/GlobalContext';

function OngsAdm({idOng}) {
  const [ongs, setOngs] = useState([]);
  const { ong, setOng } = useContext(OngContext);
  const [openModalOng, setOpenModalOng] = useState(false);
  const [ongToDelete, setOngToDelete] = useState(null);
  const [ongToEdit, setOngToEdit] = useState(null);
  const [openModalExcluirOng, setOpenModalExcluirOng] = useState(false);
  const [openModalEditarOng, setOpenModalEditarOng] = useState(false);
  const { isAdmin } = useContext(GlobalContext);

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const data = await getOngs();
        setOngs(data);
      } catch (error) {
        console.error("Erro ao buscar ONGs:", error);
      }
    };

    fetchOngs();
  }, []);

  const handleDeleteOng = async () => {
    try {
      await deleteOng(ongToDelete.id_ong);
      setOngs(ongs.filter((o) => o.id_ong !== ongToDelete.id_ong));
      setOpenModalExcluirOng(false);
      Swal.fire({
        position: "mid",
        icon: "success",
        title: "ONG apagada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao apagar ONG:", error);
      Swal.fire({
        position: "mid",
        icon: "error",
        title: "Erro ao apagar ONG!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleEditOng = async (updatedOng) => {
    try {
      await updateOng(updatedOng.id_ong, updatedOng);
      setOngs(ongs.map((o) => (o.id_ong === updatedOng.id_ong ? updatedOng : o)));
      setOpenModalEditarOng(false);
      Swal.fire({
        position: "mid",
        icon: "success",
        title: "ONG editada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Erro ao editar ONG:", error);
      Swal.fire({
        position: "mid",
        icon: "error",
        title: "Erro ao editar ONG!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const ongsFiltradas = idOng ? ongs.filter((o) => o.id_ong === idOng) : ongs;

  return (
    <div>
      <JanelaOng isOpen={openModalOng} setOpenModalOng={setOpenModalOng} />
      <div className="cardOng-container">
        {ongsFiltradas.map((o) => (
          <div key={o.id_ong} className="ong-card">
            <img
              src={o.foto_perfil || '/images/default_ong_image.jpg'}
              alt={`Imagem da ONG ${o.nome_ong}`}
              className="ong-image-gerenciamento"
            />
            <div className="ong-info-card">
              <h3>{o.nome_ong}</h3>
              <h4>{o.cidade_ong}</h4>
            </div>
            <div className="botoes-card">
              <button
                className="botao-info-ong"
                onClick={() => {
                  setOng(o);
                  setOpenModalOng(true);
                }}
              >
                Mais Informações
              </button>
                { isAdmin &&

              <FaEdit
              className="botao-editar-ong"
              onClick={() => {
                setOngToEdit(o);
                setOpenModalEditarOng(true);
              }}
              title="Editar ONG"
              />
            }
            { isAdmin &&
              <IoTrash
              className="botao-excluir-ong"
              onClick={() => {
                setOngToDelete(o);
                setOpenModalExcluirOng(true);
              }}
              title="Apagar ONG"
              />
            }
            </div>
          </div>
        ))}
      </div>
      <ModalExcluirOng
        isExcluirOng={openModalExcluirOng}
        setOngDeleteOpen={setOpenModalExcluirOng}
        onDeleteOng={handleDeleteOng}
      />
      <ModalEditarOng
        isEditarOng={openModalEditarOng}
        setOngEditOpen={setOpenModalEditarOng}
        onEditOng={handleEditOng}
        ongToEdit={ongToEdit}
      />
    </div>
  );
}

export default OngsAdm;