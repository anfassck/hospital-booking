import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:7500/api';

export default function BookAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [bookedToken, setBookedToken] = useState(null);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        try {
            const res = await fetch(`${API_URL}/doctors/${id}`);
            const data = await res.json();
            setDoctor(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get today's date for min value
    const today = new Date().toISOString().split('T')[0];

    const handleBook = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!date || !time) {
            setError('Please select both date and time');
            return;
        }

        setBooking(true);
        try {
            const res = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ doctor: id, date, time, notes })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookedToken(data.tokenNumber);
            setSuccess(`Token #${data.tokenNumber} booked successfully!`);
        } catch (err) {
            setError(err.message);
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (!doctor) {
        return (
            <div className="empty-state" style={{ marginTop: '4rem' }}>
                <div className="empty-icon">❌</div>
                <h3>Doctor Not Found</h3>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-doctor-info">
                <img
                    src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0ea5e9&color=fff&size=200`}
                    alt={doctor.name}
                    className="doctor-avatar"
                    style={{ width: 100, height: 100 }}
                />
                <div className="booking-doctor-details">
                    <h2>{doctor.name}</h2>
                    <span className="doctor-specialty">{doctor.specialty}</span>
                    <div className="doctor-meta" style={{ marginTop: '0.75rem' }}>
                        <span>🎓 {doctor.experience} years experience</span>
                        <span>⭐ {doctor.rating} rating</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{doctor.fee} / visit</span>
                    </div>
                    <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {doctor.about}
                    </p>
                    <div style={{ marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '0.85rem' }}>Available on: </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {doctor.availability?.join(', ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="booking-form">
                <h3>🎫 Book Your Token</h3>

                {error && <div className="alert alert-error">{error}</div>}
                {bookedToken && (
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>YOUR TOKEN NUMBER</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>#{bookedToken}</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', opacity: 0.9 }}>{success}</div>
                        <button
                            className="btn btn-lg"
                            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: '1rem' }}
                            onClick={() => navigate('/my-appointments')}
                        >
                            View My Appointments →
                        </button>
                    </div>
                )}

                <form onSubmit={handleBook}>
                    <div className="form-group">
                        <label>Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={today}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Select Time Slot</label>
                        <div className="time-slots">
                            {doctor.timeSlots?.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`time-slot ${time === slot ? 'selected' : ''}`}
                                    onClick={() => setTime(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            placeholder="Describe your symptoms or any special requirements..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={booking || bookedToken}>
                        {booking ? 'Booking...' : '🎫 Confirm & Get Token'}
                    </button>
                </form>
            </div>
        </div>
    );
}
