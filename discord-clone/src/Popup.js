import React, { useState } from "react";
import "./Popup.css";

function Popup({ onClose, onSubmit, promptText }) {
  const [channelName, setChannelName] = useState("");

  const handleInputChange = (event) => {
    setChannelName(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(channelName);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup__content">
        <div className="popup__header">
          <h3>New channel</h3>
        </div>
        <div className="popup__body">
          <p>{promptText}</p>
          <input
            className="popup__input"
            type="text"
            value={channelName}
            onChange={handleInputChange}
          />
          <button className="popup__close" onClick={onClose}>
            &times;
          </button>
          <button className="add__button" onClick={handleSubmit}>
            Add
          </button>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default Popup;
