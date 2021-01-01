import React, { useState, useEffect } from "react";
import "../Stylesheets/SidebarRoom.css";
import db from "../firebase";
import firebase from "firebase";
import { NavLink } from "react-router-dom";

function SidebarRoom({ id, name, addNewRoom }) {  
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (id) {
      unsubscribe = db.collection("rooms")                           // Query to get last message of a room
        .doc(id)                                                     // (SQL equivalent: "SELECT * FROM messages   
        .collection("messages")                                      //                   WHERE roomId='roomId'
        .orderBy("timestamp", "desc")                                //                   ORDER BY timestamp DESC
        .limit(1)                                                    //                   LIMIT 1 " )
        .onSnapshot((snapshot) => {
          setLastMessage(snapshot.docs.map((doc) => doc.data())[0]?.message);
        });   
    }

    return () => {
      if(id){
        unsubscribe();
      }
    }
  }, [id]);

  function createChat() {                                            // function to create a new room
    const roomName = prompt("Please enter name for the room");       // get name for the function

    if (roomName) {                                                  // if not null
      db.collection("rooms")                                         // add to database
        .add({ 
          name: roomName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }else{
      alert("Room Name can't be empty.");
    }
  };

  const randomNum = () => Math.floor(Math.random() * 255); // this function will return a random for 0 - 255

  return !addNewRoom ? (
    <NavLink to={`/rooms/${id}`} activeClassName="sidebarRoom-active" className="sidebarRoom" id={name}>
        <div className="sidebarRoom__avatar" style={{backgroundColor: `rgb(${randomNum()},${randomNum()},${randomNum()})`}}>
          {name[0]}
        </div>
        <div className="sidebarRoom__info">
          <h2>{name}</h2>
          <p>{(lastMessage?.length > 20) ? `${lastMessage.slice(0, 20)}...` :  lastMessage}</p>
        </div>
    </NavLink>
  ) : (
    <div className="sidebarRoom" onClick={createChat}>
      <h3><i className="fas fa-plus"></i> New Room</h3>
    </div>
  );
}

export default SidebarRoom;
