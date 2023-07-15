import React, { useEffect, useRef, useState, useContext } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
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

function Message({
  id,
  timestamp,
  user,
  message,
  onDeleteMessage,
  activeContextMenuId,
  setActiveContextMenuId,
}) {
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
  };

  const handleDelete = () => {
    onDeleteMessage(id);
    db.collection("messages")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Message deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting message: ", error);
      });
  };

  return (
    <div className="message__container">
      <ContextMenuTrigger id={id} holdToDisplay={-1}>
        <div className="message" onContextMenu={handleContextMenu}>
          <Avatar src={user.photo} />

          <div className="message__info">
            <h4>
              {user.displayName}
              <span className="message__timestamp">{timeOptions}</span>
            </h4>

            <p>{message}</p>
          </div>
        </div>
      </ContextMenuTrigger>

        {user.uid === auth.currentUser.uid && (
          <ContextMenu id={id} className="message__contextMenu">
            <MenuItem onClick={handleDelete}>
              <div className="message__deleteContainer">
                <DeleteIcon className="message__deleteBtn" />
                <span>Delete</span>
              </div>
            </MenuItem>
          </ContextMenu>
        )}
      </div>
  );
}

export default Message;
