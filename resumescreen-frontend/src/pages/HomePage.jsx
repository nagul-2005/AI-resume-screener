import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function HomePage() {
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume || !jobDescription) {
            setError('Please upload resume and enter job description');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('job_description', jobDescription);

        try {
            const res = await API.post('/api/screen/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate(`/result/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>🎯 AI Resume Screener</h1>
                    <p style={styles.subtitle}>
                        Upload your resume and paste the job description
                        to get instant AI-powered analysis!
                    </p>

                    {error && <p style={styles.error}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                📄 Upload Resume (PDF only)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setResume(e.target.files[0])}
                                style={styles.fileInput}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                💼 Paste Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                style={styles.textarea}
                                placeholder="Paste the job description here..."
                                rows={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={styles.btn}
                            disabled={loading}>
                            {loading ? '⏳ Analyzing...' : '🚀 Analyze Resume'}
                        </button>
                    </form>
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
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
    },
    title: {
        color: '#1a1a2e',
        marginBottom: '10px',
    },
    subtitle: {
        color: '#888',
        marginBottom: '25px',
        fontSize: '14px',
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
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '8px',
        fontSize: '14px',
    },
    fileInput: {
        width: '100%',
        border: '2px dashed #e94560',
        padding: '15px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#fff5f5',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        resize: 'vertical',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit',
    },
    btn: {
        width: '100%',
        backgroundColor: '#e94560',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default HomePage;