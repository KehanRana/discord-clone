import React from 'react'
import './ChatHeader.css';
import NotificationsIcon from "@material-ui/icons/Notifications";
import EditLocationRoundedIcon from "@material-ui/icons/EditLocationRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import HelpRoundedIcon from "@material-ui/icons/HelpRounded";


function ChatHeader({ channelName, isUserListOpen, handleUsersToggle }) {
    

    //const handleLogin = (user) => {
        //setLoggedInUser(user);
    //}

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

    </div>
  )
}

export default ChatHeader;