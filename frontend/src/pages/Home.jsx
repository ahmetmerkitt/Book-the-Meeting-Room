import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
               <div className="login-container">
            <div className="login-buttons">
                <Link to="/admin" className="login-button">Admin Login</Link>
                <Link to="/user" className="login-button">User Login</Link>
            </div>
        </div>
    );
}

export default Home;
