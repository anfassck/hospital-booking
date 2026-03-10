import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; // adjust if you have a config file
import { useAuth } from '../context/AuthContext';

export default function AdminUserDashboard() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [showModal, setShowModal] = useState(false);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setDoctors(data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const openEdit = (doc) => {
        setSelected(doc);
        setForm({ name: doc.name, email: doc.email, phone: doc.phone, password: '' });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            // Remove empty password field so it won't overwrite with empty string
            if (!payload.password) delete payload.password;
            const res = await fetch(`${API_URL}/admin/users/${selected._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to update');
            setShowModal(false);
            fetchDoctors();
        } catch (err) {
            console.error('Error updating doctor:', err);
        }
    };

    return (
        <div className="admin-user-dashboard container">
            <h2>Doctor User Management</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doc) => (
                        <tr key={doc._id}>
                            <td>{doc.name}</td>
                            <td>{doc.email}</td>
                            <td>{doc.phone}</td>
                            <td>
                                <button className="btn btn-sm btn-outline" onClick={() => openEdit(doc)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Doctor User</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>New Password (leave blank to keep current)</label>
                                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
