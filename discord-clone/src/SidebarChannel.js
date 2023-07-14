import React from "react";
import "./SidebarChannel.css";
import { useDispatch, useSelector } from "react-redux";
import { selectChannelId, setChannelInfo } from "./features/appSlice";

function SidebarChannel({ id, channelName }) {
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(selectChannelId);

  const handleClick = () => {
    dispatch(
      setChannelInfo({
        channelId: id,
        channelName: channelName,
      })
    );
  };

  const isActive = selectedChannelId === id;

  return (
    <div
      className={`sidebarChannel ${isActive ? "active" : ""}`}
      onClick={handleClick}
    
      
    >
      <h4>
        <span className="sidebarChannel__hash">#</span>
        {channelName}
      </h4>
    </div>
  );
}

export default SidebarChannel;
