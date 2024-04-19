import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "react-modal";
import "../styles/Booking.css";
import "../styles/Modal.css";
import { useHistory } from "react-router-dom";


function Booking() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingToUpdate, setBookingToUpdate] = useState(null);

  useEffect(() => {
    getBookings();
    getRooms();
  }, []);

  const getBookings = () => {
    api.get("/api/listbooks")
      .then((res) => res.data)
      .then((data) => {
        setBookings(data);
      })
      .catch((err) => alert(err));
  };

  const getRooms = () => {
    api.get("/api/listrooms")
      .then((res) => res.data)
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => alert(err));
  };

  const deleteBooking = (bookingId) => {
    api.delete(`/api/deletebook/${bookingId}`)
      .then((res) => {
        if (res.status === 200) {
          alert("Booking deleted!");
          getBookings();
        } else {
          alert("Failed to delete booking.");
        }
      })
      .catch((error) => alert(error));
  };

  const handleEdit = (booking) => {
    setBookingToUpdate(booking);
    setSelectedRoom(booking.meetingRoom);
    setNumberOfPeople(booking.numberOfPeople);
    setStartTime(formatDateTime(booking.startTime));
    setEndTime(formatDateTime(booking.endTime));
    setIsUpdateModalOpen(true);
  };

  const handleAddModalOpen = () => {
    setSelectedRoom("");
    setNumberOfPeople(0);
    setStartTime("");
    setEndTime("");
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  const updateBooking = (e) => {
    e.preventDefault();
    const numberOfPeopleInt = parseInt(numberOfPeople);
    api.put("/api/updatebook", {
      bookingId: bookingToUpdate.bookingId,
      meetingRoom: selectedRoom,
      numberOfPeople: numberOfPeopleInt,
      startTime: startTime,
      endTime: endTime,
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Booking updated!");
          getBookings();
          setIsUpdateModalOpen(false);
          setSelectedRoom("");
          setNumberOfPeople(0);
          setStartTime("");
          setEndTime("");
        } else {
          alert("Failed to update booking.");
        }
      })
      .catch((err) => alert(err));
  };

  const createBooking = (e) => {
    e.preventDefault();
    const numberOfPeopleInt = parseInt(numberOfPeople);
    api.post("/api/createbook", {
      meetingRoom: selectedRoom,
      numberOfPeople: numberOfPeopleInt,
      startTime: startTime,
      endTime: endTime,
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Booking created!");
          getBookings();
          setIsAddModalOpen(false);
          setSelectedRoom("");
          setNumberOfPeople(0);
          setStartTime("");
          setEndTime("");
          history.push("/booking");
        } else {
          alert("Failed to add booking.");
        }
      })
      .catch((err) => alert(err));
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateForTable = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div>
      <h2 className='bookingh2'>Bookings</h2>
      <button className="add-booking-btn" onClick={handleAddModalOpen}>
        Add Booking
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Meeting Room</th>
            <th>Number of People</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.meetingRoom}</td>
              <td>{booking.numberOfPeople}</td>
              <td>{formatDateForTable(booking.startTime)}</td>
              <td>{formatDateForTable(booking.endTime)}</td>
              <td>
                <button onClick={() => handleEdit(booking)}>Edit</button>
                <button onClick={() => deleteBooking(booking.bookingId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={handleAddModalClose}
        className="modal-add"
      >
        <div className="modal-content-add">
          <span className="close-btn" onClick={handleAddModalClose}>
            ×
          </span>
          <h2>Add Booking</h2>
          <form onSubmit={createBooking}>
            <label>Meeting Room:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.meetingRoomId} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
            <label>Number of People:</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              required
            />
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <label>End Time:</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={handleUpdateModalClose}
        className="modal-update"
      >
        <div className="modal-content-update">
          <span className="close-btn" onClick={handleUpdateModalClose}>
            ×
          </span>
          <h2>Update Booking</h2>
          <form onSubmit={updateBooking}>
            <label>Meeting Room:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.meetingRoomId} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
            <label>Number of People:</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              required
            />
            <label>Start Time:</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <label>End Time:</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            <button type="submit">Update</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Booking;
