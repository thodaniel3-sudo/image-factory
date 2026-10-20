import { useEffect, useState } from 'react';
import { checkHealth } from './api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    checkHealth()
      .then((data) => setBackendStatus(data.status === 'ok' ? 'Connected ✅' : 'Error ❌'))
      .catch(() => setBackendStatus('Disconnected ❌ (Is the backend running?)'));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f8' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
        <h2 style={{ marginTop: 0 }}>AI Image Factory</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>📊 Dashboard</li>
          <li style={{ padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>📝 Prompts</li>
          <li style={{ padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>🖼️ Gallery</li>
          <li style={{ padding: '10px 0', cursor: 'pointer' }}>⚙️ Settings</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ marginTop: 0 }}>Dashboard Overview</h1>
        
        {/* Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Backend Status</h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{backendStatus}</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Images Generated</h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>1</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Pending Jobs</h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>0</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>Welcome to your Factory</h2>
          <p>This is the beginning of your private admin dashboard. Soon, you will be able to manage prompts, view the AI gallery, and track your earnings here.</p>
        </div>

      </div>
    </div>
  );
}

export default App;
