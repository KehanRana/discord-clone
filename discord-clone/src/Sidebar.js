import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import SidebarChannel from "./SidebarChannel";
import SignalCellularAltIcon from "@material-ui/icons/SignalCellularAlt";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CallIcon from "@material-ui/icons/Call";
import {
  Avatar,
  Collapse,
  List,
} from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import HeadsetIcon from "@material-ui/icons/Headset";
import SettingsIcon from "@material-ui/icons/Settings";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import db, { auth } from "./firebase";
import Popup from "./Popup";

function Sidebar() {
  const user = useSelector(selectUser);
  const [channels, setChannels] = useState([]);

  const [isChannelsOpen, setIsChannelsOpen] = useState(true);

  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    db.collection("channels").onSnapshot((snapshot) =>
      setChannels(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          channel: doc.data(),
        }))
      )
    );
  }, []);

  const handleAddChannel = (channelName) => {
    if (channelName) {
      db.collection("channels").add({
        channelName: channelName,
      });
    }
  };

  const handleChannelsToggle = () => {
    setIsChannelsOpen(!isChannelsOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <h3>My Server</h3>
        <ExpandMoreIcon />
      </div>


        <div className="sidebar__channels">
          <div className="sidebar__channelsHeader">
            <div className="sidebar__header">
              <ExpandMoreIcon
                onClick={handleChannelsToggle}
                className={`sidebar__expandIcon ${
                  isChannelsOpen ? "open" : ""
                }`}
              />
              <h4 onClick={handleChannelsToggle}
                className={`sidebar__expandIcon ${
                  isChannelsOpen ? "open" : ""
                }`}>Text Channels</h4>
            </div>

            <AddIcon
              onClick={handleOpenPopup}
              className="sidebar__addChannel"
            /> {showPopup && (
              <Popup onClose={handleClosePopup} onSubmit={handleAddChannel} promptText="Enter a channel name" />
            )}
          </div>

          <Collapse in={isChannelsOpen}>
                <List component='div' className="sidebar_channelsList">
                    {channels.map(({ id, channel }) => (
                    <SidebarChannel
                        key={id}
                        id={id}
                        channelName={channel.channelName}
                    />
                    ))}
                </List>
            </Collapse>
        </div>

      <div className="sidebar__voice">
        <SignalCellularAltIcon
          className="sidebar__voiceIcon"
          fontSize="large"
        />
        <div className="sidebar__voiceInfo">
          <h3>Voice Connected</h3>
          <p>Stream</p>
        </div>
        <div sidebar__voiceIcons>
          <InfoOutlinedIcon />
          <CallIcon />
        </div>
      </div>

      <div className="sidebar__profile">
        <Avatar
          className="sidebar__avatarPhoto"
          onClick={() => auth.signOut()}
          src={user.photo}
        />
        <div className="sidebar__profileInfo">
          <h3>{user.displayName}</h3>
          <p>#{user.uid.substring(0, 5)}</p>
        </div>
        <div className="sidebar__profileIcons">
          <MicIcon />
          <HeadsetIcon />
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
