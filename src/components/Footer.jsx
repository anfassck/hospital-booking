import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>🏥 MediCare</h3>
                    <p>Your trusted hospital booking platform. Book appointments with top doctors in Kannur, Irikkur seamlessly and manage your healthcare journey with ease.</p>
                </div>
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/doctors">Find Doctors</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Specialties</h4>
                    <ul>
                        <li><a href="#">Cardiology</a></li>
                        <li><a href="#">Dermatology</a></li>
                        <li><a href="#">Pediatrics</a></li>
                        <li><a href="#">Orthopedics</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:+918301005996">📞 +91 8301005996</a></li>
                        <li><a href="mailto:medicare@gmail.com">✉️ medicare@gmail.com</a></li>
                        <li><a href="#">📍 Irikkur, Kannur, Kerala</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                    Created & Developed by <span style={{
                        background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        fontSize: '1rem'
                    }}>MUHAMMED ANFAS CK</span>
                </p>
                <p>© 2026 MediCare. All rights reserved.</p>
            </div>
        </footer>
    );
}
