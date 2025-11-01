import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};

const styles = {
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
    }
};

export default Layout;