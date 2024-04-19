import React, { useState } from "react";
import "../styles/Admin.css";
import Sidebar from "../components/Sidebar";
import Meetingroom from "./Meetingroom";
import Booking from "./Booking";

function Admin() {
    const [activeComponent, setActiveComponent] = useState("booking");

    const handleSwitchComponent = (componentName) => {
        setActiveComponent(componentName);
    };

    return (
        <div className="admin-layout">
          <div>
             <Sidebar onSwitchComponent={handleSwitchComponent} />
            </div>

            <div className="content">
                {activeComponent === "meetingroom" && <Meetingroom />}
                {activeComponent === "booking" && <Booking />}
            </div>
        </div>
    );
}

export default Admin;
