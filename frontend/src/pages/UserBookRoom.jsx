import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "../styles/UserBookRoom.css";

function UserBookRoom() {
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);

  const fetchAvailableRooms = () => {
    api
      .post("/api/availablerooms", {
        numberOfPeople: numberOfPeople,
        between: [startDate, endDate],
      })
      .then((res) => {
        setAvailableRooms(
          res.data.available_rooms.map((room) => ({
            ...room,
            startDate: formatDate(room.between),
            endDate: formatDate(room.between),
            capacity: room.capacity
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const handleNumberOfPeopleChange = (e) => {
    setNumberOfPeople(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAvailableRooms();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [start, end] = dateString.split(" - ");
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      return "Invalid Date Range";
    }
    const formattedStart = startDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedEnd = endDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${formattedStart} - ${formattedEnd}`;
  };

  const bookRoom = (roomId, numberOfPeople) => {
  // Format start and end date
  const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
  const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

  const bookingData = {
    meetingRoom: roomId,
    numberOfPeople: numberOfPeople,
    startTime: formattedStartDate,
    endTime: formattedEndDate,
  };

  console.log("Booking Data:", bookingData);

  api
    .post("/api/createbook", bookingData)
    .then((res) => {
      alert("Booking successful");
    })
    .catch((err) => {
      alert("Booking failed");
    });
};






  return (
    <div className="">
      <div className="search-section">
        <h2>Search Available Rooms</h2>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label htmlFor="numberOfPeople">
              <i className="fas fa-users"></i> Number of People:
            </label>
            <input
              type="number"
              id="numberOfPeople"
              value={numberOfPeople}
              onChange={handleNumberOfPeopleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">
              <i className="fas fa-calendar-alt"></i> Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              onBlur={handleStartDateChange}
              min={getCurrentDate()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">
              <i className="fas fa-calendar-alt"></i> End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              onBlur={handleEndDateChange}
              min={getCurrentDate()}
            />
          </div>
          <button type="submit">
            <i className="fas fa-search"></i> Search
          </button>
        </form>
      </div>

      <div className="room-list">
        <h2>Available Rooms</h2>
        <div className="room-cards">
          {availableRooms.map((room, index) => (
            <div
              key={room.roomId}
              className={`room-card ${index === 0 ? "best-match" : ""}`}
            >
              <h3>{room.roomName}</h3>
              <p>Available Date: {room.startDate}</p>
              <p>Number of People: {numberOfPeople}</p>
              <p>Capacity: {room.capacity}</p>
              <button onClick={() => bookRoom(room.roomId,numberOfPeople)}>Book</button>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default UserBookRoom;
