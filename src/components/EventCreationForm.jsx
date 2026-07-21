import React, { useState } from 'react';
import { EMSStorage } from '../utils/storage';

export function EventCreationForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Hackathon',
        date: '',
        time: '10:00 AM',
        location: '',
        image: '/hackathon-image.jpg',
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

        const added = EMSStorage.addEvent(newEvent);
        onSuccess(added);

        setFormData({
            title: '',
            category: 'Hackathon',
            date: '',
            time: '10:00 AM',
            location: '',
            image: '/hackathon-image.jpg',
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
            <h3 className="card-title">Create and Publish New Event</h3>
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
                        <label>Event Image Preset</label>
                        <select 
                            className="form-control"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        >
                            <option value="/hackathon-image.jpg">Hackathon Image</option>
                            <option value="/Sports-image.jpg">Sports Image</option>
                            <option value="/Cultural-image.webp">Cultural Image</option>
                        </select>
                    </div>
                </div>

                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                    <label style={{ fontWeight: '700', marginBottom: '6px', display: 'block' }}>Multi-Ticket Tier Pricing ($):</label>
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
                            placeholder="e.g. Google, TechCorp"
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
                        placeholder="Write brief event description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                    {errors.description && <span style={{ color: 'red', fontSize: '12px' }}>{errors.description}</span>}
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '15px' }}>
                    Publish Event
                </button>
            </form>
        </div>
    );
}
