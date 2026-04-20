import { NavLink, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCreditCard, HiOutlinePlusCircle, HiOutlineCurrencyDollar, HiOutlineChartBar } from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <HiOutlineHome /> },
  { path: '/transactions', label: 'Transactions', icon: <HiOutlineCreditCard /> },
  { path: '/transactions/new', label: 'Add Transaction', icon: <HiOutlinePlusCircle /> },
  { path: '/budget', label: 'Budget', icon: <HiOutlineCurrencyDollar /> },
  { path: '/analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

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
      </aside>
    </>
  );
}
