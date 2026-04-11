import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/login/', formData);
            localStorage.setItem('access_token', res.data.tokens.access);
            localStorage.setItem('refresh_token', res.data.tokens.refresh);
            localStorage.setItem('username', res.data.username);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🔐 Login</h1>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.btn}
                        disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.switchText}>
                    Don't have account?{' '}
                    <Link to="/signup" style={styles.link}>
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        color: '#1a1a2e',
        marginBottom: '25px',
    },
    error: {
        backgroundColor: '#fff5f5',
        color: '#e94560',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        borderLeft: '4px solid #e94560',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '5px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    btn: {
        width: '100%',
        backgroundColor: '#e94560',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    switchText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#888',
        fontSize: '14px',
    },
    link: {
        color: '#e94560',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default LoginPage;