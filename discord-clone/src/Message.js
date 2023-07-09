import React, { useState } from "react";
import "./Message.css";
import { Avatar, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";


function isYesterday(date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  return date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
}

function isOlderThanYesterday(date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  return date < yesterday;
}

function Message({ timestamp, user, message }) {

  const [isHovered, setIsHovered] = useState(false);

  let timeOptions = '';

  if (timestamp) {
    if (isOlderThanYesterday(timestamp.toDate())) {
      timeOptions = new Date(timestamp.toDate()).toLocaleString();
    } else if (isYesterday(timestamp.toDate())) {
      timeOptions = 'Yesterday';
    } else {
      timeOptions = new Date(timestamp.toDate()).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div 
      className="message"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar src={user.photo} />

      <div className="message__info">
        <h4>
          {user.displayName}
          <span className="message__timestamp">
            {timeOptions}
          </span>
        </h4>

        <p>{message}</p>

        {isHovered && (
          <div className="message__actions">
            <Button variant="outlined" className="edit__button" color="primary" size="small">Edit</Button>
            <Button variant="outlined" className="delete__button" startIcon={<DeleteIcon />} color="secondary" size="small">Delete</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
