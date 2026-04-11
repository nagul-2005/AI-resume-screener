import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function HistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get('/api/history/');
                setHistory(res.data);
            } catch (err) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [navigate]);

    const getScoreColor = (score) => {
        if (score >= 80) return '#38ef7d';
        if (score >= 60) return '#ffd200';
        return '#e94560';
    };

    if (loading) return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.loading}>⏳ Loading history...</div>
        </div>
    );

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>📋 Your Scan History</h1>
                    <button
                        onClick={() => navigate('/')}
                        style={styles.newScanBtn}>
                        + New Scan
                    </button>
                </div>

                {history.length === 0 ? (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>No scans yet!</p>
                        <button
                            onClick={() => navigate('/')}
                            style={styles.btn}>
                            Analyze Your First Resume 🚀
                        </button>
                    </div>
                ) : (
                    history.map((scan) => (
                        <div key={scan.id} style={styles.historyCard}>
                            <div>
                                <h3 style={styles.scanTitle}>
                                    Scan #{scan.id}
                                </h3>
                                <p style={styles.scanDate}>
                                    {new Date(scan.created_at)
                                        .toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                </p>
                            </div>

                            <span style={{
                                ...styles.score,
                                color: getScoreColor(scan.match_score)
                            }}>
                                {scan.match_score}%
                            </span>

                            <button
                                onClick={() => navigate(`/result/${scan.id}`)}
                                style={styles.viewBtn}>
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
    },
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '0 20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        color: '#1a1a2e',
        margin: 0,
    },
    newScanBtn: {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    loading: {
        textAlign: 'center',
        marginTop: '100px',
        fontSize: '18px',
        color: '#888',
    },
    emptyCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        textAlign: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: '18px',
        marginBottom: '20px',
    },
    historyCard: {
        backgroundColor: 'white',
        padding: '20px 25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scanTitle: {
        color: '#1a1a2e',
        margin: '0 0 4px 0',
        fontSize: '16px',
    },
    scanDate: {
        color: '#888',
        margin: 0,
        fontSize: '13px',
    },
    score: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    viewBtn: {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '13px',
    },
    btn: {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
    },
};

export default HistoryPage;