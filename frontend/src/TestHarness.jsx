import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const routes = [
  '/parent/dashboard', '/parent/children', '/parent/tracking', '/parent/trips', '/parent/notifications', '/parent/emergency-contacts', '/parent/trusted-persons', '/parent/complaints',
  '/driver/dashboard', '/driver/scanner', '/driver/documents', '/driver/schedule', '/driver/vehicles', '/driver/trips',
  '/institution/dashboard', '/institution/students', '/institution/transport', '/institution/alerts', '/institution/reports',
  '/admin/dashboard', '/admin/drivers', '/admin/institutions', '/admin/vehicles', '/admin/users', '/admin/trips', '/admin/analytics', '/admin/complaints', '/admin/emergency'
];

export default function TestHarness() {
  const navigate = useNavigate();
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState([]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // Mock user for protected routes
    localStorage.setItem('user', JSON.stringify({ role: 'ADMIN', firstName: 'Admin', accessToken: 'test-token' }));
    
    const handleGlobalError = (event) => {
        setErrors(prev => [...prev, { route: routes[index], error: event.message || event.error?.message }]);
    };
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [index]);

  useEffect(() => {
    if (!running) return;
    
    if (index < routes?.length) {
      navigate(routes[index]);
      const timer = setTimeout(() => {
        setIndex(i => i + 1);
      }, 500); // 500ms per route
      return () => clearTimeout(timer);
    } else {
      setRunning(false);
      fetch('http://localhost:3333', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errors)
      }).catch(e => console.error(e));
      navigate('/audit-results');
    }
  }, [index, running, navigate]);

  if (!running && location.pathname === '/audit-results') {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 99999, padding: '40px', overflow: 'auto' }}>
        <h1 className="text-3xl font-bold mb-4">Audit Results</h1>
        <div id="audit-done">
            {errors?.length === 0 ? <p style={{color: 'green'}}>All routes rendered successfully without crashes!</p> : (
              <ul>
                  {errors?.map((e, i) => <li key={i} style={{color: 'red'}}><b>{e.route}:</b> {e.error}</li>)}
              </ul>
            )}
        </div>
      </div>
    );
  }

  return null;
}
