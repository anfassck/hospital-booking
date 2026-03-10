import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:7500/api';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editDoctor, setEditDoctor] = useState(null);
    const [form, setForm] = useState({
        name: '', specialty: '', experience: '', fee: '', about: '', rating: '4.5', email: '', password: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [docRes, aptRes] = await Promise.all([
                fetch(`${API_URL}/doctors`),
                fetch(`${API_URL}/appointments`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);
            setDoctors(await docRes.json());
            setAppointments(await aptRes.json());
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditDoctor(null);
        setForm({ name: '', specialty: '', experience: '', fee: '', about: '', rating: '4.5', email: '', password: '' });
        setShowModal(true);
    };

    const openEditModal = (doc) => {
        setEditDoctor(doc);
        setForm({
            name: doc.name,
            specialty: doc.specialty,
            experience: doc.experience.toString(),
            fee: doc.fee.toString(),
            about: doc.about || '',
            rating: doc.rating.toString(),
            email: doc.userId?.email || '',
            password: ''
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = editDoctor ? `${API_URL}/doctors/${editDoctor._id}` : `${API_URL}/doctors`;
            const method = editDoctor ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...form,
                    experience: Number(form.experience),
                    fee: Number(form.fee),
                    rating: Number(form.rating),
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=0ea5e9&color=fff&size=200`
                })
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const deleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await fetch(`${API_URL}/doctors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/appointments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

    return (
        <div className="admin-page">
            <h2>👨‍💼 Admin Dashboard</h2>

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}>👨‍⚕️</div>
                    <div className="stat-value">{doctors.length}</div>
                    <div className="stat-label">Total Doctors</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>📋</div>
                    <div className="stat-value">{appointments.length}</div>
                    <div className="stat-label">Total Appointments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>⏳</div>
                    <div className="stat-value">{pendingCount}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✅</div>
                    <div className="stat-value">{confirmedCount}</div>
                    <div className="stat-label">Confirmed</div>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
                    Manage Doctors
                </button>
                <button className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                    Manage Appointments
                </button>
            </div>

            {activeTab === 'doctors' && (
                <>
                    <div style={{ marginBottom: '1rem' }}>
                        <button className="btn btn-primary" onClick={openAddModal}>+ Add Doctor</button>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Specialty</th>
                                <th>Experience</th>
                                <th>Fee</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc) => (
                                <tr key={doc._id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={doc.image} alt={doc.name} style={{ width: 36, height: 36, borderRadius: '8px' }} />
                                        {doc.name}
                                    </td>
                                    <td><span className="doctor-specialty">{doc.specialty}</span></td>
                                    <td>{doc.experience} yrs</td>
                                    <td>₹{doc.fee}</td>
                                    <td>⭐ {doc.rating}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-outline btn-sm" onClick={() => openEditModal(doc)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(doc._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {activeTab === 'appointments' && (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
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
                                        padding: '4px 12px',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem'
                                    }}>#{apt.tokenNumber || '—'}</span>
                                </td>
                                <td>
                                    <div>{apt.patient?.name || 'N/A'}</div>
                                    <small style={{ color: 'var(--text-light)' }}>{apt.patient?.email}</small>
                                </td>
                                <td>{apt.doctor?.name || 'N/A'}</td>
                                <td>{apt.date}</td>
                                <td>{apt.time}</td>
                                <td><span className={`status-badge status-${apt.status}`}>{apt.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {apt.status === 'pending' && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => updateAppointmentStatus(apt._id, 'confirmed')}>Confirm</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}>Cancel</button>
                                            </>
                                        )}
                                        {apt.status === 'confirmed' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => updateAppointmentStatus(apt._id, 'completed')}>Complete</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Specialty</label>
                                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required>
                                    <option value="">Select Specialty</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="ENT Specialist">ENT Specialist</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Experience (years)</label>
                                <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Consultation Fee (₹)</label>
                                <input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Rating</label>
                                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>About</label>
                                <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="Brief description about the doctor..." />
                            </div>
                            <>
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>🔐 Doctor Login Account</p>
                                </div>
                                <div className="form-group">
                                    <label>Login Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@example.com" required />
                                </div>
                                <div className="form-group">
                                    <label>Login Password</label>
                                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" minLength={6} />
                                </div>
                            </>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editDoctor ? 'Update' : 'Add Doctor'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
