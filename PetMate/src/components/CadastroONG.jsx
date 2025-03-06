import React, { useState, useContext } from "react";
import "./cadastroONG.css"
import { Link, useNavigate } from "react-router-dom";

function CadastroONG() {
  return (
    <div className="conteiner-cad-ong">
      <div className="conteiner-info-ong">
      <div className="texto-cadastro-ong">
        <Link to="/Cadastro">
        <button className="botao-voltar-cad">X</button>
        </Link>
        <div className="texto-cadastro-ong-img">
          <h2>Cadastro ONG</h2>
          <img className="barra-cad-ong" src="/images/barra_marrom.png" alt="" />
        </div>

        <img src="" alt="" />
      </div>

      <div className="inputs-cad-ong">
        <form className="" action="">

          <div className="coluna-1-inputs">
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
          </div>

          <div className="coluna-2-inputs">
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
          </div>

          <div className="coluna-3-inputs">
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
            <label htmlFor="">
              <input type="text" />
            </label>
          </div>
        </form>
      </div>

      </div>


      <div className="img-lateral">
        <img src="" alt="" />
      </div>


    </div>
  )
}

export default CadastroONG
