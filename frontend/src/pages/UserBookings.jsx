import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Userbooking.css";

function UserBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = () => {
    api.get("/api/listbooks")
      .then((res) => res.data)
      .then((data) => {
        setBookings(data);
      })
      .catch((err) => alert(err));
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="user-bookings-container2">
      <h2>Your Bookings</h2>
      <div className="booking-cards2">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card2">
            <p><strong>Meeting Room:</strong> {booking.meetingRoom}</p>
            <p><strong>Number of People:</strong> {booking.numberOfPeople}</p>
            <p><strong>Start Time:</strong> {formatDate(booking.startTime)}</p>
            <p><strong>End Time:</strong> {formatDate(booking.endTime)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBookings;
