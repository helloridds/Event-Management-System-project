// Page 1: Attendee Event Explorer & Booking App (React)

const { useState, useEffect } = React;

function App() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confirmedTicket, setConfirmedTicket] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);

    // Load initial data from localStorage
    useEffect(() => {
        setEvents(window.EMSStorage.getEvents());
        setFeedbackList(window.EMSStorage.getFeedback());
    }, []);

    // Filter events by search query & category
    const filteredEvents = events.filter(evt => {
        const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              evt.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddFeedback = (newFb) => {
        const updatedList = window.EMSStorage.addFeedback(newFb);
        setFeedbackList(updatedList);
    };

    return (
        <div>
            {/* Header / Navbar */}
            <header>
                <div className="logo-title">
                    <h2>Eventify</h2>
                    <h3>Event Management System</h3>
                </div>
                <nav>
                    <a href="index.html" className="active">🎉 Explore Events</a>
                    <a href="organizer.html">📊 Organizer Dashboard</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <h1>Discover & Join Exciting Events</h1>
                <p>Book tickets, select your seats, and get instant QR pass entry!</p>
                <div className="search-filter-bar">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="🔍 Search by title, location or keywords..." 
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

            {/* Main Content */}
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

                {/* Feedback & Review Section */}
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

            {/* QR Ticket Confirmation Modal */}
            {confirmedTicket && (
                <TicketQRModal 
                    ticket={confirmedTicket} 
                    onClose={() => setConfirmedTicket(null)} 
                />
            )}
        </div>
    );
}

// Live Countdown Timer Component
function CountdownTimer({ eventDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const difference = new Date(eventDate) - new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [eventDate]);

    return (
        <div className="timer-box">
            <span>⏳ Starts In:</span>
            <span>{timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</span>
        </div>
    );
}

// Event Card Component
function EventCard({ event, onBook }) {
    return (
        <div className="event-card">
            <div className="event-image-container">
                <img src={event.image || 'https://via.placeholder.com/300x150'} alt={event.title} className="event-image" />
                <span className="category-badge">{event.category}</span>
            </div>
            <div className="event-body">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">📅 {event.date} at {event.time}</div>
                <div className="event-meta">📍 {event.location}</div>
                
                {/* Countdown Timer */}
                <CountdownTimer eventDate={event.date} />

                <p className="event-description">{event.description}</p>
                {event.sponsors && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                        🏷️ <strong>Sponsors:</strong> {event.sponsors}
                    </div>
                )}
                <div className="event-footer">
                    <span className="price-tag">From ${event.prices?.earlyBird || 15}</span>
                    <button className="btn-primary" onClick={onBook}>Book Ticket ➔</button>
                </div>
            </div>
        </div>
    );
}

// Ticket Booking Modal with Seat Picker and Form Validation
function BookingModal({ event, onClose, onSuccess }) {
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

    // Price tier mapping
    const basePrice = event.prices ? event.prices[ticketType] : 20;

    // Interactive seats layout (18 seats grid)
    const seatsList = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    const bookedSeats = ['A2', 'B4']; // mock booked seats

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
            setPromoMessage('✅ 10% Discount Applied!');
        } else if (promoCode.trim().toUpperCase() === 'WELCOME20') {
            setDiscount(0.20);
            setPromoMessage('✅ 20% Discount Applied!');
        } else {
            setDiscount(0);
            setPromoMessage('❌ Invalid promo code');
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

        const savedBooking = window.EMSStorage.saveBooking(booking);
        onSuccess(savedBooking);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 style={{ marginBottom: '5px' }}>Book Ticket for {event.title}</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>📅 {event.date} at {event.time} | 📍 {event.location}</p>

                <form onSubmit={handleSubmit}>
                    {/* Ticket Type Tiers */}
                    <label style={{ fontWeight: '700', fontSize: '14px' }}>1. Select Ticket Tier:</label>
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

                    {/* Interactive Seat Map */}
                    <div className="seating-section">
                        <label style={{ fontWeight: '700', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                            2. Interactive Seat Map (Click to select):
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

                    {/* Promo Code Input */}
                    <div className="promo-box">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter Promo Code (e.g. SAVE10 or WELCOME20)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button type="button" className="btn-outline" onClick={applyPromo}>Apply</button>
                    </div>
                    {promoMessage && <p style={{ fontSize: '13px', marginTop: '-8px', marginBottom: '10px' }}>{promoMessage}</p>}

                    {/* Attendee Info Form */}
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your full name"
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
                                placeholder="+91 9876543210"
                            />
                            {errors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</span>}
                        </div>
                    </div>

                    {/* Order Summary */}
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

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                        Confirm Booking & Get QR Ticket 🎟️
                    </button>
                </form>
            </div>
        </div>
    );
}

// QR Code Ticket Confirmation Modal
function TicketQRModal({ ticket, onClose }) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.id + '-' + ticket.attendeeName)}`;

    // Calendar Link Generator
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ticket.eventTitle)}&dates=${ticket.eventDate.replace(/-/g, '')}/${ticket.eventDate.replace(/-/g, '')}&details=${encodeURIComponent('Ticket ID: ' + ticket.id + ' | Seats: ' + ticket.seats)}&location=${encodeURIComponent(ticket.location)}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <button className="modal-close" onClick={onClose}>✕</button>
                
                <div className="alert-success" style={{ textAlign: 'center' }}>
                    🎉 Booking Confirmed Successfully!
                </div>

                <div className="ticket-qr-container">
                    <h3 style={{ color: 'var(--primary-color)' }}>{ticket.eventTitle}</h3>
                    <p style={{ fontSize: '13px', color: '#666' }}>Ticket Code: <strong>{ticket.id}</strong></p>

                    <div className="qr-box">
                        <img src={qrUrl} alt="QR Code Ticket Entry" />
                    </div>
                    <p style={{ fontSize: '12px', color: '#888' }}>Show this QR code at venue entrance for check-in</p>

                    <hr style={{ margin: '15px 0' }} />

                    <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.8' }}>
                        <p>👤 <strong>Attendee:</strong> {ticket.attendeeName}</p>
                        <p>🎟️ <strong>Tier & Seats:</strong> {ticket.ticketType} ({ticket.seats})</p>
                        <p>📅 <strong>Date & Time:</strong> {ticket.eventDate} at {ticket.eventTime}</p>
                        <p>📍 <strong>Venue:</strong> {ticket.location}</p>
                        <p>💵 <strong>Amount Paid:</strong> ${ticket.totalAmount.toFixed(2)}</p>
                    </div>

                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-calendar">
                        📅 Add to Google Calendar
                    </a>
                </div>

                <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
            </div>
        </div>
    );
}

// Post-Event Feedback & Reviews Section
function FeedbackSection({ events, feedbackList, onAddFeedback }) {
    const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
    const [userName, setUserName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userName.trim() || !comment.trim()) return;

        const eventObj = events.find(evt => evt.id === selectedEventId);
        onAddFeedback({
            eventId: selectedEventId,
            eventTitle: eventObj ? eventObj.title : 'Event',
            userName: userName,
            rating: parseInt(rating),
            comment: comment
        });

        setUserName('');
        setComment('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <section style={{ marginTop: '50px' }}>
            <h2 className="section-heading">Post-Event Feedback & Reviews</h2>
            <div className="heading-line"></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {/* Submit Feedback Form */}
                <div className="card">
                    <h3 className="card-title">✍️ Leave Your Feedback</h3>
                    {submitted && <div className="alert-success">Thank you! Your feedback has been recorded.</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Event</label>
                            <select 
                                className="form-control" 
                                value={selectedEventId} 
                                onChange={(e) => setSelectedEventId(e.target.value)}
                            >
                                {events.map(evt => (
                                    <option key={evt.id} value={evt.id}>{evt.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Your Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter your name" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rating</label>
                            <select 
                                className="form-control" 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                                <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                                <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                                <option value="2">⭐⭐ 2 Stars - Poor</option>
                                <option value="1">⭐ 1 Star - Very Bad</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Comment / Review</label>
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                placeholder="Share your experience..." 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Feedback</button>
                    </form>
                </div>

                {/* Feedback Reviews List */}
                <div className="card">
                    <h3 className="card-title">💬 Attendee Reviews ({feedbackList.length})</h3>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {feedbackList.map(fb => (
                            <div key={fb.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong>{fb.userName}</strong>
                                    <span className="star-rating">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>{fb.eventTitle}</div>
                                <p style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>"{fb.comment}"</p>
                                <span style={{ fontSize: '11px', color: '#aaa' }}>Submitted on {fb.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Render React App to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
