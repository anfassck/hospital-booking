import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function DoctorAccount() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/doctor/account/me`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile', err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!password) return;
        try {
            const res = await fetch(`${API_URL}/doctor/account/me/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            setMessage(data.message || 'Password updated');
            setPassword('');
        } catch (err) {
            console.error('Error updating password', err);
            setMessage('Failed to update password');
        }
    };

    if (!profile) return <div className="container">Loading...</div>;

    return (
        <div className="container doctor-account">
            <h2>My Account</h2>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>

            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange} className="form-group">
                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
