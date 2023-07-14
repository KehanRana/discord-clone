import React, { useState } from 'react'
import './ChatHeader.css';
import NotificationsIcon from "@material-ui/icons/Notifications";
import EditLocationRoundedIcon from "@material-ui/icons/EditLocationRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import HelpRoundedIcon from "@material-ui/icons/HelpRounded";
import UserList from './UserList';
import { useSelector } from "react-redux";
import {
    Collapse,
    List,
  } from "@material-ui/core";
import { selectUser } from "./features/userSlice";
import Login from './Login';

function ChatHeader({ channelName }) {
    const user = useSelector(selectUser);

    const [isUserListOpen, setIsUserListOpen] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(user);

    const handleUsersToggle = () => {
        setIsUserListOpen(!isUserListOpen);
      };

    const handleLogin = (user) => {
        setLoggedInUser(user);
    }

  return (
    <div className='chatHeader'>
        <div className='chatHeader__left'>
            <h3>
                <span className='chatHeader__hash'>#</span>
                {channelName}
            </h3>
        </div>

        <div className='chatHeader__right'>
            <NotificationsIcon />
            <EditLocationRoundedIcon />
            <PeopleAltRoundedIcon onClick={handleUsersToggle}
                className={`chatHeader__peopleIcon ${
                  isUserListOpen ? "open" : ""
                }`}/>

            <div className='chatHeader__search'>
                <input placeholder='Search'></input>
                <SearchRoundedIcon />
            </div>

            <SendRoundedIcon />
            <HelpRoundedIcon />
        </div>
        <Collapse in={isUserListOpen}>
                <List component='div' className="chatHeader_usersList">
                    {user ? (
                    <UserList users={[loggedInUser]}
                    />
                    ): (
                        <Login onLogin={handleLogin} />
                    )}
                </List>
            </Collapse>
    </div>
  )
}

export default ChatHeader;