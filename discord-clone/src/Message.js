import React, { useState } from "react";
import "./Message.css";
import { Avatar, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import db, { auth } from "./firebase";

function isYesterday(date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

function isOlderThanYesterday(date) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);

  return date < yesterday;
}


function Message({ id, timestamp, user, message, onDeleteMessage }) {
  const [isHovered, setIsHovered] = useState(false);

  let timeOptions = "";

  if (timestamp && timestamp.toDate instanceof Function) {
    const timestampDate = timestamp.toDate();
    if (isOlderThanYesterday(timestampDate)) {
      timeOptions = timestampDate.toLocaleString();
    } else if (isYesterday(timestampDate)) {
      timeOptions = "Yesterday";
    } else {
      timeOptions = timestampDate.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDelete = () => {
    onDeleteMessage(id);
    db.collection("messages")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Nessage Succesf");
      })
      .catch((error) => {
        console.error("eerrror dele", error)
      })
  };

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
          <span className="message__timestamp">{timeOptions}</span>
        </h4>

        <p>{message}</p>

        {isHovered && (
          <div className="message__actions">
            <Button
              variant="outlined"
              className="edit__button"
              color="primary"
              size="small"
            >
              Edit
            </Button>
            {user.uid === auth.currentUser.uid && (
              <Button
                variant="outlined"
                className="delete__button"
                startIcon={<DeleteIcon />}
                color="secondary"
                size="small"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
