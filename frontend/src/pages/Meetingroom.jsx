import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "react-modal";
import "../styles/Meetingroom.css";
import "../styles/Modal.css";

function Meetingroom() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [meetingrooms, setMeetingrooms] = useState([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [roomToUpdate, setRoomToUpdate] = useState(null);

  useEffect(() => {
    getMeetingRooms();
  }, []);

  const getMeetingRooms = () => {
    api.get("/api/listrooms")
      .then((res) => res.data)
      .then((data) => {
        setMeetingrooms(data);
      })
      .catch((err) => alert(err));
  };

  const deleteMeetingRoom = (roomId) => {
    api.delete(`/api/deleteroom/${roomId}`)
      .then((res) => {
        if (res.status === 200) {
          alert("Room deleted!");
          getMeetingRooms();
        } else {
          alert("Failed to delete room.");
        }
      })
      .catch((error) => alert(error));
  };

  const handleEdit = (room) => {
    setRoomToUpdate(room);
    setName(room.name);
    setCapacity(room.capacity);
    setIsUpdateModalOpen(true);
  };

  const handleAddModalOpen = () => {

    console.log("test1");
    setName("");
    setCapacity("");
    setIsAddModalOpen(true);
    console.log("test2");
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  const updateMeetingRoom = (e) => {
    e.preventDefault();
    api.put("/api/updateroom", {
        meetingRoomId: roomToUpdate.meetingRoomId,
        name: name,
        capacity: capacity,
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Room updated!");
          getMeetingRooms();
          setIsUpdateModalOpen(false);
          setName("");
          setCapacity("");
        } else {
          alert("Failed to update room.");
        }
      })
      .catch((err) => alert(err));
  };

  const createMeetingRoom = (e) => {
    e.preventDefault();
    api.post("/api/createroom", {
        name: name,
        capacity: capacity,
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Room created!");
          getMeetingRooms();
          setIsAddModalOpen(false);
          setName("");
          setCapacity("");
        } else {
          alert("Failed to add room.");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h2 class='listmeeth2'>Meeting Rooms</h2>
      <button className="add-meetingroom-btn" onClick={handleAddModalOpen}>Add Meeting Room</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Capacity</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
  {meetingrooms.map((room) => (
    <tr key={room.meetingRoomId}>
      <td>{room.meetingRoomId}</td>
      <td>{room.name}</td>
      <td>{room.capacity}</td>
      <td className="button-cell">
        <button onClick={() => deleteMeetingRoom(room.meetingRoomId)}>Delete</button>
        <button onClick={() => handleEdit(room)}>Edit</button>
      </td>
    </tr>
  ))}
</tbody>
      </table>


    <Modal isOpen={isAddModalOpen} onRequestClose={handleAddModalClose} className="modal-meetingroom">
        <div className="modal-content">
          <span className="close-btn" onClick={handleAddModalClose}>×</span>
          <h2>Add Meeting Room</h2>
          <form onSubmit={createMeetingRoom}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
            <label>Capacity:</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            <button type="submit">Add</button>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onRequestClose={handleUpdateModalClose} className="modal-meetingroom">
        <div className="modal-content">
          <span className="close-btn" onClick={handleUpdateModalClose}>×</span>
          <h2>Update Meeting Room</h2>
          <form onSubmit={updateMeetingRoom}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
            <label>Capacity:</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            <button type="submit">Update</button>
          </form>
        </div>
      </Modal>

    </div>

  );
}

export default Meetingroom;
