import React from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuthContext, useAuthProvider } from './hooks/useAuth';

function App() {
  const authValue = useAuthProvider();

  return (
    <AuthContext.Provider value={authValue}>
      <div className="min-h-screen bg-gray-50">
        {authValue.user ? <Dashboard /> : <LoginPage />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;