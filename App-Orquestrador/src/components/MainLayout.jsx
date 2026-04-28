import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-content">
        <Header />
        <main className="main-area">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
