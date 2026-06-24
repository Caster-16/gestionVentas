import React from 'react';
import '../styles/header.css'; 
import { Menu, Bell } from 'lucide-react';

export default function Header({ 
  setShowMobileSidebar, 
  notificationCount, 
  setNotificationCount 
}) {
  return (
    <header className="main-header">
      <div className="header-left">
        <button 
          onClick={() => setShowMobileSidebar(true)} 
          className="btn-menu-toggle md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1>Portal de Ventas</h1>
          <p className="hidden sm:block">Monitorea y gestiona tus metas comerciales</p>
        </div>
      </div>
      
      <div className="header-right">
        <div className="notification-wrapper">
          <button onClick={() => setNotificationCount(0)} className="btn-notification">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
          </button>
        </div>
        <div className="user-quick-profile">
          <span>Admin</span>
          <div className="profile-avatar" style={{ width: '2.25rem', height: '2.25rem' }}>A</div>
        </div>
      </div>
    </header>
  );
}