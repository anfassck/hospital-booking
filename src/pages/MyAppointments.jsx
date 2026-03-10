import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:7500/api';

export default function MyAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_URL}/appointments/my`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
            });
            fetchAppointments();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="appointments-page">
            <h2>📋 My Appointments</h2>

            {appointments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>No Appointments Yet</h3>
                    <p>Book your first appointment with a doctor to get started</p>
                </div>
            ) : (
                <div className="appointments-list">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="appointment-card">
                            <div className="appointment-left">
                                <div style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '1.1rem',
                                    lineHeight: 1,
                                    flexShrink: 0
                                }}>
                                    <span style={{ fontSize: '0.55rem', fontWeight: 600, opacity: 0.85 }}>TOKEN</span>
                                    {apt.tokenNumber || '—'}
                                </div>
                                <img
                                    src={apt.doctor?.image || 'https://ui-avatars.com/api/?name=Dr&background=0ea5e9&color=fff'}
                                    alt={apt.doctor?.name}
                                />
                                <div>
                                    <div className="appointment-doctor-name">{apt.doctor?.name || 'Doctor'}</div>
                                    <div className="appointment-specialty">{apt.doctor?.specialty}</div>
                                </div>
                            </div>
                            <div className="appointment-center">
                                <span>🎫 Token #{apt.tokenNumber || '—'}</span>
                                <span>📅 {apt.date}</span>
                                <span>🕐 {apt.time}</span>
                                <span>💰 ₹{apt.doctor?.fee}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className={`status-badge status-${apt.status}`}>{apt.status}</span>
                                {apt.status === 'pending' && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => cancelAppointment(apt._id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
