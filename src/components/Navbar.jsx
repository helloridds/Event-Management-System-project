import React from 'react';
import { NavLink } from 'react-router-dom';

export function Navbar() {
    return (
        <header>
            <div className="logo-title">
                <h2>Eventify</h2>
                <h3>Event Management System</h3>
            </div>
            <nav>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                    Explore Events
                </NavLink>
                <NavLink to="/organizer" className={({ isActive }) => isActive ? 'active' : ''}>
                    Organizer Dashboard
                </NavLink>
            </nav>
        </header>
    );
}
