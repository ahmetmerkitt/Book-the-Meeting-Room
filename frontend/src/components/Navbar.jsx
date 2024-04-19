import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ onSwitchComponent }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <span className="brand-text">Booking</span>
                    <span className="brand-text">.com</span>
                </Link>
                <div className="navbar-collapse justify-content-between">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="#" onClick={() => onSwitchComponent("userbookroom")}>Book a Room</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#" onClick={() => onSwitchComponent("userbookings")}>My Books</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/" >Log Out</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
