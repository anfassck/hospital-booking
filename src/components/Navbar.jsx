
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">🏥</div>
                    MediCare
                </Link>

                <ul className="navbar-links">
                    <li><Link to="/" className={isActive('/')}>Home</Link></li>
                    <li><Link to="/doctors" className={isActive('/doctors')}>Doctors</Link></li>
                    {user && (
                        <li><Link to="/my-appointments" className={isActive('/my-appointments')}>My Appointments</Link></li>
                    )}
                    {user?.role === 'admin' && (
                        <>
                            <li><Link to="/admin" className={isActive('/admin')}>Dashboard</Link></li>
                            <li><Link to="/admin/users" className={isActive('/admin/users')}>User Management</Link></li>
                        </>
                    )}
                    {user?.role === 'doctor' && (
                        <>
                            <li><Link to="/doctor-dashboard" className={isActive('/doctor-dashboard')}>My Dashboard</Link></li>
                            <li><Link to="/doctor-account" className={isActive('/doctor-account')}>My Account</Link></li>
                        </>
                    )}
                </ul>

                <div className="navbar-auth">
                    {user ? (
                        <>
                            <div className="navbar-user">
                                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                <span>{user.name}</span>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
