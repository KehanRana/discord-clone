import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import ChatHeader from "./ChatHeader";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GifIcon from "@material-ui/icons/Gif";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./features/userSlice";
import {
  selectChannelId,
  selectChannelName,
  setChannelInfo,
} from "./features/appSlice";
import db from "./firebase";
import firebase from "firebase/compat/app";
import EmojiPicker from "emoji-picker-react";
import Draggable from "react-draggable";
import BeachAccess from "@material-ui/icons/BeachAccess";
import ChatSidebar from "./ChatSidebar";


function Chat() {
  const [backgroundImages, setBackgroundImages] = useState([
    "url('https://seeklogo.com/images/D/discord-black-logo-733DD6B9B0-seeklogo.com.png')",
    "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0NDQ0NCAgICA0HBwcHCA8ICQcNFREWFhURExMYHSggGBolGxUTITEhMSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDysZFRkrKzctLSsrKy03LTcrNzctLSsrKy0tLSsrLSsrLSsrKy0tLSsrKysrKysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAaAAEBAQADAQAAAAAAAAAAAAABAAIDBQYE/8QAFxABAQEBAAAAAAAAAAAAAAAAAAEREv/EABoBAQEBAQEBAQAAAAAAAAAAAAEAAgMEBQb/xAAYEQEBAQEBAAAAAAAAAAAAAAAAEQESAv/aAAwDAQACEQMRAD8A8Egn3H50oIaUkGUqlQzpVCAIrNNZrLWKs01mhrBWaazQ3jNZrVZqbxis1qs1NYKzTWU3irJoqaxkGihoUGhHAkhrpiSUDZSQKSST0YGp7nwitCGohaNZRC0VnSqFoBirNVotGtYKzTWay1grNNZobwVmms1NYKxWqym8DNarKawVmmiprBQayGhUqE1iQIaxAoOiLKSKCBei1M6de58OHVrOrRphTK1lQjRo1kw2i0aAYbWbUyGsw6zaqzRGsxVmms2hrBazVaA3grNNrKaxVk1mprFRSyGsFBCIoNCaCSDWJJBrNSSTRAST0C1la9r48OrWdWs6o1o1nVoMOgaLWVCtZ1aGorQNWgxWs2q1kNZirNptZoazBRVazaGsVZprKaxUKhNKs00VNYAQiKDRQUkKCiEmkUg2EsSTu9Ws6teqvlRrRrOrUo1o0aNZMa0aNGhQ2jVo0GLRaNGpqG0Wi0WimK1m06zQ1mK1mq0UNYqEKmkEKiqzVUimTQigaAQqQCkkikkG8IVSLttWs6teivmxrVrOjVVGtWs6tCjWi1nVoph0aNGimHVrOq0GLRoGom0UWihpUIIoFlNKiqhFBJFAgFUJIhUgJFJNQFINhEJOx1dMatdq8Eb1axq0VRvRrOrVVGtGjQKY1oFAMatAWpRWhaKjENQRVQSIBCaVBGIhHFgMZRxYjAGsAMCOLE1mBHCGoMWFIxAoKPp1azq10rxRrVrK0VRrVrKSjWrWdWpRrRrOpGG1aAUQkDEklWswLDhxVrPDGHGsWCt54ZwY3iwVvPLGLG8WKnljBjkwYqeWMGOTBgq5YxN4KjyzhwpGDFiQUSSJjegatLwwrWdKqOrQko0tZJR1BJQpYkcxFYYq3nlYiRXTPLOHGkK3nlnDhxYq3nkJrFgrWeWMWN4sVPLGDG8WCnlx4sbsGKjljFjeDFVyxixsKrlnFjWLCoziawCqOPUyTXgh1aNWqqEs6TUdWjSVCYCqcwmAwV0zyTERW8xYjDgrpmCQkxVvPIw4TjNdM8s4saxKtZ5ZxY3gwVrlnBjeDEuWLBjeBURkY3gsNEYxY1YMQjOJqhCBFJR8ySL5qSSRQJRMZhRzGoRCq3mGNRmNRV0zDIQYG8wtQQh0zDCo1A6ZgxpQwOmYsWFYm88jFThwNcsixqwWEcs4zY2kNxx2BuwUs7jCITMGLCkIziKSj40k0+WUkgkkUYYkm8LRQbwxqBBvC1Ek3jUMSDrjUMSTpjUJQdcUhxIN4cWBBpWCpFaLGakmQLEizorNKLGspJMpJJP/2Q==')",
    "url('https://static.vecteezy.com/system/resources/previews/003/559/330/original/abstract-background-with-gradient-blue-bubble-free-vector.jpg')",
  ]);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const [activeContextMenuId, setActiveContextMenuId] = useState(null);

  const messagesEndRef = useRef(null);

  const [selectedBackground, setSelectedBackground] = useState(
    localStorage.getItem("selectedBackground") || backgroundImages[0]
  );
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);

  const [customBackground] = useState(localStorage.getItem("customBackground") || "");

  const [isUserListOpen, setIsUserListOpen] = useState(false);

  useEffect(() => {
    if (selectedBackground) {
      document.body.style.backgroundImage = selectedBackground;
    }
  }, [selectedBackground]);

  useEffect(() => {
    localStorage.setItem("selectedBackground", selectedBackground);
  }, [selectedBackground]);

  useEffect(() => {
    const userId = user?.uid; // Assuming the user has a unique ID, replace "uid" with the actual ID property of your user object.
    const customBackgrounds = JSON.parse(localStorage.getItem(`userBackgrounds-${userId}`)) || [];
    // If the user has custom backgrounds, you can set them in the state here.
  }, [user]);


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

  useEffect(() => {
    // Store the most recent channel information in localStorage
    if (channelId && channelName) {
      localStorage.setItem(
        "recentChannel",
        JSON.stringify({ channelId, channelName })
      );
    }
  }, [channelId, channelName]);

  useEffect(() => {
    // Retrieve the most recent channel information from localStorage
    const recentChannel = localStorage.getItem("recentChannel");
    if (recentChannel) {
      const { channelId, channelName } = JSON.parse(recentChannel);
      dispatch(setChannelInfo({ channelId, channelName }));
    }
  }, [dispatch]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handleBackgroundSelect = (image) => {
    if (image === "custom") {
      const url = prompt("Enter the URL of the custom background image:");
      if (url) {
        const userId = user?.uid;
        const customBackgrounds = JSON.parse(localStorage.getItem(`userBackgrounds-${userId}`)) || [];
        
        if (customBackgrounds.indexOf(url) === -1) {
          customBackgrounds.push(url);
          localStorage.setItem(`userBackgrounds-${userId}`, JSON.stringify(customBackgrounds));
          setBackgroundImages((prevImages) => [...prevImages, `url('${url}')`]);
        } else {
          alert("The image already exists in the options.")
        }
        setSelectedBackground(`url('${url}')`);
      } else {
        alert("Invalid URL or the image already exists in the options.");
      }
    } else {
      setSelectedBackground(image);
    }
    setShowBackgroundOptions(false);
  };

  const chatBackgroundStyle = {
    backgroundImage: customBackground ? `url(${customBackground})` : selectedBackground,
    opacity: 1,
  };

  const handleUsersToggle = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  return (
    <div className="chat" style={chatBackgroundStyle}>
      <ChatHeader channelName={channelName} isUserListOpen={isUserListOpen} handleUsersToggle={handleUsersToggle}/>
      <ChatSidebar isOpen={isUserListOpen} isUserListOpen={isUserListOpen}/>

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
          <div ref={messagesEndRef} />
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
          <BeachAccess
            fontSize="large"
            className="chat__backgroundToggle"
            onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
          />

          <GifIcon fontSize="large" />
          <EmojiEmotionsIcon
            className="chat__emojiBtn"
            fontSize="large"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>
      </div>
      {showBackgroundOptions && (
        <div className="chat__backgroundOptions">
          <h1 className="chat__themeTitle">Select Theme</h1>
          <div className="chat__backgroundOptionsGrid">
            {Array.from(new Set(backgroundImages)).slice(0, 12).map((image, index) => (
              <div key={index}
                className="chat__backgroundOption"
                style={{ backgroundImage: image }}
                onClick={() => handleBackgroundSelect(image)}>
              </div>
            ))}
            <div className="chat__backgroundOption"
            style={{ backgroundImage: "url('https://via.placeholder.com/50')" }}
            onClick={() => handleBackgroundSelect("custom")}>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
