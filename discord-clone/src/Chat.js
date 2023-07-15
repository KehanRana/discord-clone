import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import ChatHeader from "./ChatHeader";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import GifIcon from "@material-ui/icons/Gif";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import Message from "./Message";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { selectChannelId, selectChannelName } from "./features/appSlice";
import db from "./firebase";
import firebase from "firebase/compat/app";
import EmojiPicker from "emoji-picker-react";
import Draggable from "react-draggable";

function Chat() {
  const user = useSelector(selectUser);

  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const [activeContextMenuId, setActiveContextMenuId] = useState(null);

  useEffect(() => {
    if (channelId) {
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }

      const unsubscribe = db
        .collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(newMessages);
          localStorage.setItem("chatMessages", JSON.stringify(newMessages));
        });

      return () => unsubscribe();
    }
  }, [channelId]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("channels").doc(channelId).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user,
    });

    setInput("");
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId)
    );

    db.collection("channels")
      .doc(channelId)
      .collection("messages")
      .doc(messageId)
      .delete()
      .then(() => {
        console.log("Message delete successfully frome Firebase.");
        const updatedMessages = messages.filter(
          (message) => message.id !== messageId
        );
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      })
      .catch((error) => {
        console.error("Error deleting from firebase:", error);
      });
  };

  const handleOutsideClick = (e) => {
    const inputDiv = document.querySelector(".chat__input form");
    const emojiIcon = document.querySelector(
      ".chat__inputIcons .chat__emojiBtn"
    );

    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(e.target) &&
      !inputDiv.contains(e.target) &&
      !emojiIcon.contains(e.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chat__messages">
        <div className="chat__messagesContainer">
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              timestamp={message.timestamp}
              message={message.message}
              user={message.user}
              onDeleteMessage={handleDeleteMessage}
              activeContextMenuId={activeContextMenuId}
              setActiveContextMenuId={setActiveContextMenuId}
            />
          ))}
        </div>

      </div>
      {showEmojiPicker && (
        <Draggable cancel=".chat__emojiBtn">
          <div className="emoji-picker-container pop-out" ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                const emoji = emojiData.emoji;
                setInput((prevInput) => prevInput + emoji);
              }}
            />
          </div>
        </Draggable>
      )}

      <div className="chat__input">
        <AddCircleIcon fontSize="large" />
        <form>
          <input
            value={input}
            disabled={!channelId}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${channelName}`}
          />
          <button
            disabled={!channelId}
            className="chat__inputButton"
            type="submit"
            onClick={sendMessage}
          >
            Send Message
          </button>
        </form>

        <div className="chat__inputIcons">
          <CardGiftcardIcon fontSize="large" />
          <GifIcon fontSize="large" />
          <EmojiEmotionsIcon
            className="chat__emojiBtn"
            fontSize="large"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
