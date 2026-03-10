import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:7500/api';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [illnessForm, setIllnessForm] = useState({ illness: '', diagnosis: '', nextVisitDate: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) fetchAppointments();
    }, [profile, dateFilter]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/doctor/profile`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) setProfile(data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_URL}/doctor/appointments?date=${dateFilter}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) setAppointments(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/doctor/appointments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            fetchAppointments();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const openIllnessModal = (apt) => {
        setSelectedApt(apt);
        setIllnessForm({
            illness: apt.illness || '',
            diagnosis: apt.diagnosis || '',
            nextVisitDate: apt.nextVisitDate || ''
        });
        setShowModal(true);
    };

    const saveIllness = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/doctor/appointments/${selectedApt._id}/illness`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(illnessForm)
            });
            setShowModal(false);
            fetchAppointments();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (!profile) {
        return (
            <div className="empty-state" style={{ marginTop: '4rem' }}>
                <div className="empty-icon">⚕️</div>
                <h3>Doctor Profile Not Found</h3>
                <p>Your account is not linked to a doctor profile. Please contact admin.</p>
            </div>
        );
    }

    const pendingList = appointments.filter(a => a.status === 'pending');
    const confirmedList = appointments.filter(a => a.status === 'confirmed');
    const completedList = appointments.filter(a => a.status === 'completed');
    const currentToken = confirmedList.length > 0 ? confirmedList[0] : pendingList[0];
    const nextToken = confirmedList.length > 1 ? confirmedList[1] : (confirmedList.length === 1 ? pendingList[0] : (pendingList.length > 1 ? pendingList[1] : null));

    return (
        <div className="admin-page">
            <h2>🩺 Doctor Dashboard</h2>

            {/* Doctor Info */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem 2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Dr. {profile.name}</h3>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>{profile.specialty} • {profile.experience} yrs experience</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', opacity: 0.9 }}>Date:</label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>📋</div>
                    <div className="stat-value">{appointments.length}</div>
                    <div className="stat-label">Total Tokens</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>⏳</div>
                    <div className="stat-value">{pendingList.length}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✅</div>
                    <div className="stat-value">{confirmedList.length}</div>
                    <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>🏁</div>
                    <div className="stat-value">{completedList.length}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Current & Next Token */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    background: 'var(--surface)',
                    border: '2px solid var(--success)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🟢 CURRENT TOKEN</div>
                    {currentToken ? (
                        <>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>#{currentToken.tokenNumber}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 600 }}>{currentToken.patient?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentToken.time}</div>
                        </>
                    ) : (
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>No patients</div>
                    )}
                </div>
                <div style={{
                    background: 'var(--surface)',
                    border: '2px solid var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🔵 NEXT TOKEN</div>
                    {nextToken ? (
                        <>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>#{nextToken.tokenNumber}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 600 }}>{nextToken.patient?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{nextToken.time}</div>
                        </>
                    ) : (
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>—</div>
                    )}
                </div>
            </div>

            {/* All Patients Table */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                📋 Patient List — {new Date(dateFilter).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>

            {appointments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>No Appointments</h3>
                    <p>No patients scheduled for this date</p>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Patient</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Illness</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt) => (
                            <tr key={apt._id}>
                                <td>
                                    <span style={{
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                        color: 'white',
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 800,
                                        fontSize: '0.9rem'
                                    }}>#{apt.tokenNumber}</span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{apt.patient?.name || 'N/A'}</div>
                                    <small style={{ color: 'var(--text-light)' }}>{apt.patient?.phone || apt.patient?.email}</small>
                                </td>
                                <td>{apt.time}</td>
                                <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                                <td>
                                    {apt.illness ? (
                                        <span style={{
                                            background: 'var(--primary-50)',
                                            color: 'var(--primary)',
                                            padding: '3px 10px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.78rem',
                                            fontWeight: 600
                                        }}>{apt.illness}</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>Not recorded</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => openIllnessModal(apt)}
                                        >
                                            📝 Details
                                        </button>
                                        {apt.status === 'pending' && (
                                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(apt._id, 'confirmed')}>
                                                ✅ Confirm
                                            </button>
                                        )}
                                        {apt.status === 'confirmed' && (
                                            <button className="btn btn-sm" style={{ background: '#7c3aed', color: 'white' }} onClick={() => updateStatus(apt._id, 'completed')}>
                                                🏁 Complete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Illness/Diagnosis Modal */}
            {showModal && selectedApt && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                        <h3>📋 Patient Record</h3>
                        <div style={{
                            background: 'var(--bg)',
                            borderRadius: 'var(--radius)',
                            padding: '1rem',
                            marginBottom: '1.25rem',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedApt.patient?.name}</span>
                                <span style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    padding: '3px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700,
                                    fontSize: '0.82rem'
                                }}>Token #{selectedApt.tokenNumber}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                📞 {selectedApt.patient?.phone || 'N/A'} &nbsp;•&nbsp;
                                ✉️ {selectedApt.patient?.email} &nbsp;•&nbsp;
                                🕐 {selectedApt.time}
                            </div>
                            {selectedApt.notes && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <strong>Patient Notes:</strong> {selectedApt.notes}
                                </div>
                            )}
                        </div>

                        <form onSubmit={saveIllness}>
                            <div className="form-group">
                                <label>Illness / Symptoms</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fever, Headache, Cold..."
                                    value={illnessForm.illness}
                                    onChange={(e) => setIllnessForm({ ...illnessForm, illness: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Diagnosis / Prescription</label>
                                <textarea
                                    placeholder="Doctor's diagnosis and prescribed treatment..."
                                    value={illnessForm.diagnosis}
                                    onChange={(e) => setIllnessForm({ ...illnessForm, diagnosis: e.target.value })}
                                    style={{ minHeight: '100px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Next Visit Date (Schedule)</label>
                                <input
                                    type="date"
                                    value={illnessForm.nextVisitDate}
                                    onChange={(e) => setIllnessForm({ ...illnessForm, nextVisitDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">💾 Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
