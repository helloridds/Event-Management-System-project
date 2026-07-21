import React, { useState, useEffect } from 'react';
import { EMSStorage } from '../utils/storage';
import { EventCard } from '../components/EventCard';
import { BookingModal } from '../components/BookingModal';
import { TicketQRModal } from '../components/TicketQRModal';
import { FeedbackSection } from '../components/FeedbackSection';

export function EventExplorer() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confirmedTicket, setConfirmedTicket] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        setEvents(EMSStorage.getEvents());
        setFeedbackList(EMSStorage.getFeedback());
    }, []);

    const filteredEvents = events.filter(evt => {
        const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              evt.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddFeedback = (newFb) => {
        const updatedList = EMSStorage.addFeedback(newFb);
        setFeedbackList(updatedList);
    };

    return (
        <div>
            {/* Hero Banner */}
            <section className="hero-section">
                <h1>Discover and Join Events</h1>
                <p>Book tickets, select your seats, and get instant QR pass entry.</p>
                <div className="search-filter-bar">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by title, location or keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="category-buttons">
                        {['All', 'Hackathon', 'Sports', 'Cultural', 'Tech'].map(cat => (
                            <button 
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Section */}
            <main className="container">
                <h2 className="section-heading">Upcoming Events</h2>
                <div className="heading-line"></div>

                {filteredEvents.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', margin: '40px 0' }}>No events found matching your search.</p>
                ) : (
                    <div className="event-grid">
                        {filteredEvents.map(evt => (
                            <EventCard 
                                key={evt.id} 
                                event={evt} 
                                onBook={() => setSelectedEvent(evt)} 
                            />
                        ))}
                    </div>
                )}

                {/* Feedback Section */}
                <FeedbackSection 
                    events={events} 
                    feedbackList={feedbackList} 
                    onAddFeedback={handleAddFeedback} 
                />
            </main>

            {/* Booking Modal */}
            {selectedEvent && (
                <BookingModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)}
                    onSuccess={(ticket) => {
                        setSelectedEvent(null);
                        setConfirmedTicket(ticket);
                    }}
                />
            )}

            {/* Ticket Confirmation Modal */}
            {confirmedTicket && (
                <TicketQRModal 
                    ticket={confirmedTicket} 
                    onClose={() => setConfirmedTicket(null)} 
                />
            )}
        </div>
    );
}
