import React, { useState, useEffect } from 'react';
import { EMSStorage } from '../utils/storage';
import { EventCreationForm } from '../components/EventCreationForm';

export function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [activeTab, setActiveTab] = useState('create');
    const [attendeeSearch, setAttendeeSearch] = useState('');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setEvents(EMSStorage.getEvents());
        setBookings(EMSStorage.getBookings());
        setFeedbackList(EMSStorage.getFeedback());
    };

    const totalEvents = events.length;
    const totalTicketsSold = bookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const checkedInCount = bookings.filter(b => b.checkedIn).length;
    const checkInPercentage = bookings.length > 0 ? Math.round((checkedInCount / bookings.length) * 100) : 0;

    const handleToggleCheckIn = (bookingId, currentStatus) => {
        const updated = EMSStorage.updateCheckIn(bookingId, !currentStatus);
        setBookings(updated);
    };

    const handleAddEventSuccess = (newEvent) => {
        refreshData();
        alert(`Event "${newEvent.title}" published successfully.`);
    };

    const filteredBookings = bookings.filter(b => 
        b.id.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        b.attendeeName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        b.eventTitle.toLowerCase().includes(attendeeSearch.toLowerCase())
    );

    return (
        <div>
            <section className="hero-section" style={{ padding: '30px 20px' }}>
                <h1>Organizer Dashboard</h1>
                <p>Manage events, track ticket sales, and handle gate check-ins.</p>
            </section>

            <main className="container">
                {/* Stats */}
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-title">Total Active Events</div>
                        <div className="stat-number">{totalEvents}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Tickets Sold</div>
                        <div className="stat-number">{totalTicketsSold}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Total Revenue ($)</div>
                        <div className="stat-number" style={{ color: 'var(--success-color)' }}>
                            ${totalRevenue.toFixed(2)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Gate Check-in Rate</div>
                        <div className="stat-number" style={{ color: 'var(--secondary-color)' }}>
                            {checkInPercentage}% ({checkedInCount}/{bookings.length})
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eef2f5', paddingBottom: '10px' }}>
                    <button 
                        className={`btn-outline ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                        style={{ backgroundColor: activeTab === 'create' ? 'var(--primary-color)' : '', color: activeTab === 'create' ? 'white' : '' }}
                    >
                        Create New Event
                    </button>
                    <button 
                        className={`btn-outline ${activeTab === 'attendees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendees')}
                        style={{ backgroundColor: activeTab === 'attendees' ? 'var(--primary-color)' : '', color: activeTab === 'attendees' ? 'white' : '' }}
                    >
                        Manage Attendees ({bookings.length})
                    </button>
                    <button 
                        className={`btn-outline ${activeTab === 'feedback' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feedback')}
                        style={{ backgroundColor: activeTab === 'feedback' ? 'var(--primary-color)' : '', color: activeTab === 'feedback' ? 'white' : '' }}
                    >
                        Event Feedback ({feedbackList.length})
                    </button>
                </div>

                {/* Tab 1: Create Event */}
                {activeTab === 'create' && (
                    <EventCreationForm onSuccess={handleAddEventSuccess} />
                )}

                {/* Tab 2: Manage Attendees */}
                {activeTab === 'attendees' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Registered Attendees & Entry Gate</h3>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search ticket ID, name, event..." 
                                value={attendeeSearch}
                                onChange={(e) => setAttendeeSearch(e.target.value)}
                                style={{ maxWidth: '300px', border: '1px solid #ccc', padding: '8px 12px' }}
                            />
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', padding: '30px 0' }}>
                                No bookings registered yet.
                            </p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Ticket ID</th>
                                            <th>Event Title</th>
                                            <th>Attendee Name</th>
                                            <th>Email & Phone</th>
                                            <th>Tier & Seats</th>
                                            <th>Paid</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map(b => (
                                            <tr key={b.id}>
                                                <td><strong>{b.id}</strong></td>
                                                <td>{b.eventTitle}</td>
                                                <td>{b.attendeeName}</td>
                                                <td style={{ fontSize: '12px' }}>{b.attendeeEmail}<br/>{b.attendeePhone}</td>
                                                <td><span style={{ fontWeight: '700' }}>{b.ticketType}</span> ({b.seats})</td>
                                                <td style={{ fontWeight: '700', color: 'var(--success-color)' }}>${b.totalAmount.toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${b.checkedIn ? 'checked' : 'pending'}`}>
                                                        {b.checkedIn ? 'Checked-In' : 'Pending Entry'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className={b.checkedIn ? 'btn-outline' : 'btn-primary'}
                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                        onClick={() => handleToggleCheckIn(b.id, b.checkedIn)}
                                                    >
                                                        {b.checkedIn ? 'Undo Check-In' : 'Scan / Check-In'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Feedback */}
                {activeTab === 'feedback' && (
                    <div className="card">
                        <h3 className="card-title">Attendee Reviews and Feedback</h3>
                        {feedbackList.length === 0 ? (
                            <p style={{ color: '#888' }}>No feedback submitted yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {feedbackList.map(fb => (
                                    <div key={fb.id} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', borderLeft: '4px solid var(--primary-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{fb.userName}</strong>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>Rating: {fb.rating}/5</span>
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-color)', margin: '4px 0' }}>
                                            Event: {fb.eventTitle}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#333' }}>"{fb.comment}"</p>
                                        <span style={{ fontSize: '11px', color: '#999' }}>Submitted: {fb.date}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
