import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

const API_URL = 'http://localhost:7500/api';

export default function Doctors() {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(searchParams.get('specialty') || 'All');
    const [search, setSearch] = useState('');

    const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Neurologist', 'General Physician', 'Gynecologist', 'ENT Specialist'];

    useEffect(() => {
        const urlSpecialty = searchParams.get('specialty');
        if (urlSpecialty) setFilter(urlSpecialty);
    }, [searchParams]);

    useEffect(() => {
        fetchDoctors();
    }, [filter, search]);

    const fetchDoctors = async () => {
        try {
            const params = new URLSearchParams();
            if (filter !== 'All') params.append('specialty', filter);
            if (search) params.append('search', search);

            const res = await fetch(`${API_URL}/doctors?${params}`);
            const data = await res.json();
            setDoctors(data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <div className="section-header">
                <h2>Our Doctors</h2>
                <p>Find and book appointments with the best specialists</p>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search doctors or specialties..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
                {specialties.map((s) => (
                    <button
                        key={s}
                        className={`filter-chip ${filter === s ? 'active' : ''}`}
                        onClick={() => setFilter(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : doctors.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏥</div>
                    <h3>No Doctors Found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="doctors-grid">
                    {doctors.map((doc) => (
                        <DoctorCard key={doc._id} doctor={doc} />
                    ))}
                </div>
            )}
        </div>
    );
}
