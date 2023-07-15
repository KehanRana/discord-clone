import React, { useEffect, useRef } from "react";
import "./Message.css";
import { Avatar } from "@material-ui/core";
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

function Message({ id, timestamp, user, message, onDeleteMessage, activeContextMenuId, setActiveContextMenuId }) {
  const contextMenuRef = useRef(null);

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

  const handleContextMenu = (e) => {
    e.preventDefault();
    setActiveContextMenuId(id);
  }

  const handleDelete = () => {
    onDeleteMessage(id);
    db.collection("messages")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Nessage Succesf");
      })
      .catch((error) => {
        console.error("eerrror dele", error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setActiveContextMenuId(null);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuRef, setActiveContextMenuId]);

  return (
    <div className="message" onContextMenu={handleContextMenu}>
      <Avatar src={user.photo} />

      <div className="message__info">
        <h4>
          {user.displayName}
          <span className="message__timestamp">{timeOptions}</span>
        </h4>

        <p>{message}</p>
      </div>

      {activeContextMenuId === id && (
        <div className="message__contextMenu" ref={contextMenuRef}>
          {user.uid === auth.currentUser.uid && (
            <span className="message__contextMenuItem" onClick={handleDelete}>
              <DeleteIcon className="message__deleteBtn"/>Delete
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Message;
