import React from 'react';
import { CountdownTimer } from './CountdownTimer';

export function EventCard({ event, onBook }) {
    return (
        <div className="event-card">
            <div className="event-image-container">
                <img src={event.image || '/hackathon-image.jpg'} alt={event.title} className="event-image" />
                <span className="category-badge">{event.category}</span>
            </div>
            <div className="event-body">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">Date: {event.date} at {event.time}</div>
                <div className="event-meta">Location: {event.location}</div>
                
                <CountdownTimer eventDate={event.date} />

                <p className="event-description">{event.description}</p>
                {event.sponsors && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        Sponsors: {event.sponsors}
                    </div>
                )}
                <div className="event-footer">
                    <span className="price-tag">From ${event.prices?.earlyBird || 15}</span>
                    <button className="btn-primary" onClick={onBook}>Book Ticket</button>
                </div>
            </div>
        </div>
    );
}
