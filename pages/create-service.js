import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { uploadFile } from '../lib/storageUtils'; // Importa a função de upload
import { FiUpload, FiDollarSign, FiTag, FiType } from 'react-icons/fi';

export default function CreateService() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'impressoes', // Valor padrão
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redireciona se não estiver logado
  // Idealmente, verificar também se é do tipo 'printer'
  if (!currentUser) {
    // router.push('/login'); // Descomentar após testar
    // return null; // Evita renderizar o formulário brevemente
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Cria preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadProgress(0); // Reseta o progresso
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError('Por favor, selecione uma imagem para o serviço.');
      return;
    }
    
    if (!currentUser) {
        setError('Você precisa estar logado para criar um serviço.');
        return;
    }

    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);

      // 1. Fazer upload da imagem para o Firebase Storage
      const imageUrl = await uploadFile(
        imageFile, 
        'service-images', // Pasta no Storage
        (progress) => setUploadProgress(progress) // Callback de progresso
      );

      // 2. Enviar dados do serviço (incluindo imageUrl) para o backend
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Incluir token de autenticação se necessário no backend
          // 'Authorization': `Bearer ${await currentUser.getIdToken()}` 
        },
        body: JSON.stringify({
          ...serviceData,
          price: parseFloat(serviceData.price), // Garante que o preço é número
          imageUrl: imageUrl,
          printerId: currentUser.uid // Associa o serviço ao usuário logado
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o serviço no backend.');
      }

      // 3. Redirecionar após sucesso
      alert('Serviço criado com sucesso!');
      router.push('/marketplace'); // Ou para o dashboard da gráfica

    } catch (err) {
      console.error('Erro ao criar serviço:', err);
      setError(err.message || 'Ocorreu um erro ao criar o serviço. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Criar Novo Serviço</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Título do Serviço</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiType />
                  </div>
                  <input 
                    type="text" 
                    name="title"
                    className="form-input pl-10" 
                    placeholder="Ex: Impressão A4 Colorida Papel Couchê"
                    value={serviceData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea 
                  name="description"
                  className="form-input min-h-[120px]" 
                  placeholder="Descreva os detalhes do serviço, materiais, acabamentos, etc."
                  value={serviceData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Preço (R$)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiDollarSign />
                    </div>
                    <input 
                      type="text" // Usar text para permitir vírgula, mas converter para float no submit
                      name="price"
                      className="form-input pl-10" 
                      placeholder="Ex: 50.00"
                      value={serviceData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiTag />
                    </div>
                    <select 
                      name="category"
                      className="form-input pl-10 appearance-none" 
                      value={serviceData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="impressoes">Impressões</option>
                      <option value="encadernacoes">Encadernações</option>
                      <option value="cartoes">Cartões de Visita</option>
                      <option value="plotagens">Plotagens</option>
                      <option value="banners">Banners</option>
                      <option value="adesivos">Adesivos</option>
                      <option value="outros">Outros</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagem do Serviço</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto mb-4" />
                    ) : (
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label 
                        htmlFor="file-upload" 
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Carregar um arquivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB
                    </p>
                    {imageFile && <p className="text-sm text-gray-700 mt-2">Arquivo selecionado: {imageFile.name}</p>}
                  </div>
                </div>
                {loading && uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Criando Serviço...' : 'Criar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
