import React, { useState } from "react";
import "../styles/User.css";
import UserBookings from "./UserBookings";
import UserBookRoom from "./UserBookRoom";
import Navbar from "../components/Navbar";


function User() {
    const [activeComponent, setActiveComponent] = useState("userbookroom");

    const handleSwitchComponent = (componentName) => {
        setActiveComponent(componentName);
    };

    return (
        <div >
            <Navbar onSwitchComponent={handleSwitchComponent} />
            <div className="content2">
                {activeComponent === "userbookroom" && <UserBookRoom />}
                {activeComponent === "userbookings" && <UserBookings />}
            </div>
        </div>
    );
}

export default User;
