import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { uploadFile } from '../lib/storageUtils'; // Importa a função de upload
import { FiUpload, FiDollarSign, FiCalendar, FiType, FiFileText } from 'react-icons/fi';

export default function CreateAuction() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [auctionData, setAuctionData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    specs: {
      // Exemplo de especificações, pode ser dinâmico
      material: '',
      quantity: '',
      size: '',
      color: '',
      finishing: ''
    },
    fileUrl: '' // URL do arquivo de referência
  });
  const [referenceFile, setReferenceFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redireciona se não estiver logado
  if (!currentUser) {
    // router.push('/login'); // Descomentar após testar
    // return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setAuctionData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceFile(file);
      setUploadProgress(0); // Reseta o progresso
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
        setError('Você precisa estar logado para criar um leilão.');
        return;
    }

    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);
      let fileUrl = '';

      // 1. Fazer upload do arquivo de referência, se houver
      if (referenceFile) {
        fileUrl = await uploadFile(
          referenceFile,
          'auction-files', // Pasta no Storage
          (progress) => setUploadProgress(progress) // Callback de progresso
        );
      }

      // 2. Enviar dados do leilão (incluindo fileUrl) para o backend
      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify({
          ...auctionData,
          budget: parseFloat(auctionData.budget), // Garante que o orçamento é número
          deadline: new Date(auctionData.deadline), // Converte para data
          fileUrl: fileUrl, // Adiciona a URL do arquivo
          userId: currentUser.uid, // Associa o leilão ao usuário logado
          status: 'open', // Status inicial
          createdAt: new Date()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o leilão no backend.');
      }

      // 3. Redirecionar após sucesso
      alert('Leilão criado com sucesso!');
      router.push('/auctions');

    } catch (err) {
      console.error('Erro ao criar leilão:', err);
      setError(err.message || 'Ocorreu um erro ao criar o leilão. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Criar Novo Leilão</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Título do Leilão</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                    <FiType />
                  </div>
                  <input
                    type="text"
                    name="title"
                    className="form-input pl-10"
                    placeholder="Ex: Impressão de 1000 Cartões de Visita"
                    value={auctionData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição Detalhada</label>
                <textarea
                  name="description"
                  className="form-input min-h-[120px]"
                  placeholder="Descreva o serviço que você precisa, incluindo o máximo de detalhes possível."
                  value={auctionData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Orçamento Máximo (R$)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiDollarSign />
                    </div>
                    <input
                      type="text"
                      name="budget"
                      className="form-input pl-10"
                      placeholder="Ex: 500.00 (Opcional)"
                      value={auctionData.budget}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Prazo Final para Entrega</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
                      <FiCalendar />
                    </div>
                    <input
                      type="date"
                      name="deadline"
                      className="form-input pl-10"
                      value={auctionData.deadline}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Especificações Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Material</label>
                    <input type="text" name="material" className="form-input" placeholder="Ex: Papel Couchê 300g" value={auctionData.specs.material} onChange={handleSpecsChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantidade</label>
                    <input type="text" name="quantity" className="form-input" placeholder="Ex: 1000 unidades" value={auctionData.specs.quantity} onChange={handleSpecsChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tamanho</label>
                    <input type="text" name="size" className="form-input" placeholder="Ex: 9x5 cm" value={auctionData.specs.size} onChange={handleSpecsChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cores</label>
                    <input type="text" name="color" className="form-input" placeholder="Ex: 4x4 (Colorido Frente e Verso)" value={auctionData.specs.color} onChange={handleSpecsChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Acabamento</label>
                    <input type="text" name="finishing" className="form-input" placeholder="Ex: Verniz Localizado, Laminação Fosca" value={auctionData.specs.finishing} onChange={handleSpecsChange} />
                  </div>
                  {/* Adicionar mais campos de especificação conforme necessário */}
                </div>
              </div>

              <div className="form-group mt-6 border-t pt-6">
                <label className="form-label">Arquivo de Referência (Opcional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Carregar um arquivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.cdr" />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG, AI, PSD, CDR até 25MB
                    </p>
                    {referenceFile && <p className="text-sm text-gray-700 mt-2">Arquivo selecionado: {referenceFile.name}</p>}
                  </div>
                </div>
                {loading && uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Criando Leilão...' : 'Criar Leilão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
