import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <SigninContainer className="container">
      <div className="d-flex justify-content-center flex-wrap">
        <Link
          to="/addProduct"
          className="btn tabs"
          style={{ background: "var(--amzonChime)" }}
        >
          {" "}
          Add Product{" "}
        </Link>
        <Link
          to="/updateProduct"
          className="btn tabs"
          style={{ background: "var(--amzonChime)" }}
        >
          {" "}
          Update Product{" "}
        </Link>
        <Link to="/products" className="btn btn-dark tabs">
          {" "}
          Products{" "}
        </Link>
        <Link to="/allorders" className="btn btn-dark tabs">
          {" "}
          All Orders{" "}
        </Link>
        <Link to="/shipments" className="btn btn-dark tabs">
          {" "}
          Shipments{" "}
        </Link>
        <Link to="/transactionDetails" className="btn btn-dark tabs">
          {" "}
          Transactions{" "}
        </Link>
      </div>

      <div className="d-flex justify-content-center">
        <div className="btn btn-sized-md back-btn" onClick={() => navigate(-1)}>
          BACK
        </div>
      </div>
    </SigninContainer>
  );
}

const SigninContainer = styled.div`
  width: 30rem;
  background-color: white;
  border-radius: 1rem;
  font-style: italic;
  margin-top: 6rem;
  padding: 2rem;
  .btn {
    width: 10rem;
  }
  .form-group {
    text-align: center;
  }
  .login {
    font-family: "Brush Script MT", cursive;
    font-size: 2rem;
    color: var(--amzonChime);
    font-weight: bold;
    border-bottom: 3px solid var(--bsDark);
    margin: auto;
    margin-bottom: 2rem;
  }
  .label {
    color: var(--amxonChine);
    font-weight: bold;
  }
  .form-control {
    margin: auto;
    border: none;
    border-bottom: 1px solid;
    border-radius: 0;
    text-align: center;
    margin: auto;
  }
  .btn {
    color: white;
    margin: 1px;
  }
  .btn-signin {
    background: var(--amzonChime);
  }
  .btn-signout {
    background: var(--bsRed);
  }
  .back-btn {
    background: var(--bsYellow);
    color: black;
    text-align: center;
    margin-right: 2rem;
    margin-top: 2rem;
  }
  @media (max-width: 798px) {
    width: 20rem;
    .form-control {
      width: 15rem;
    }
    .tabs {
      font-size: 0.8rem;
    }
    .btn {
      font-size: 0.8rem;
    }
  }
`;
