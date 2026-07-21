// Storage utility functions using localStorage for Event Management System

const STORAGE_KEYS = {
    EVENTS: 'ems_events',
    BOOKINGS: 'ems_bookings',
    FEEDBACK: 'ems_feedback'
};

const DEFAULT_EVENTS = [
    {
        id: 'evt-1',
        title: 'College Tech Hackathon 2026',
        category: 'Hackathon',
        date: '2026-08-15',
        time: '09:00 AM',
        location: 'Jaipur IT Park, Main Auditorium',
        image: '/hackathon-image.jpg',
        description: '24-hour coding challenge for college students to build innovative tech projects.',
        sponsors: 'TechCorp, DevHub, Cloudify',
        prices: {
            earlyBird: 15,
            general: 25,
            vip: 50
        },
        capacity: 100,
        streamUrl: 'https://youtube.com/live/hackathon2026'
    },
    {
        id: 'evt-2',
        title: 'Annual Sports Meet',
        category: 'Sports',
        date: '2026-09-02',
        time: '08:30 AM',
        location: 'Jaipur Sports Complex Ground',
        image: '/Sports-image.jpg',
        description: 'Inter-college track & field athletics, football, basketball, and fun matches.',
        sponsors: 'FitGear, EnergyDrink Inc.',
        prices: {
            earlyBird: 10,
            general: 15,
            vip: 30
        },
        capacity: 150,
        streamUrl: ''
    },
    {
        id: 'evt-3',
        title: 'Grand Cultural Fest - Rhythm 2026',
        category: 'Cultural',
        date: '2026-10-10',
        time: '05:00 PM',
        location: 'City Amphitheater, Jaipur',
        image: '/Cultural-image.webp',
        description: 'A grand evening of music performances, dance competitions, fashion show, and food stalls.',
        sponsors: 'BeatMusic, StyleStudio',
        prices: {
            earlyBird: 20,
            general: 35,
            vip: 75
        },
        capacity: 200,
        streamUrl: 'https://youtube.com/live/culturalfest'
    }
];

const DEFAULT_FEEDBACK = [
    {
        id: 'fb-1',
        eventId: 'evt-1',
        eventTitle: 'College Tech Hackathon 2026',
        userName: 'Aman Sharma',
        rating: 5,
        comment: 'Great experience! Food and wifi were good.',
        date: '2026-07-10'
    },
    {
        id: 'fb-2',
        eventId: 'evt-3',
        eventTitle: 'Grand Cultural Fest - Rhythm 2026',
        userName: 'Priya Patel',
        rating: 4,
        comment: 'Enjoyed the music concert and performances.',
        date: '2026-07-12'
    }
];

export const EMSStorage = {
    getEvents: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
            return DEFAULT_EVENTS;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return DEFAULT_EVENTS;
        }
    },

    saveEvents: function(events) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    },

    addEvent: function(newEvent) {
        const events = this.getEvents();
        newEvent.id = 'evt-' + Date.now();
        events.unshift(newEvent);
        this.saveEvents(events);
        return newEvent;
    },

    getBookings: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch(e) {
            return [];
        }
    },

    saveBooking: function(booking) {
        const bookings = this.getBookings();
        booking.id = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
        booking.bookingDate = new Date().toISOString().split('T')[0];
        booking.checkedIn = false;
        bookings.unshift(booking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return booking;
    },

    updateCheckIn: function(bookingId, status) {
        const bookings = this.getBookings();
        const updated = bookings.map(b => {
            if (b.id === bookingId) {
                return { ...b, checkedIn: status };
            }
            return b;
        });
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
        return updated;
    },

    getFeedback: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(DEFAULT_FEEDBACK));
            return DEFAULT_FEEDBACK;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return DEFAULT_FEEDBACK;
        }
    },

    addFeedback: function(feedback) {
        const feedbackList = this.getFeedback();
        feedback.id = 'fb-' + Date.now();
        feedback.date = new Date().toISOString().split('T')[0];
        feedbackList.unshift(feedback);
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
        return feedbackList;
    }
};
