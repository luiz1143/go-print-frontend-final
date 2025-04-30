import React, { useState } from 'react';
import { FiHome, FiShoppingBag, FiUsers, FiDollarSign, FiSettings, FiLogOut, FiMenu, FiX, FiMapPin, FiPackage, FiCreditCard, FiStar, FiBarChart2, FiTruck } from 'react-icons/fi';

export default function DelivererDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-primary-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="text-xl font-bold">Go Print</div>
          ) : (
            <div className="text-xl font-bold mx-auto">GP</div>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        
        <div className="mt-6">
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'dashboard' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome size={20} />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'deliveries' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('deliveries')}
          >
            <FiPackage size={20} />
            {sidebarOpen && <span className="ml-3">Entregas</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'map' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('map')}
          >
            <FiMapPin size={20} />
            {sidebarOpen && <span className="ml-3">Mapa</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'earnings' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('earnings')}
          >
            <FiDollarSign size={20} />
            {sidebarOpen && <span className="ml-3">Ganhos</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'vehicles' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('vehicles')}
          >
            <FiTruck size={20} />
            {sidebarOpen && <span className="ml-3">Veículos</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'settings' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings size={20} />
            {sidebarOpen && <span className="ml-3">Configurações</span>}
          </div>
          
          <div className="flex items-center px-4 py-3 hover:bg-primary-700 cursor-pointer mt-auto">
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'deliveries' && 'Entregas'}
              {activeTab === 'map' && 'Mapa'}
              {activeTab === 'earnings' && 'Ganhos'}
              {activeTab === 'vehicles' && 'Veículos'}
              {activeTab === 'settings' && 'Configurações'}
            </h1>
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm text-gray-500">Entregador</div>
                <div className="font-medium">Carlos Silva</div>
              </div>
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                CS
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="flex items-center mb-6">
                <div className="relative inline-block w-14 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="availability" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                    checked={isAvailable}
                    onChange={() => setIsAvailable(!isAvailable)}
                  />
                  <label htmlFor="availability" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <span className="font-medium">
                  {isAvailable ? 'Disponível para Entregas' : 'Indisponível para Entregas'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Entregas Hoje</div>
                      <div className="text-2xl font-bold">5</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ 2 em relação a ontem</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ganhos do Dia</div>
                      <div className="text-2xl font-bold">R$ 85,00</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ R$ 25,00 em relação a ontem</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ganhos do Mês</div>
                      <div className="text-2xl font-bold">R$ 1.240,00</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">Meta: R$ 2.000,00</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                      <FiStar size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avaliação Média</div>
                      <div className="text-2xl font-bold">4.9 ★</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ 0.1 em relação ao mês anterior</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Entregas Disponíveis</h2>
                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                  <span className="text-gray-500">[Mapa com Entregas Disponíveis]</span>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">Entrega #12345</div>
                        <div className="text-sm text-gray-500">Distância: 2.5 km</div>
                      </div>
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Disponível
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Retirada:</span> Gráfica Rápida Express - Av. Paulista, 1000
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Entrega:</span> Escritório ABC - Rua Augusta, 500
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Valor:</span> R$ 15,00
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tempo estimado:</span> 15 minutos
                      </div>
                    </div>
                    <button className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600">
                      Aceitar Entrega
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">Entrega #12346</div>
                        <div className="text-sm text-gray-500">Distância: 3.2 km</div>
                      </div>
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Disponível
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Retirada:</span> Papelaria Central - Rua Augusta, 500
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Entrega:</span> Residência - Rua Oscar Freire, 200
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Valor:</span> R$ 18,00
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tempo estimado:</span> 20 minutos
                      </div>
                    </div>
                    <button className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600">
                      Aceitar Entrega
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Entregas em Andamento</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">Entrega #12344</div>
                        <div className="text-sm text-gray-500">Distância: 4.8 km</div>
                      </div>
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        Aceita
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Retirada:</span> Gráfica Digital - Av. Rebouças, 1500
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Entrega:</span> Empresa XYZ - Av. Brigadeiro Faria Lima, 3000
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Valor:</span> R$ 22,00
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tempo estimado:</span> 25 minutos
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                        Confirmar Retirada
                      </button>
                      <button className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
                        Cancelar
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">Entrega #12343</div>
                        <div className="text-sm text-gray-500">Distância: 2.1 km</div>
                      </div>
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Retirado
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">Retirada:</span> Print & Copy - Rua Oscar Freire, 200
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Entrega:</span> Residência - Rua Haddock Lobo, 800
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Valor:</span> R$ 14,00
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tempo estimado:</span> 12 minutos
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                        Confirmar Entrega
                      </button>
                      <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400">
                        Problemas na Entrega
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Deliveries Content */}
          {activeTab === 'deliveries' && (
            <div>
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-bold">Histórico de Entregas</h2>
                  <div className="flex space-x-2">
                    <select className="border rounded-md px-3 py-2 text-sm">
                      <option>Todos os Status</option>
                      <option>Aceita</option>
                      <option>Retirada</option>
                      <option>Entregue</option>
                      <option>Cancelada</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Buscar entregas..." 
                      className="border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distância</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12342</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/04/2025 10:30</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gráfica Rápida Express</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Escritório DEF</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.5 km</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 18,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Entregue
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">Ver</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12341</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/04/2025 09:15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Papelaria Central</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Residência</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.8 km</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 16,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Entregue
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">Ver</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12340</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17/04/2025 16:45</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gráfica Digital</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Empresa ABC</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.2 km</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 20,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Entregue
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">Ver</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12339</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17/04/2025 14:20</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Print & Copy</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Escritório XYZ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.0 km</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 17,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Entregue
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700">Ver</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">Mostrando 1-4 de 24 resultados</div>
                  <div className="flex space-x-2">
                    <button className="border rounded-md px-3 py-1 text-sm">Anterior</button>
                    <button className="border rounded-md px-3 py-1 text-sm bg-primary-500 text-white">1</button>
                    <button className="border rounded-md px-3 py-1 text-sm">2</button>
                    <button className="border rounded-md px-3 py-1 text-sm">3</button>
                    <button className="border rounded-md px-3 py-1 text-sm">Próximo</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Map Content */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Mapa de Entregas</h2>
              <div className="h-96 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                <span className="text-gray-500">[Mapa com Entregas Disponíveis e em Andamento]</span>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Entregas Disponíveis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Entregas Aceitas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Sua Localização</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Entregas Próximas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Entrega #12345</div>
                      <div className="text-sm text-gray-500">2.5 km de distância</div>
                    </div>
                    <button className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm">
                      Ver Detalhes
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Entrega #12346</div>
                      <div className="text-sm text-gray-500">3.2 km de distância</div>
                    </div>
                    <button className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Earnings Content */}
          {activeTab === 'earnings' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ganhos do Dia</div>
                      <div className="text-2xl font-bold">R$ 85,00</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ganhos da Semana</div>
                      <div className="text-2xl font-bold">R$ 420,00</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ganhos do Mês</div>
                      <div className="text-2xl font-bold">R$ 1.240,00</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Histórico de Ganhos</h2>
                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                  <span className="text-gray-500">[Gráfico de Ganhos]</span>
                </div>
                <div className="flex justify-end">
                  <div className="flex space-x-2">
                    <button className="border rounded-md px-3 py-1 text-sm bg-primary-500 text-white">Diário</button>
                    <button className="border rounded-md px-3 py-1 text-sm">Semanal</button>
                    <button className="border rounded-md px-3 py-1 text-sm">Mensal</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Pagamentos</h2>
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-md">Sacar Ganhos</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#P12345</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saque para conta bancária</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 350,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Concluído
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#P12344</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saque para conta bancária</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 280,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Concluído
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#P12343</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saque para conta bancária</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 320,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Concluído
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {(activeTab !== 'dashboard' && activeTab !== 'deliveries' && activeTab !== 'map' && activeTab !== 'earnings') && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-lg font-bold mb-4">Conteúdo da aba {activeTab} em desenvolvimento</h2>
              <p className="text-gray-500">Esta funcionalidade estará disponível em breve.</p>
            </div>
          )}
        </main>
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #4a90e2;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4a90e2;
        }
      `}</style>
    </div>
  );
}
