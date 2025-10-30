import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="main-layout">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <Navbar onMenuClick={toggleSidebar} />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
