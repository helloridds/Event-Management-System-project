import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { EventExplorer } from './pages/EventExplorer';
import { OrganizerDashboard } from './pages/OrganizerDashboard';

export default function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<EventExplorer />} />
                <Route path="/organizer" element={<OrganizerDashboard />} />
            </Routes>
        </div>
    );
}
