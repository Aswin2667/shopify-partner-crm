"use client";

import LeadFilter from "./LeadFilter";
import MainMenuFilter from "./MainMenuFilter";
import ContactFilter from "./ContactFilter";
import { useState } from "react";

export default function FilterChoose() {
  const [showLeadFilter, setShowLeadFilter] = useState(false);
  const [showContactFilter, setShowContactFilter] = useState(false);
  
  const handleLeadClick = () => {
    setShowLeadFilter(true);
  };

  const handleBackClick = () => {
    setShowLeadFilter(false);
  };

  const handleContactClick = () => {
    setShowContactFilter(true);
  };

  const handleContactBackClick = () => {
    setShowContactFilter(false);
  };

  return (
    <>
      {showLeadFilter ? (
        <LeadFilter onBackClick={handleBackClick} />
      ) : showContactFilter ? (
        <ContactFilter onBackClick={handleContactBackClick} />
      ) : (
        <MainMenuFilter
          onLeadClick={handleLeadClick}
          onContactClick={handleContactClick}
        />
      )}
    </>
  );
}