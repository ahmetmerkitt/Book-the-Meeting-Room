import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ onSwitchComponent }) {
    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li><Link to="#" onClick={() => onSwitchComponent("booking")}>Bookings</Link></li>
                <li><Link to="#" onClick={() => onSwitchComponent("meetingroom")}>Meeting Rooms</Link></li>

                <li><Link to="/">Logout</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
