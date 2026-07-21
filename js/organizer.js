// Page 2: Event Organizer Dashboard & Event Creation (React)

const { useState, useEffect } = React;

function OrganizerApp() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [feedbackList, setFeedbackList] = useState([]);
    const [activeTab, setActiveTab] = useState('create'); // 'create', 'attendees', 'analytics', 'feedback'
    const [attendeeSearch, setAttendeeSearch] = useState('');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setEvents(window.EMSStorage.getEvents());
        setBookings(window.EMSStorage.getBookings());
        setFeedbackList(window.EMSStorage.getFeedback());
    };

    // Calculate Analytics
    const totalEvents = events.length;
    const totalTicketsSold = bookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const checkedInCount = bookings.filter(b => b.checkedIn).length;
    const checkInPercentage = bookings.length > 0 ? Math.round((checkedInCount / bookings.length) * 100) : 0;

    const handleToggleCheckIn = (bookingId, currentStatus) => {
        const updated = window.EMSStorage.updateCheckIn(bookingId, !currentStatus);
        setBookings(updated);
    };

    const handleAddEventSuccess = (newEvent) => {
        refreshData();
        alert(`🎉 Event "${newEvent.title}" published successfully!`);
    };

    // Filter attendees by search
    const filteredBookings = bookings.filter(b => 
        b.id.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        b.attendeeName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        b.eventTitle.toLowerCase().includes(attendeeSearch.toLowerCase())
    );

    return (
        <div>
            {/* Header Navigation */}
            <header>
                <div className="logo-title">
                    <h2>Eventify</h2>
                    <h3>Organizer Portal</h3>
                </div>
                <nav>
                    <a href="index.html">🎉 Explore Events</a>
                    <a href="organizer.html" className="active">📊 Organizer Dashboard</a>
                </nav>
            </header>

            {/* Dashboard Banner */}
            <section className="hero-section" style={{ padding: '35px 20px' }}>
                <h1>Organizer Dashboard</h1>
                <p>Manage events, track ticket sales, and simulate attendee QR entry check-ins.</p>
            </section>

            <main className="container">
                {/* Stats Analytics Overview Cards */}
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

                {/* Sub Navigation Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eef2f5', paddingBottom: '10px' }}>
                    <button 
                        className={`btn-outline ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                        style={{ backgroundColor: activeTab === 'create' ? 'var(--primary-color)' : '', color: activeTab === 'create' ? 'white' : '' }}
                    >
                        ➕ Create New Event
                    </button>
                    <button 
                        className={`btn-outline ${activeTab === 'attendees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendees')}
                        style={{ backgroundColor: activeTab === 'attendees' ? 'var(--primary-color)' : '', color: activeTab === 'attendees' ? 'white' : '' }}
                    >
                        🎟️ Manage Attendees & Check-In ({bookings.length})
                    </button>
                    <button 
                        className={`btn-outline ${activeTab === 'feedback' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feedback')}
                        style={{ backgroundColor: activeTab === 'feedback' ? 'var(--primary-color)' : '', color: activeTab === 'feedback' ? 'white' : '' }}
                    >
                        💬 Event Feedback ({feedbackList.length})
                    </button>
                </div>

                {/* Tab 1: Event Creation Form */}
                {activeTab === 'create' && (
                    <EventCreationForm onSuccess={handleAddEventSuccess} />
                )}

                {/* Tab 2: Manage Attendees & QR Check-In */}
                {activeTab === 'attendees' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Registered Attendees & Entry Gate</h3>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="🔍 Search ticket ID, name, event..." 
                                value={attendeeSearch}
                                onChange={(e) => setAttendeeSearch(e.target.value)}
                                style={{ maxWidth: '300px', border: '1px solid #ccc', padding: '8px 12px' }}
                            />
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', padding: '30px 0' }}>
                                No bookings registered yet. Go to Page 1 to book tickets!
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
                                                        {b.checkedIn ? 'Checked-In ✅' : 'Pending Gate Entry ⏳'}
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

                {/* Tab 3: Feedback & Reviews */}
                {activeTab === 'feedback' && (
                    <div className="card">
                        <h3 className="card-title">Attendee Reviews & Feedback Analytics</h3>
                        {feedbackList.length === 0 ? (
                            <p style={{ color: '#888' }}>No feedback submitted yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {feedbackList.map(fb => (
                                    <div key={fb.id} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{fb.userName}</strong>
                                            <span className="star-rating">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)', margin: '4px 0' }}>
                                            Event: {fb.eventTitle}
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#333' }}>"{fb.comment}"</p>
                                        <span style={{ fontSize: '11px', color: '#999' }}>Submitted Date: {fb.date}</span>
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

// Event Creation Form Component
function EventCreationForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Hackathon',
        date: '',
        time: '10:00 AM',
        location: '',
        image: 'hackathon-image.jpg',
        description: '',
        sponsors: '',
        earlyBirdPrice: 15,
        generalPrice: 25,
        vipPrice: 50,
        streamUrl: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errs = {};
        if (!formData.title.trim()) errs.title = 'Event Title is required';
        if (!formData.date) errs.date = 'Event Date is required';
        if (!formData.location.trim()) errs.location = 'Location is required';
        if (!formData.description.trim()) errs.description = 'Description is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newEvent = {
            title: formData.title,
            category: formData.category,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            image: formData.image,
            description: formData.description,
            sponsors: formData.sponsors,
            prices: {
                earlyBird: parseFloat(formData.earlyBirdPrice) || 10,
                general: parseFloat(formData.generalPrice) || 20,
                vip: parseFloat(formData.vipPrice) || 40
            },
            streamUrl: formData.streamUrl
        };

        const added = window.EMSStorage.addEvent(newEvent);
        onSuccess(added);

        // Reset form
        setFormData({
            title: '',
            category: 'Hackathon',
            date: '',
            time: '10:00 AM',
            location: '',
            image: 'hackathon-image.jpg',
            description: '',
            sponsors: '',
            earlyBirdPrice: 15,
            generalPrice: 25,
            vipPrice: 50,
            streamUrl: ''
        });
    };

    return (
        <div className="card">
            <h3 className="card-title">➕ Create & Publish New Event</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Event Title *</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. AI & Robotics Summit 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select 
                            className="form-control"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Hackathon">Hackathon</option>
                            <option value="Sports">Sports</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Tech">Tech</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Event Date *</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        {errors.date && <span style={{ color: 'red', fontSize: '12px' }}>{errors.date}</span>}
                    </div>

                    <div className="form-group">
                        <label>Time</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. 10:00 AM"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Location / Venue *</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Auditorium Hall, Jaipur"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        {errors.location && <span style={{ color: 'red', fontSize: '12px' }}>{errors.location}</span>}
                    </div>

                    <div className="form-group">
                        <label>Event Image (Preset or URL)</label>
                        <select 
                            className="form-control"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        >
                            <option value="hackathon-image.jpg">Hackathon Image (Local)</option>
                            <option value="Sports-image.jpg">Sports Image (Local)</option>
                            <option value="Cultural-image.webp">Cultural Image (Local)</option>
                        </select>
                    </div>
                </div>

                {/* Pricing Tiers setup */}
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>Multi-Ticket Tier Pricing ($):</label>
                    <div className="form-row">
                        <div className="form-group">
                            <label style={{ fontSize: '12px' }}>Early Bird Price ($)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={formData.earlyBirdPrice}
                                onChange={(e) => setFormData({ ...formData, earlyBirdPrice: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '12px' }}>General Ticket Price ($)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={formData.generalPrice}
                                onChange={(e) => setFormData({ ...formData, generalPrice: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '12px' }}>VIP Ticket Price ($)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={formData.vipPrice}
                                onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Sponsors / Partners</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Google, RedBull, Dev.to"
                            value={formData.sponsors}
                            onChange={(e) => setFormData({ ...formData, sponsors: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Live Stream Link (Optional)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. https://youtube.com/live/..."
                            value={formData.streamUrl}
                            onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Event Description *</label>
                    <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Write brief event highlights and agenda..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                    {errors.description && <span style={{ color: 'red', fontSize: '12px' }}>{errors.description}</span>}
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>
                    🚀 Publish Event to Platform
                </button>
            </form>
        </div>
    );
}

// Render Organizer App to DOM
const root = ReactDOM.createRoot(document.getElementById('organizer-root'));
root.render(<OrganizerApp />);
