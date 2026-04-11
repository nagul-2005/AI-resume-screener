import { Link, useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () =>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
         <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>
                🎯 Resume Screener
            </Link>

            <div style={styles.links}>
                {username ? (
                    <>
                        <span style={styles.welcome}>
                            Welcome, {username}!
                        </span>
                        <Link to="/history" style={styles.link}>
                            History
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>
                            Login
                        </Link>
                        <Link to="/signup" style={styles.link}>
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        backgroundColor: '#1a1a2e',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        color: '#e94560',
        textDecoration: 'none',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    welcome: {
        color: 'white',
        fontSize: '14px',
    },
    link: {
        color: '#e94560',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    logoutBtn: {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default Navbar;