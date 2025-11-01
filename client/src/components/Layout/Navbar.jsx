import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    Blog App
                </Link>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/posts/new" style={styles.link}>New Post</Link>  {/* ← Changed from /create-post */}
                            <span style={styles.user}>Welcome, {user.username}</span>
                            <button onClick={logout} style={styles.button}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.link}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#333',
        padding: '1rem 0',
        marginBottom: '2rem'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none'
    },
    links: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        transition: 'opacity 0.2s'
    },
    user: {
        color: '#ccc'
    },
    button: {
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default Navbar;