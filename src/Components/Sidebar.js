import React, { useState, useEffect } from "react";
import "../Stylesheets/Sidebar.css";
import db from "../firebase";
import SidebarRoom from "./SidebarRoom";
import { auth } from "../firebase";

function Sidebar({user}) {
  const [rooms, setRooms] = useState([]);                          // rooms: a variable to store all the rooms.

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")                                         // Query to get all the rooms ordered by created time
      .orderBy('timestamp', 'desc')                                // (SQL equivalent: "SELECT * FROM rooms ORDERY BY timestamp DESC")
      .onSnapshot((snapshot) => {
        setRooms(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

    return () => {
      unsubscribe();
    }
  }, []);

  
  function filterRooms(event) {                                    // Function: Search Filter for Rooms
    const key = event.target.value.toLowerCase();                  // get search key from field.
    const rooms = document.querySelectorAll('.sidebarRoom');       // get all elements

    for(let i = 1; i < rooms.length; i++){
      const id = rooms[i].id.toLowerCase();
      rooms[i].style.display = id.includes(key) ? 'flex' : 'none'; // display those that match and hide the rest.
    }
  }

  const signOut = () => {                                          // Sign out function.
    if (window.confirm("Do you want to Sign Out?")) {              // Obtain confirmation for sign out
      auth.signOut()                                               // perform signOut operation
          .then(() => { window.location.href = "/"; });            // if successful go to the home location
    }  
  };

  return (
      <div className="sidebar">
        <div className="sidebar__header">
          <img
            className="sidebar__avatar"
            src={user.photoURL}
            alt=""
          />
          <div className="sidebar__headerInfo">
            <h3>{user.displayName}</h3>
            <p>{user.email}</p>
          </div>
          <div className="IconButton" onClick={signOut}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
        <div className="sidebar__search">
          <div className="sidebar__searchBox">
            <i className="fas fa-search"></i>
            <input placeholder="Search for room" type="text" onKeyUp={filterRooms} />
          </div>
        </div>
        <div className="sidebar__rooms">
          <SidebarRoom addNewRoom />
          {rooms.map((room) => (
            <SidebarRoom key={room.id} id={room.id} name={room.name} />
          ))}
        </div>
      </div>

  );
}

export default Sidebar;
