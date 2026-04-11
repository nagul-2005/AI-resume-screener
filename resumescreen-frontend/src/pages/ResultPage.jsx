import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function ResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await API.get(`/api/result/${id}/`);
                setResult(res.data);
            } catch (err) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id, navigate]);

    const getScoreStyle = (score) => {
        if (score >= 80) return {
            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            label: '🟢 Excellent Match!',
            color: '#38ef7d'
        };
        if (score >= 60) return {
            background: 'linear-gradient(135deg, #f7971e, #ffd200)',
            label: '🟡 Good Match',
            color: '#ffd200'
        };
        return {
            background: 'linear-gradient(135deg, #eb3349, #f45c43)',
            label: '🔴 Needs Improvement',
            color: '#e94560'
        };
    };

    if (loading) return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.loading}>⏳ Loading results...</div>
        </div>
    );

    const scoreStyle = getScoreStyle(result.match_score);

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>

                {/* Score Card */}
                <div style={{...styles.card, textAlign: 'center'}}>
                    <h1 style={styles.title}>📊 Resume Analysis Result</h1>
                    <div style={{
                        ...styles.scoreCircle,
                        background: scoreStyle.background
                    }}>
                        {result.match_score}%
                    </div>
                    <h2 style={{ color: scoreStyle.color }}>
                        {scoreStyle.label}
                    </h2>
                </div>

                {/* Strengths */}
                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>✅ Strengths</h2>
                    <ul style={styles.list}>
                        {result.strengths.map((item, i) => (
                            <li key={i} style={styles.strengthItem}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Missing Skills */}
                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>❌ Missing Skills</h2>
                    <ul style={styles.list}>
                        {result.missing_skills.map((item, i) => (
                            <li key={i} style={styles.missingItem}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Suggestions */}
                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>💡 Suggestions</h2>
                    <ul style={styles.list}>
                        {result.suggestions.map((item, i) => (
                            <li key={i} style={styles.suggestionItem}>
                                {typeof item === 'string' ? item : JSON.stringify(item)}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                    <button
                        onClick={() => navigate('/')}
                        style={styles.btn}>
                        ← Analyze Another Resume
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        style={{...styles.btn, backgroundColor: '#1a1a2e'}}>
                        View History
                    </button>
                </div>

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
    loading: {
        textAlign: 'center',
        marginTop: '100px',
        fontSize: '18px',
        color: '#888',
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        marginBottom: '20px',
    },
    title: {
        color: '#1a1a2e',
        marginBottom: '20px',
    },
    scoreCircle: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px auto',
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white',
    },
    sectionTitle: {
        color: '#1a1a2e',
        marginBottom: '15px',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    strengthItem: {
        padding: '10px 15px',
        marginBottom: '8px',
        borderRadius: '8px',
        background: '#f0fff4',
        borderLeft: '4px solid #38ef7d',
        color: '#276749',
        fontSize: '14px',
    },
    missingItem: {
        padding: '10px 15px',
        marginBottom: '8px',
        borderRadius: '8px',
        background: '#fff5f5',
        borderLeft: '4px solid #e94560',
        color: '#c53030',
        fontSize: '14px',
    },
    suggestionItem: {
        padding: '10px 15px',
        marginBottom: '8px',
        borderRadius: '8px',
        background: '#fffbf0',
        borderLeft: '4px solid #ffd200',
        color: '#744210',
        fontSize: '14px',
    },
    actions: {
        display: 'flex',
        gap: '15px',
        marginBottom: '40px',
    },
    btn: {
        flex: 1,
        backgroundColor: '#e94560',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default ResultPage;