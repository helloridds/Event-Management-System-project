import React, { useState } from 'react';

export function FeedbackSection({ events, feedbackList, onAddFeedback }) {
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
        <section style={{ marginTop: '40px' }}>
            <h2 className="section-heading">Post-Event Feedback & Reviews</h2>
            <div className="heading-line"></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                <div className="card">
                    <h3 className="card-title">Leave Your Feedback</h3>
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
                            <label>Rating Score (1 to 5)</label>
                            <select 
                                className="form-control" 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Very Bad</option>
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

                <div className="card">
                    <h3 className="card-title">Attendee Reviews ({feedbackList.length})</h3>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {feedbackList.map(fb => (
                            <div key={fb.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <strong>{fb.userName}</strong>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>Rating: {fb.rating}/5</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{fb.eventTitle}</div>
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
