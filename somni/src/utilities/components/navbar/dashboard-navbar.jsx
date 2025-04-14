import { useNavigate } from 'react-router';
import { useAuth } from '../auth-context';
import './navbar.css';

function DashNavbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="navbar-style">
            <h1>Dashboard</h1>
            <div className="nav-buttons">
                <button onClick={() => navigate('/insights')}>Insights</button>
                <button onClick={() => navigate('/weekly-trends')}>Weekly Trends</button>
                <button onClick={() => navigate('/monthly-trends')}>Monthly Trends</button>
                <button
                    onClick={async () => {
                        if (logout) {
                            await logout();
                            navigate('/');
                        }
                    }}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashNavbar;
