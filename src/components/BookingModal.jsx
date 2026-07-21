import React, { useState } from 'react';
import { EMSStorage } from '../utils/storage';

export function BookingModal({ event, onClose, onSuccess }) {
    const [ticketType, setTicketType] = useState('general');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});

    const basePrice = event.prices ? event.prices[ticketType] : 20;
    const seatsList = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    const bookedSeats = ['A2', 'B4'];

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const applyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'SAVE10') {
            setDiscount(0.10);
            setPromoMessage('10% Discount Applied!');
        } else if (promoCode.trim().toUpperCase() === 'WELCOME20') {
            setDiscount(0.20);
            setPromoMessage('20% Discount Applied!');
        } else {
            setDiscount(0);
            setPromoMessage('Invalid promo code');
        }
    };

    const quantity = selectedSeats.length > 0 ? selectedSeats.length : 1;
    const subtotal = basePrice * quantity;
    const totalAmount = subtotal - (subtotal * discount);

    const validateForm = () => {
        let errs = {};
        if (!formData.name.trim()) errs.name = 'Full name is required';
        if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
        if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Valid phone number required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const booking = {
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            location: event.location,
            attendeeName: formData.name,
            attendeeEmail: formData.email,
            attendeePhone: formData.phone,
            ticketType: ticketType.toUpperCase(),
            seats: selectedSeats.length > 0 ? selectedSeats.join(', ') : 'General Admission',
            totalAmount: totalAmount,
            quantity: quantity
        };

        const savedBooking = EMSStorage.saveBooking(booking);
        onSuccess(savedBooking);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                <h2 style={{ marginBottom: '5px' }}>Book Ticket for {event.title}</h2>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>Date: {event.date} at {event.time} | Location: {event.location}</p>

                <form onSubmit={handleSubmit}>
                    <label style={{ fontWeight: '700', fontSize: '13px' }}>1. Select Ticket Tier:</label>
                    <div className="ticket-tiers">
                        <div 
                            className={`tier-card ${ticketType === 'earlyBird' ? 'selected' : ''}`}
                            onClick={() => setTicketType('earlyBird')}
                        >
                            <div className="tier-title">Early Bird</div>
                            <div className="tier-price">${event.prices?.earlyBird || 15}</div>
                        </div>
                        <div 
                            className={`tier-card ${ticketType === 'general' ? 'selected' : ''}`}
                            onClick={() => setTicketType('general')}
                        >
                            <div className="tier-title">General Entry</div>
                            <div className="tier-price">${event.prices?.general || 25}</div>
                        </div>
                        <div 
                            className={`tier-card ${ticketType === 'vip' ? 'selected' : ''}`}
                            onClick={() => setTicketType('vip')}
                        >
                            <div className="tier-title">VIP Access</div>
                            <div className="tier-price">${event.prices?.vip || 50}</div>
                        </div>
                    </div>

                    <div className="seating-section">
                        <label style={{ fontWeight: '700', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                            2. Select Seats (Click to select):
                        </label>
                        <div className="screen-label">STAGE / SCREEN AREA</div>
                        <div className="seat-grid">
                            {seatsList.map(seat => {
                                const isBooked = bookedSeats.includes(seat);
                                const isSelected = selectedSeats.includes(seat);
                                return (
                                    <div 
                                        key={seat} 
                                        className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                        onClick={() => toggleSeat(seat)}
                                    >
                                        {seat}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="seat-legend">
                            <div className="legend-item"><div className="legend-box" style={{ background: '#a4b0be' }}></div> Available</div>
                            <div className="legend-item"><div className="legend-box" style={{ background: 'var(--success-color)' }}></div> Selected</div>
                            <div className="legend-item"><div className="legend-box" style={{ background: '#747d8c' }}></div> Booked</div>
                        </div>
                    </div>

                    <div className="promo-box">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Promo Code (SAVE10 or WELCOME20)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button type="button" className="btn-outline" onClick={applyPromo}>Apply</button>
                    </div>
                    {promoMessage && <p style={{ fontSize: '12px', marginTop: '-6px', marginBottom: '8px' }}>{promoMessage}</p>}

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter full name"
                        />
                        {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address *</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                            />
                            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className="order-summary">
                        <div className="summary-row">
                            <span>Ticket Tier ({ticketType.toUpperCase()}):</span>
                            <span>${basePrice} x {quantity}</span>
                        </div>
                        {selectedSeats.length > 0 && (
                            <div className="summary-row">
                                <span>Seats Selected:</span>
                                <span>{selectedSeats.join(', ')}</span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="summary-row" style={{ color: 'green' }}>
                                <span>Discount ({discount * 100}%):</span>
                                <span>-${(subtotal * discount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total Payment:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '15px' }}>
                        Confirm Booking & Get Ticket
                    </button>
                </form>
            </div>
        </div>
    );
}
