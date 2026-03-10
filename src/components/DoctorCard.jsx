import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
    return (
        <div className="doctor-card">
            <div className="doctor-card-header">
                <img src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0ea5e9&color=fff&size=200`}
                    alt={doctor.name} className="doctor-avatar" />
                <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <span className="doctor-specialty">{doctor.specialty}</span>
                    <div className="doctor-meta">
                        <span>🎓 {doctor.experience} yrs</span>
                        <span>⭐ {doctor.rating}</span>
                    </div>
                </div>
            </div>
            <div className="doctor-card-body">
                <p className="doctor-about">{doctor.about}</p>
            </div>
            <div className="doctor-card-footer">
                <div className="doctor-fee">
                    ₹{doctor.fee} <small>/ visit</small>
                </div>
                <Link to={`/book/${doctor._id}`} className="btn btn-primary btn-sm">
                    Book Now
                </Link>
            </div>
        </div>
    );
}
