import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    const specialties = [
        { name: 'Cardiology', filter: 'Cardiologist' },
        { name: 'Dermatology', filter: 'Dermatologist' },
        { name: 'Pediatrics', filter: 'Pediatrician' },
        { name: 'Orthopedics', filter: 'Orthopedic' },
        { name: 'Neurology', filter: 'Neurologist' },
        { name: 'Gynecology', filter: 'Gynecologist' },
        { name: 'ENT', filter: 'ENT Specialist' },
        { name: 'General Medicine', filter: 'General Physician' }
    ];

    return (
        <>
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <h1>
                            Your Health,<br />
                            Our <span>Priority</span>
                        </h1>
                        <p>
                            Welcome to MediCare, Irikkur, Kannur.
                            Book your token and appointment with top doctors.
                            Get expert medical consultation with just a few clicks.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/doctors" className="btn btn-primary btn-lg">
                                🎫 Book Token →
                            </Link>
                            {!user && (
                                <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                                    Get Started
                                </Link>
                            )}
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Expert Doctors</div>
                            </div>
                            <div className="hero-stat">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Happy Patients</div>
                            </div>
                            <div className="hero-stat">
                                <div className="stat-number">15+</div>
                                <div className="stat-label">Specialties</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card">
                            <div className="hero-card-title">
                                🩺 Our Specialties
                            </div>
                            <div className="hero-specialties">
                                {specialties.map((s) => (
                                    <Link key={s.name} to={`/doctors?specialty=${s.filter}`} className="specialty-chip" style={{ cursor: 'pointer' }}>
                                        {s.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-header">
                    <h2>Why Choose MediCare?</h2>
                    <p>We provide seamless token booking experience with top-rated doctors in Irikkur, Kannur</p>
                </div>
                <div className="doctors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    {[
                        { icon: '🏆', title: 'Top Doctors', desc: 'Verified and experienced doctors across all specialties' },
                        { icon: '🎫', title: 'Token System', desc: 'Get your token number instantly — no waiting in long queues' },
                        { icon: '🔒', title: 'Secure & Private', desc: 'Your medical data is encrypted and completely private' },
                        { icon: '💰', title: 'Affordable', desc: 'Transparent pricing with no hidden fees or charges' }
                    ].map((f) => (
                        <div key={f.title} className="doctor-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
