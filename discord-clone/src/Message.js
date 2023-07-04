import React from 'react'
import './Message.css';
import { Avatar } from "@material-ui/core";

function Message() {
  return (
    <div className='message'>
        <Avatar />

        <div className='message__info'>
            <h4>some username 
                <span className='message__timestamp'>Timestamp</span>
            </h4>
            <p>Message</p>
            
        </div>
    </div>
    
  )
}

export default Message