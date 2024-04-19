import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <div className="back-home">
                <Link to="/" className="back-home-button">Go back to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;
