import React, { useState } from "react";
import "./ChatSidebar.css";
import { List } from "@material-ui/core";
import UserList from "./UserList";
import Login from "./Login";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUser } from "./features/userSlice";

function ChatSidebar({ isOpen, isUserListOpen }) {
  const user = useSelector(selectUser);
  const [loggedInUser /*,setLoggedInUser*/] = useState(user);

  return (
    <div className={`chatSidebar ${isOpen ? "open" : ""}`}>
      <List component="div" className="chatHeader_usersList">
        {user ? <UserList users={[loggedInUser]} /> : <Login />}
      </List>
    </div>
  );
}

export default ChatSidebar;
