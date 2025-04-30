import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Fazer login com Firebase Auth
      await login(email, password);
      
      // Após login bem-sucedido, redirecionar com base no tipo de usuário
      if (userType === 'client') {
        router.push('/marketplace');
      } else if (userType === 'printer') {
        router.push('/printer-dashboard');
      } else if (userType === 'deliverer') {
        router.push('/deliverer-dashboard');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Entrar no Go Print</h1>
          
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  userType === 'client' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                }`}
                onClick={() => handleUserTypeChange('client')}
              >
                Cliente
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  userType === 'printer' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                }`}
                onClick={() => handleUserTypeChange('printer')}
              >
                Gráfica
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  userType === 'deliverer' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                }`}
                onClick={() => handleUserTypeChange('deliverer')}
              >
                Entregador
              </button>
            </div>
          </div>
          
          <div className="card">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiMail />
                  </div>
                  <input 
                    type="email" 
                    className="form-input pl-10" 
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiLock />
                  </div>
                  <input 
                    type="password" 
                    className="form-input pl-10" 
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-secondary-700">Lembrar-me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
                  Esqueceu a senha?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-secondary-600">
                  Não tem uma conta? <Link href="/register" className="text-primary-500 hover:text-primary-600">Cadastre-se</Link>
                </p>
              </div>
              
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-600">Ou entre com</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-gray-50"
                >
                  <span className="sr-only">Entrar com Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-gray-50"
                >
                  <span className="sr-only">Entrar com Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22,12.1c0-5.7-4.6-10.3-10.3-10.3S1.5,6.4,1.5,12.1c0,5.1,3.7,9.4,8.6,10.2v-7.2h-2.6v-3h2.6V9.9c0-2.5,1.5-3.9,3.8-3.9c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8l-0.4,3h-2.3v7.2C18.3,21.5,22,17.2,22,12.1z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-gray-50"
                >
                  <span className="sr-only">Entrar com Apple</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
