import React from 'react';
import "../Stylesheets/Message.css";
import db from "../firebase";

function Message({roomId, messageId, name, message, timestamp, person}) {

    function deleteMessage() {                             // Function to delete a message.
        if (window.confirm("Delete this message?")) {      // get confirmation.
            db.collection('rooms').doc(roomId)
              .collection('messages').doc(messageId)
              .delete();                                    // delete the message
          }
    }

    return (
        <div className={`message message__${person}`}>
            <span className="message__name">{name}</span>
            {message}
            <span className="message__timestamp">
              {timestamp?.toDate().toString().slice(0, 21)}
            </span>

            <button className="message__deleteBtn" onClick={deleteMessage}>
                <i className="fas fa-trash"></i>
            </button>
        </div>
    )
}

export default Message;
