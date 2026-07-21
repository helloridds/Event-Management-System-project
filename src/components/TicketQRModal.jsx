import React from 'react';

export function TicketQRModal({ ticket, onClose }) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.id + '-' + ticket.attendeeName)}`;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ticket.eventTitle)}&dates=${ticket.eventDate.replace(/-/g, '')}/${ticket.eventDate.replace(/-/g, '')}&details=${encodeURIComponent('Ticket ID: ' + ticket.id + ' | Seats: ' + ticket.seats)}&location=${encodeURIComponent(ticket.location)}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
                <button className="modal-close" onClick={onClose}>X</button>
                
                <div className="alert-success" style={{ textAlign: 'center' }}>
                    Booking Confirmed Successfully!
                </div>

                <div className="ticket-qr-container">
                    <h3 style={{ color: 'var(--primary-color)' }}>{ticket.eventTitle}</h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>Ticket Code: <strong>{ticket.id}</strong></p>

                    <div className="qr-box">
                        <img src={qrUrl} alt="QR Code Ticket Entry" />
                    </div>
                    <p style={{ fontSize: '12px', color: '#888' }}>Show this QR code at venue entrance for check-in</p>

                    <hr style={{ margin: '12px 0' }} />

                    <div style={{ textAlign: 'left', fontSize: '13px', lineHeight: '1.7' }}>
                        <p><strong>Attendee:</strong> {ticket.attendeeName}</p>
                        <p><strong>Tier & Seats:</strong> {ticket.ticketType} ({ticket.seats})</p>
                        <p><strong>Date & Time:</strong> {ticket.eventDate} at {ticket.eventTime}</p>
                        <p><strong>Venue:</strong> {ticket.location}</p>
                        <p><strong>Amount Paid:</strong> ${ticket.totalAmount.toFixed(2)}</p>
                    </div>

                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-calendar">
                        Add to Google Calendar
                    </a>
                </div>

                <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
            </div>
        </div>
    );
}
