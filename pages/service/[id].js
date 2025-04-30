import React, { useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import { FiUpload, FiPlus, FiMinus, FiCreditCard, FiMapPin, FiClock, FiX, FiFileText } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react'; // Assuming Chakra UI is used for toasts

// Mock data for service details (replace with actual data fetching)
const mockService = {
  id: 1,
  title: 'Impressão Colorida A4',
  printer: 'Gráfica Rápida Express',
  printerId: 'printer-123', // Add printerId
  serviceId: 'service-abc', // Add serviceId
  rating: 4.2,
  reviews: 120,
  price: 1.50,
  description: 'Serviço de impressão colorida em alta qualidade. Ideal para documentos, apresentações, folhetos e materiais promocionais.',
  options: {
    paper: [
      { id: 'sulfite', name: 'Sulfite 75g', price: 0 },
      { id: 'sulfite90', name: 'Sulfite 90g', price: 0.20 },
      { id: 'couche', name: 'Couché 115g', price: 0.50 },
      { id: 'fotog', name: 'Papel Fotográfico', price: 1.00 }
    ],
    color: [
      { id: 'pb', name: 'Preto e Branco', price: -1.00 },
      { id: 'colorido', name: 'Colorido', price: 0 }
    ],
    sides: [
      { id: 'frente', name: 'Frente', price: 0 },
      { id: 'frente-verso', name: 'Frente e Verso', price: 0.75 }
    ],
    size: [
      { id: 'a4', name: 'A4 (210 x 297 mm)', price: 0 },
      { id: 'a3', name: 'A3 (297 x 420 mm)', price: 1.50 },
      { id: 'carta', name: 'Carta (216 x 279 mm)', price: 0.25 }
    ]
  }
};

export default function ServiceDetail() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [selectedOptions, setSelectedOptions] = useState({
    paper: 'sulfite',
    color: 'colorido',
    sides: 'frente',
    size: 'a4'
  });

  // TODO: Fetch actual service data based on router.query.id
  const service = mockService; // Using mock data for now

  const onDrop = useCallback((acceptedFiles) => {
    // Limit to one file for simplicity, or handle multiple
    setSelectedFiles(acceptedFiles.slice(0, 1)); 
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false // Allow only one file
  });

  const removeFile = () => {
    setSelectedFiles([]);
  };

  const calculatePrice = () => {
    let basePrice = service.price;
    Object.keys(selectedOptions).forEach(optionType => {
      const selectedOption = service.options[optionType].find(
        opt => opt.id === selectedOptions[optionType]
      );
      if (selectedOption) {
        basePrice += selectedOption.price;
      }
    });
    return (basePrice * quantity).toFixed(2);
  };

  const handleOptionChange = (optionType, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionType]: optionId
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast({ title: "Erro", description: "Você precisa estar logado para fazer um pedido.", status: "error", duration: 5000, isClosable: true });
      return;
    }
    if (selectedFiles.length === 0) {
      toast({ title: "Erro", description: "Por favor, anexe o arquivo para impressão.", status: "error", duration: 5000, isClosable: true });
      return;
    }
    // Basic address validation
    if (!deliveryAddress.cep || !deliveryAddress.street || !deliveryAddress.number || !deliveryAddress.neighborhood || !deliveryAddress.city || !deliveryAddress.state) {
       toast({ title: "Erro", description: "Por favor, preencha o endereço de entrega completo.", status: "error", duration: 5000, isClosable: true });
       return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append order details
    formData.append('printerId', service.printerId);
    formData.append('serviceId', service.serviceId);
    formData.append('specifications', JSON.stringify(selectedOptions));
    formData.append('deliveryAddress', JSON.stringify(deliveryAddress));
    formData.append('pricing', JSON.stringify({ 
      basePrice: service.price, 
      optionsPrice: parseFloat(calculatePrice()) - (service.price * quantity), 
      quantity: quantity, 
      total: parseFloat(calculatePrice()) + 10 // Assuming fixed delivery fee
    }));
    formData.append('payment', JSON.stringify({ method: 'pending', status: 'pending' })); // Placeholder payment info

    // Append file
    formData.append('files', selectedFiles[0]); // Backend expects 'files'

    try {
      const response = await axios.post('/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header might be needed depending on your setup
          // 'Authorization': `Bearer ${currentUser.token}` 
        }
      });

      if (response.status === 201) {
        toast({ title: "Pedido Realizado!", description: "Seu pedido foi enviado com sucesso.", status: "success", duration: 5000, isClosable: true });
        // Redirect to order confirmation or user orders page
        router.push('/my-orders'); // Example redirect
      } else {
        throw new Error(response.data.message || 'Falha ao criar pedido');
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({ title: "Erro", description: error.response?.data?.message || "Não foi possível criar seu pedido.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Service Preview */}
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
            {/* ... (Service image and details - unchanged) ... */}
             <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500">Imagem do Serviço</span>
            </div>
            
            <div className="flex space-x-2 mb-6">
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">Imagem 1</span>
              </div>
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">Imagem 2</span>
              </div>
              <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">Imagem 3</span>
              </div>
            </div>
            
            <div className="card mb-6">
              <h2 className="font-bold text-lg mb-2">Descrição</h2>
              <p className="text-secondary-700">{service.description}</p>
            </div>
            
            <div className="card">
              <h2 className="font-bold text-lg mb-2">Sobre a Gráfica</h2>
              <h3 className="font-bold">{service.printer}</h3>
              <div className="flex items-center text-yellow-500 mb-2">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className={i < Math.floor(service.rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
                ))}
                <span className="ml-1 text-secondary-600">
                  {service.rating} ({service.reviews} avaliações)
                </span>
              </div>
              <p className="text-secondary-700 mb-2">
                <FiMapPin className="inline mr-1" /> Av. Paulista, 1000 - Bela Vista, São Paulo - SP
              </p>
              <p className="text-secondary-700">
                <FiClock className="inline mr-1" /> Tempo médio de produção: 1 dia útil
              </p>
            </div>
          </div>
          
          {/* Order Form */}
          <div className="lg:w-1/2">
            <div className="card">
              <h1 className="text-2xl font-bold mb-6">{service.title}</h1>
              
              {/* ... (Options sections - unchanged) ... */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Opções de Papel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.options.paper.map(option => (
                    <label 
                      key={option.id}
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        selectedOptions.paper === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="paper" 
                        value={option.id}
                        checked={selectedOptions.paper === option.id}
                        onChange={() => handleOptionChange('paper', option.id)}
                        className="mr-2"
                      />
                      <div>
                        <div>{option.name}</div>
                        <div className="text-sm text-secondary-600">
                          {option.price > 0 ? `+R$ ${option.price.toFixed(2)}` : 
                           option.price < 0 ? `-R$ ${Math.abs(option.price).toFixed(2)}` : 'Incluso'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Cor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.options.color.map(option => (
                    <label 
                      key={option.id}
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        selectedOptions.color === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="color" 
                        value={option.id}
                        checked={selectedOptions.color === option.id}
                        onChange={() => handleOptionChange('color', option.id)}
                        className="mr-2"
                      />
                      <div>
                        <div>{option.name}</div>
                        <div className="text-sm text-secondary-600">
                          {option.price > 0 ? `+R$ ${option.price.toFixed(2)}` : 
                           option.price < 0 ? `-R$ ${Math.abs(option.price).toFixed(2)}` : 'Incluso'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Impressão</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.options.sides.map(option => (
                    <label 
                      key={option.id}
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        selectedOptions.sides === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="sides" 
                        value={option.id}
                        checked={selectedOptions.sides === option.id}
                        onChange={() => handleOptionChange('sides', option.id)}
                        className="mr-2"
                      />
                      <div>
                        <div>{option.name}</div>
                        <div className="text-sm text-secondary-600">
                          {option.price > 0 ? `+R$ ${option.price.toFixed(2)}` : 
                           option.price < 0 ? `-R$ ${Math.abs(option.price).toFixed(2)}` : 'Incluso'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Tamanho</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.options.size.map(option => (
                    <label 
                      key={option.id}
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        selectedOptions.size === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="size" 
                        value={option.id}
                        checked={selectedOptions.size === option.id}
                        onChange={() => handleOptionChange('size', option.id)}
                        className="mr-2"
                      />
                      <div>
                        <div>{option.name}</div>
                        <div className="text-sm text-secondary-600">
                          {option.price > 0 ? `+R$ ${option.price.toFixed(2)}` : 
                           option.price < 0 ? `-R$ ${Math.abs(option.price).toFixed(2)}` : 'Incluso'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload Section - Updated */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Arquivo para Impressão</h2>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                >
                  <input {...getInputProps()} />
                  <FiUpload className="mx-auto text-secondary-500 mb-2" size={32} />
                  {isDragActive ? (
                    <p>Solte o arquivo aqui...</p>
                  ) : (
                    <p className="mb-2">Arraste e solte seu arquivo aqui ou clique para selecionar</p>
                  )}
                  <p className="text-sm text-secondary-600 mt-2">
                    Formatos: PDF, DOCX, JPG, PNG (máx. 20MB)
                  </p>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-3 border rounded-md p-3 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      <FiFileText className="text-secondary-500 mr-2" />
                      <span className="text-sm text-secondary-700">{selectedFiles[0].name}</span>
                    </div>
                    <button onClick={removeFile} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Quantity Section - Unchanged */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Quantidade</h2>
                <div className="flex items-center">
                  <button 
                    className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center"
                    onClick={decrementQuantity}
                  >
                    <FiMinus />
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center"
                  />
                  <button 
                    className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center"
                    onClick={incrementQuantity}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              
              {/* Delivery Address Section - Updated */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">Endereço de Entrega</h2>
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input type="text" name="cep" value={deliveryAddress.cep} onChange={handleAddressChange} className="form-input" placeholder="00000-000" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Rua</label>
                    <input type="text" name="street" value={deliveryAddress.street} onChange={handleAddressChange} className="form-input" placeholder="Rua" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número</label>
                    <input type="text" name="number" value={deliveryAddress.number} onChange={handleAddressChange} className="form-input" placeholder="Número" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Complemento</label>
                    <input type="text" name="complement" value={deliveryAddress.complement} onChange={handleAddressChange} className="form-input" placeholder="Complemento" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bairro</label>
                    <input type="text" name="neighborhood" value={deliveryAddress.neighborhood} onChange={handleAddressChange} className="form-input" placeholder="Bairro" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input type="text" name="city" value={deliveryAddress.city} onChange={handleAddressChange} className="form-input" placeholder="Cidade" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <input type="text" name="state" value={deliveryAddress.state} onChange={handleAddressChange} className="form-input" placeholder="Estado" />
                  </div>
                </div>
              </div>
              
              {/* Pricing Summary - Unchanged */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>R$ {calculatePrice()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Taxa de entrega:</span>
                  <span>R$ 10,00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {(parseFloat(calculatePrice()) + 10).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Submit Button - Updated */}
              <button 
                className="btn btn-primary w-full flex items-center justify-center" 
                onClick={handlePlaceOrder}
                disabled={loading || selectedFiles.length === 0}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando Pedido...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="mr-2" />
                    Finalizar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

