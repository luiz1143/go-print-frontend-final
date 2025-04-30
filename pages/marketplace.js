import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiFilter, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export default function Marketplace() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    categories: ['impressoes'],
    priceMin: '',
    priceMax: '',
    rating: null,
    distance: '2'
  });
  const [sortBy, setSortBy] = useState('relevance');
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Opção 1: Buscar diretamente do Firestore (cliente)
        const servicesRef = collection(db, 'services');
        let servicesQuery = query(servicesRef);
        
        // Aplicar filtros se necessário
        if (filters.categories.length > 0) {
          servicesQuery = query(servicesQuery, where('category', 'in', filters.categories));
        }
        
        // Aplicar ordenação
        if (sortBy === 'price_asc') {
          servicesQuery = query(servicesQuery, orderBy('price', 'asc'));
        } else if (sortBy === 'price_desc') {
          servicesQuery = query(servicesQuery, orderBy('price', 'desc'));
        } else if (sortBy === 'rating') {
          servicesQuery = query(servicesQuery, orderBy('rating', 'desc'));
        }
        
        const querySnapshot = await getDocs(servicesQuery);
        const servicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setServices(servicesData);
        
        // Opção 2: Buscar através da API do backend
        // const response = await fetch('/api/services');
        // if (!response.ok) {
        //   throw new Error('Falha ao buscar serviços');
        // }
        // const data = await response.json();
        // setServices(data);
        
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [filters, sortBy]);
  
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== value)
      }));
    }
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating
    }));
  };
  
  const handleDistanceChange = (distance) => {
    setFilters(prev => ({
      ...prev,
      distance
    }));
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const applyFilters = () => {
    // Os filtros já são aplicados via useEffect quando filters ou sortBy mudam
    setFiltersOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <div className="ml-auto">
            <button 
              className="md:hidden flex items-center text-secondary-700 border border-secondary-300 rounded-md px-3 py-2"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <FiFilter className="mr-2" />
              Filtros
              {filtersOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 pr-8">
            <div className="sticky top-4">
              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Categorias</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      value="impressoes"
                      checked={filters.categories.includes('impressoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Impressões</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="encadernacoes"
                      checked={filters.categories.includes('encadernacoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Encadernações</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="cartoes"
                      checked={filters.categories.includes('cartoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Cartões de Visita</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="plotagens"
                      checked={filters.categories.includes('plotagens')}
                      onChange={handleCategoryChange}
                    />
                    <span>Plotagens</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="banners"
                      checked={filters.categories.includes('banners')}
                      onChange={handleCategoryChange}
                    />
                    <span>Banners</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="adesivos"
                      checked={filters.categories.includes('adesivos')}
                      onChange={handleCategoryChange}
                    />
                    <span>Adesivos</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Preço</h3>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    placeholder="Min" 
                    className="w-20 p-2 border border-secondary-300 rounded-md"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handlePriceChange}
                  />
                  <span className="mx-2">até</span>
                  <input 
                    type="text" 
                    placeholder="Max" 
                    className="w-20 p-2 border border-secondary-300 rounded-md"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Avaliação</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 5}
                      onChange={() => handleRatingChange(5)}
                    />
                    <span className="flex items-center">
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <span className="ml-1">5 estrelas</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 4}
                      onChange={() => handleRatingChange(4)}
                    />
                    <span className="flex items-center">
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-gray-300" />
                      <span className="ml-1">4+ estrelas</span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 3}
                      onChange={() => handleRatingChange(3)}
                    />
                    <span className="flex items-center">
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-yellow-500 fill-current" />
                      <FiStar className="text-gray-300" />
                      <FiStar className="text-gray-300" />
                      <span className="ml-1">3+ estrelas</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Distância</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance" 
                      className="mr-2"
                      checked={filters.distance === '2'}
                      onChange={() => handleDistanceChange('2')}
                    />
                    <span>Até 2 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance" 
                      className="mr-2"
                      checked={filters.distance === '5'}
                      onChange={() => handleDistanceChange('5')}
                    />
                    <span>Até 5 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance" 
                      className="mr-2"
                      checked={filters.distance === '10'}
                      onChange={() => handleDistanceChange('10')}
                    />
                    <span>Até 10 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance" 
                      className="mr-2"
                      checked={filters.distance === 'any'}
                      onChange={() => handleDistanceChange('any')}
                    />
                    <span>Qualquer distância</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          {filtersOpen && (
            <div className="md:hidden mb-6 p-4 border rounded-md bg-white">
              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Categorias</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="impressoes"
                      checked={filters.categories.includes('impressoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Impressões</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="encadernacoes"
                      checked={filters.categories.includes('encadernacoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Encadernações</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="cartoes"
                      checked={filters.categories.includes('cartoes')}
                      onChange={handleCategoryChange}
                    />
                    <span>Cartões de Visita</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="plotagens"
                      checked={filters.categories.includes('plotagens')}
                      onChange={handleCategoryChange}
                    />
                    <span>Plotagens</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="banners"
                      checked={filters.categories.includes('banners')}
                      onChange={handleCategoryChange}
                    />
                    <span>Banners</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      value="adesivos"
                      checked={filters.categories.includes('adesivos')}
                      onChange={handleCategoryChange}
                    />
                    <span>Adesivos</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Preço</h3>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    placeholder="Min" 
                    className="w-20 p-2 border border-secondary-300 rounded-md"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handlePriceChange}
                  />
                  <span className="mx-2">até</span>
                  <input 
                    type="text" 
                    placeholder="Max" 
                    className="w-20 p-2 border border-secondary-300 rounded-md"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Avaliação</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 5}
                      onChange={() => handleRatingChange(5)}
                    />
                    <span>★★★★★ 5 estrelas</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 4}
                      onChange={() => handleRatingChange(4)}
                    />
                    <span>★★★★☆ 4+ estrelas</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={filters.rating === 3}
                      onChange={() => handleRatingChange(3)}
                    />
                    <span>★★★☆☆ 3+ estrelas</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3 pb-2 border-b">Distância</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance-mobile" 
                      className="mr-2"
                      checked={filters.distance === '2'}
                      onChange={() => handleDistanceChange('2')}
                    />
                    <span>Até 2 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance-mobile" 
                      className="mr-2"
                      checked={filters.distance === '5'}
                      onChange={() => handleDistanceChange('5')}
                    />
                    <span>Até 5 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance-mobile" 
                      className="mr-2"
                      checked={filters.distance === '10'}
                      onChange={() => handleDistanceChange('10')}
                    />
                    <span>Até 10 km</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="distance-mobile" 
                      className="mr-2"
                      checked={filters.distance === 'any'}
                      onChange={() => handleDistanceChange('any')}
                    />
                    <span>Qualquer distância</span>
                  </label>
                </div>
              </div>

              <button 
                className="w-full btn btn-primary"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </button>
            </div>
          )}

          {/* Services List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-secondary-600">
                {loading ? 'Carregando serviços...' : `${services.length} serviços encontrados`}
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-secondary-600">Ordenar por:</span>
                <select 
                  className="p-2 border border-secondary-300 rounded-md"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevância</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                  <option value="rating">Maior avaliação</option>
                  <option value="distance">Menor distância</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-secondary-600">Nenhum serviço encontrado com os filtros selecionados.</p>
                    <p className="mt-2">Tente ajustar seus filtros ou buscar por outra categoria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div key={service.id} className="card hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {service.imageUrl ? (
                            <img 
                              src={service.imageUrl} 
                              alt={service.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">Imagem do Serviço</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                          <p className="text-secondary-600 mb-2">{service.printer}</p>
                          <div className="flex items-center text-yellow-500 mb-2">
                            {Array(5).fill(0).map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={i < Math.floor(service.rating || 0) ? "fill-current" : "text-gray-300"} 
                              />
                            ))}
                            <span className="ml-1 text-secondary-600">
                              {service.rating || 0} ({service.reviews || 0} avaliações)
                            </span>
                          </div>
                          <div className="font-bold text-primary-500 mb-4">
                            {typeof service.price === 'number' 
                              ? `R$ ${service.price.toFixed(2)}` 
                              : service.price || 'Preço sob consulta'}
                          </div>
                          <Link href={`/service/${service.id}`} className="btn btn-primary w-full">
                            Selecionar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {services.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex">
                  <a href="#" className="mx-1 px-3 py-2 bg-primary-500 text-white rounded-md">1</a>
                  <a href="#" className="mx-1 px-3 py-2 border border-secondary-300 rounded-md hover:bg-gray-100">2</a>
                  <a href="#" className="mx-1 px-3 py-2 border border-secondary-300 rounded-md hover:bg-gray-100">3</a>
                  <a href="#" className="mx-1 px-3 py-2 border border-secondary-300 rounded-md hover:bg-gray-100">4</a>
                  <a href="#" className="mx-1 px-3 py-2 border border-secondary-300 rounded-md hover:bg-gray-100">»</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
