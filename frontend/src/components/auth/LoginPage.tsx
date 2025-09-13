import React, { useState } from 'react';
import { LogIn, FileText, Brain, Shield, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials. Try: admin/password, hr_manager/password, finance_lead/password, or legal_counsel/password');
    }
  };

  const demoCredentials = [
    { username: 'admin', role: 'System Administrator', access: 'All Documents' },
    { username: 'hr_manager', role: 'HR Manager', access: 'HR Documents' },
    { username: 'finance_lead', role: 'Finance Lead', access: 'Financial Documents' },
    { username: 'legal_counsel', role: 'Legal Counsel', access: 'Legal Documents' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl mr-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">DocAI</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Document Intelligence
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Automatically classify, index, and search your documents with advanced AI technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <Brain className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Smart Classification</h3>
              <p className="text-sm text-gray-600">AI automatically categorizes documents</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <Search className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Semantic Search</h3>
              <p className="text-sm text-gray-600">Find documents by meaning, not just keywords</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <Shield className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Secure Access</h3>
              <p className="text-sm text-gray-600">Role-based permissions and access control</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <FileText className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Auto Extraction</h3>
              <p className="text-sm text-gray-600">Extract metadata and summaries automatically</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
              <p className="text-gray-600">Sign in to access your document workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h4>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <div
                    key={cred.username}
                    onClick={() => {
                      setUsername(cred.username);
                      setPassword('password');
                    }}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cred.username}</p>
                      <p className="text-xs text-gray-600">{cred.role}</p>
                    </div>
                    <span className="text-xs text-gray-500">{cred.access}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Password: "password" for all accounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};