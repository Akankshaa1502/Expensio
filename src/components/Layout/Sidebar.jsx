import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCreditCard, HiOutlinePlusCircle, HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <HiOutlineHome /> },
  { path: '/transactions', label: 'Transactions', icon: <HiOutlineCreditCard /> },
  { path: '/transactions/new', label: 'Add Transaction', icon: <HiOutlinePlusCircle /> },
  { path: '/budget', label: 'Budget', icon: <HiOutlineCurrencyDollar /> },
  { path: '/analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">E</div>
          <h1>Expensio</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/transactions'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User profile & logout */}
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="sidebar-avatar-img" referrerPolicy="no-referrer" />
            ) : (
              <div className="sidebar-avatar">{getInitials()}</div>
            )}
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{getDisplayName()}</span>
              <span className="sidebar-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Sign out">
            <HiOutlineLogout />
          </button>
        </div>
      </aside>
    </>
  );
}
