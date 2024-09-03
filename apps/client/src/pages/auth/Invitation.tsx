import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Invitation.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Invitation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");
const navigate = useNavigate()
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (!session) {
      navigate("/login");
    }
    if (token) {
      axios
        .get(`http://localhost:8080/invitation/verify?token=${token}`)
        .then((response) => {
          setTokenDetails(response.data.data);
        })
        .catch((error) => {
          setError("Token expired or not found");
        });
    } else {
      setError("Invalid invitation link");
    }
  }, [token]);

  const handleEnvelopeClick = () => {
    setIsOpen(true);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAccept = async() => {
    try {
        const response = await axios.get(`http://localhost:8080/invitation/accept?token=${token}`);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
    console.log("Accepted");
  };

  const handleDecline = () => {
    // Handle decline logic here
    console.log("Declined");
  };

  return (
    <div>
      <div className="frame" onClick={handleEnvelopeClick}>
        <Button id="button_open_envelope" style={{ textAlign: "center" }}>
          Open
        </Button>
        <div
          className={`message ${isOpen ? "pull" : ""}`}
          style={{ textAlign: "center" }}
        >
          <div className="flex flex-col justify-center">
            <br />
            <br />
            <h1>Invitation for organization</h1>
            <h2>You're invited to org by {tokenDetails?.inviter.name} </h2>
            <div className="flex justify-center items-center gap-3">
            <img
              src={tokenDetails?.organization.logo}
              className="rounded-full h-12 w-12"
              alt=""
            />
            <h2>{tokenDetails?.organization.name}</h2>
            </div>
            <br />
            <div className="flex w-full justify-center gap-3">
              <Button onClick={handleDecline}>Decline</Button>
              <Button onClick={handleAccept}>Accept</Button>
            </div>
          </div>
        </div>
        <div className="bottom"></div>
        <div className="left"></div>
        <div className="right"></div>
        <div className={`top ${isOpen ? "open" : ""}`}></div>
      </div>
      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        onClick={handleModalClose}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={handleModalClose}>
            &times;
          </span>
          {error ? <p>{error}</p> : <></>}
          <div>
            <p>Invitation Details: {tokenDetails?.invitationMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitation;
