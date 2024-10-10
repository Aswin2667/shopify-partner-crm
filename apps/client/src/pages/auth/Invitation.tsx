import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Invitation = () => {
  const [isOpen, setIsOpen] = useState(false);
   const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) {
      navigate("/login");
    }
    if (token) {
      axios
        .get(`https://shopcrm-server-5e5331b6be39.herokuapp.com/invitation/verify?token=${token}`)
        .then((response) => {
          setTokenDetails(response.data.data);
          console.log(response);
        })
        .catch((error) => {
          setError("Token expired or not found");
          console.log(error.message || "Token expired or not found");
        });
    } else {
      setError("Invalid invitation link");
    }
  }, [token]);

  const handleEnvelopeClick = () => {
    setIsOpen(true);
  };


  const handleAccept = async () => {
    try {
      const response = await axios.get(
        `https://shopcrm-server-5e5331b6be39.herokuapp.com/invitation/accept?token=${token}`
      );
      console.log(response.data);
      alert("Accepted");
    } catch (error) {
      console.log(error);
    }
    console.log("Accepted");
  };

  return (
    <>
      {error ? (
        <>{error}</>
      ) : (
        <div>
          <div className="frame" onClick={handleEnvelopeClick}>
            <div
              className={`message ${isOpen ? "pull" : ""}`}
              style={{ textAlign: "center" }}
            >
              <div className="flex flex-col justify-center">
                <br />
                <br />
                <h1>Invitation for Organization</h1>
                <h2>You're invited to org by {tokenDetails?.inviter.name}</h2>
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={tokenDetails?.organization.logo}
                    className="rounded-full h-12 w-12"
                    alt="Organization Logo"
                  />
                  <h2>{tokenDetails?.organization.name}</h2>
                </div>
                <br />
                <div className="flex w-full justify-center gap-3">
                  <Button onClick={handleAccept}>Accept</Button>
                </div>
              </div>
            </div>
            <div>
              <p>{tokenDetails?.invitationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invitation;