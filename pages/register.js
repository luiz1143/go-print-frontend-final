import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Register() {
  const [userType, setUserType] = useState('client');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signup } = useAuth();
  
  // Dados do usuário
  const [userData, setUserData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Endereço
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Dados específicos de gráfica
    companyName: '',
    cnpj: '',
    description: '',
    
    // Dados específicos de entregador
    cpf: '',
    birthDate: '',
    
    // Serviços oferecidos (para gráficas)
    services: []
  });
  
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };
  
  const nextStep = () => {
    // Validação do primeiro passo
    if (step === 1) {
      if (!userData.name || !userData.email || !userData.phone || !userData.password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      if (userData.password !== userData.confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      
      setError('');
    }
    
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setUserData(prev => ({
        ...prev,
        services: [...prev.services, value]
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        services: prev.services.filter(service => service !== value)
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // 1. Criar usuário no Firebase Authentication
      const userCredential = await signup(userData.email, userData.password);
      const user = userCredential.user;
      
      // 2. Enviar dados adicionais para o backend (que salvará no Firestore)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          userType,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: {
            zipCode: userData.zipCode,
            street: userData.street,
            number: userData.number,
            complement: userData.complement,
            neighborhood: userData.neighborhood,
            city: userData.city,
            state: userData.state
          },
          // Dados específicos por tipo de usuário
          ...(userType === 'printer' && {
            companyName: userData.companyName,
            cnpj: userData.cnpj,
            description: userData.description,
            services: userData.services
          }),
          ...(userType === 'deliverer' && {
            cpf: userData.cpf,
            birthDate: userData.birthDate
          })
        })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar dados do usuário');
      }
      
      // 3. Redirecionar com base no tipo de usuário
      if (userType === 'client') {
        router.push('/marketplace');
      } else if (userType === 'printer') {
        router.push('/printer-dashboard');
      } else if (userType === 'deliverer') {
        router.push('/deliverer-dashboard');
      }
      
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError(err.message || 'Ocorreu um erro durante o cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Cadastre-se no Go Print</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <>
              <div className="flex justify-center mb-8">
                <div className="flex space-x-4">
                  <button
                    className={`px-6 py-3 rounded-md ${
                      userType === 'client' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleUserTypeChange('client')}
                  >
                    Cliente
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md ${
                      userType === 'printer' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleUserTypeChange('printer')}
                  >
                    Gráfica/Papelaria
                  </button>
                  <button
                    className={`px-6 py-3 rounded-md ${
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
                <h2 className="text-xl font-bold mb-6">Informações Pessoais</h2>
                
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiUser />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      className="form-input pl-10" 
                      placeholder="Digite seu nome completo"
                      value={userData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiMail />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      className="form-input pl-10" 
                      placeholder="Digite seu e-mail"
                      value={userData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiPhone />
                    </div>
                    <input 
                      type="tel" 
                      name="phone"
                      className="form-input pl-10" 
                      placeholder="(00) 00000-0000"
                      value={userData.phone}
                      onChange={handleChange}
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
                      name="password"
                      className="form-input pl-10" 
                      placeholder="Crie uma senha"
                      value={userData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirmar Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiLock />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      className="form-input pl-10" 
                      placeholder="Confirme sua senha"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={nextStep}
                  >
                    Continuar
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-secondary-600">
                    Já tem uma conta? <Link href="/login" className="text-primary-500 hover:text-primary-600">Entrar</Link>
                  </p>
                </div>
              </div>
            </>
          )}
          
          {step === 2 && userType === 'client' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Endereço</h2>
              
              <div className="form-group">
                <label className="form-label">CEP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiMapPin />
                  </div>
                  <input 
                    type="text" 
                    name="zipCode"
                    className="form-input pl-10" 
                    placeholder="00000-000"
                    value={userData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Rua</label>
                  <input 
                    type="text" 
                    name="street"
                    className="form-input" 
                    placeholder="Rua" 
                    value={userData.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Número</label>
                  <input 
                    type="text" 
                    name="number"
                    className="form-input" 
                    placeholder="Número" 
                    value={userData.number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Complemento</label>
                  <input 
                    type="text" 
                    name="complement"
                    className="form-input" 
                    placeholder="Complemento" 
                    value={userData.complement}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input 
                    type="text" 
                    name="neighborhood"
                    className="form-input" 
                    placeholder="Bairro" 
                    value={userData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-input" 
                    placeholder="Cidade" 
                    value={userData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <input 
                    type="text" 
                    name="state"
                    className="form-input" 
                    placeholder="Estado" 
                    value={userData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Voltar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && userType === 'printer' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Informações da Gráfica</h2>
              
              <div className="form-group">
                <label className="form-label">Nome da Empresa</label>
                <input 
                  type="text" 
                  name="companyName"
                  className="form-input" 
                  placeholder="Nome da sua gráfica ou papelaria" 
                  value={userData.companyName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">CNPJ</label>
                <input 
                  type="text" 
                  name="cnpj"
                  className="form-input" 
                  placeholder="00.000.000/0000-00" 
                  value={userData.cnpj}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea 
                  name="description"
                  className="form-input min-h-[100px]" 
                  placeholder="Descreva sua gráfica, serviços oferecidos, diferenciais, etc."
                  value={userData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">CEP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiMapPin />
                  </div>
                  <input 
                    type="text" 
                    name="zipCode"
                    className="form-input pl-10" 
                    placeholder="00000-000"
                    value={userData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Rua</label>
                  <input 
                    type="text" 
                    name="street"
                    className="form-input" 
                    placeholder="Rua" 
                    value={userData.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Número</label>
                  <input 
                    type="text" 
                    name="number"
                    className="form-input" 
                    placeholder="Número" 
                    value={userData.number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Complemento</label>
                  <input 
                    type="text" 
                    name="complement"
                    className="form-input" 
                    placeholder="Complemento" 
                    value={userData.complement}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input 
                    type="text" 
                    name="neighborhood"
                    className="form-input" 
                    placeholder="Bairro" 
                    value={userData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-input" 
                    placeholder="Cidade" 
                    value={userData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <input 
                    type="text" 
                    name="state"
                    className="form-input" 
                    placeholder="Estado" 
                    value={userData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Voltar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && userType === 'deliverer' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Informações do Entregador</h2>
              
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input 
                  type="text" 
                  name="cpf"
                  className="form-input" 
                  placeholder="000.000.000-00" 
                  value={userData.cpf}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Data de Nascimento</label>
                <input 
                  type="date" 
                  name="birthDate"
                  className="form-input" 
                  value={userData.birthDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">CEP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiMapPin />
                  </div>
                  <input 
                    type="text" 
                    name="zipCode"
                    className="form-input pl-10" 
                    placeholder="00000-000"
                    value={userData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Rua</label>
                  <input 
                    type="text" 
                    name="street"
                    className="form-input" 
                    placeholder="Rua" 
                    value={userData.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Número</label>
                  <input 
                    type="text" 
                    name="number"
                    className="form-input" 
                    placeholder="Número" 
                    value={userData.number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Complemento</label>
                  <input 
                    type="text" 
                    name="complement"
                    className="form-input" 
                    placeholder="Complemento" 
                    value={userData.complement}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input 
                    type="text" 
                    name="neighborhood"
                    className="form-input" 
                    placeholder="Bairro" 
                    value={userData.neighborhood}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-input" 
                    placeholder="Cidade" 
                    value={userData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <input 
                    type="text" 
                    name="state"
                    className="form-input" 
                    placeholder="Estado" 
                    value={userData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Voltar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && userType === 'printer' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Serviços Oferecidos</h2>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="impressao_pb"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('impressao_pb')}
                  />
                  <span>Impressão P&B</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="impressao_colorida"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('impressao_colorida')}
                  />
                  <span>Impressão Colorida</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="encadernacao"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('encadernacao')}
                  />
                  <span>Encadernação</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="plotagem"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('plotagem')}
                  />
                  <span>Plotagem</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="banner"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('banner')}
                  />
                  <span>Banner</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="cartao_visita"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('cartao_visita')}
                  />
                  <span>Cartão de Visita</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="flyer"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('flyer')}
                  />
                  <span>Flyer</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    value="adesivo"
                    onChange={handleServiceChange}
                    checked={userData.services.includes('adesivo')}
                  />
                  <span>Adesivo</span>
                </label>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button 
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Voltar
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
