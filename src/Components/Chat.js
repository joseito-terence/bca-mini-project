import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Stylesheets/Chat.css";
import db from "../firebase";
import firebase from "firebase";
import Message from './Message';

function Chat({ noneSelected }) {
  const [input, setInput] = useState("");         // input: will store the message inputed.
  const { roomId } = useParams();                 // useParams: gets the roomId parameter from the url.
  const [roomName, setRoomName] = useState("");   // roomName: stores the name of the room
  const [messages, setMessages] = useState([]);   // messages: used to store all the messages in the room for display.
  const user = firebase.auth().currentUser;       // current user object from firebase auth.

  useEffect(() => {                               // this will run when the user opens a chat room 
    if (roomId) {
      db.collection("rooms")                      // query 1: to get the name of the room.
        .doc(roomId)                              // for a given roomId  (SQL equivalent: "SELECT name FROM rooms WHERE roomId='roomId' ")
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);      // the obtained name is stored into roomName variable.
        });

      db.collection("rooms")                      // query 2: to get all the messages from the messages
        .doc(roomId)                              // for a given roomId  (SQL equivalent: "SELECT * FROM messages WHERE roomId='roomId' ORDER BY timestamp ASC ")
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));   // the messages are stored into messages variable.
        });
    }

  }, [roomId]);

  
  function scrollIntoView(selector) { // this function uses the DOM method scrollIntoView to bring an html element into view.
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {                                   // this will run when the user opens a chat room 
    if(!noneSelected) scrollIntoView('.chatBottom');  // and scroll to the last message
  });

  function sendMessage(event) {                                                // Function to send message.
    event.preventDefault();                                                    // preventDefault method is to avoid page reload.

    if (input !== "") {                                                        // If input is not null or ''
      db.collection("rooms").doc(roomId).collection("messages")   
        .add({                                                                 // then add message to database.
          message: input,
          name: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {                                                          // If message added successfully 
          scrollIntoView('.chatBottom');                                       // Scroll to the last message
        });
    }

    setInput(""); // reset the message input field.
  };

  const randomNum = () => Math.floor(Math.random() * 255); // this function will return a random for 0 - 255
  

  function deleteRoom() {                                                       // Function to delete room.
    if (window.confirm("Are you sure that you want to delete this room?")) {    // get confirmation.
      db.collection("rooms").doc(roomId).delete()                               // delete the Room
        .then(() => {                                                           // if (delete successful)
          window.location.href = "/";                                           // go to home location [coz the group won't exist and it will throw an error]
        })
        .catch(() => {                                                          // else display error in console.
          console.error('Unable to delete room.');
        })
    }
  };

  function goBack(){                                                            // the is a goback button, only displayed on smaller devices.
    scrollIntoView('.sidebar__header');                                         // it brings the header into view. 
  }  

  return !noneSelected ? (
    <div className="chat">
      <div className="chat__header">
        <div className="IconButton chat__backBtn" onClick={goBack}>
          <i className="fas fa-arrow-left"></i>
        </div>
        <div
          className="sidebarRoom__avatar"
          style={{ backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})` }}
        >
          {roomName[0]}
        </div>
        <h3 className="chat__headerName">{roomName}</h3>
        <div className="IconButton" onClick={deleteRoom}>
          <i className="fas fa-trash"></i>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => ( 
          <Message 
            roomId={roomId}
            messageId={message.id}
            name={message.name}
            message={message.message}
            timestamp={message.timestamp}
            person={(message.name === user.displayName) && "sender"}
          />
        ))}


        <span className="chatBottom"></span>
      </div>
        
      <div className="chat__footer">
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="chat">
      <div className="noneSelected">
        <h3>Select a Room to start Messaging</h3>
      </div>
    </div>
  );
}

export default Chat;
