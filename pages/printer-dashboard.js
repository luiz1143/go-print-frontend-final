import React, { useState } from 'react';
import { FiHome, FiShoppingBag, FiUsers, FiDollarSign, FiSettings, FiLogOut, FiMenu, FiX, FiPrinter, FiPackage, FiCreditCard, FiStar, FiBarChart2, FiTag } from 'react-icons/fi';

export default function PrinterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
            className={`flex items-center px-4 py-3 ${activeTab === 'orders' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag size={20} />
            {sidebarOpen && <span className="ml-3">Pedidos</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'services' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('services')}
          >
            <FiPrinter size={20} />
            {sidebarOpen && <span className="ml-3">Serviços</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'auctions' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('auctions')}
          >
            <FiTag size={20} />
            {sidebarOpen && <span className="ml-3">Leilões</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'customers' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('customers')}
          >
            <FiUsers size={20} />
            {sidebarOpen && <span className="ml-3">Clientes</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'finances' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('finances')}
          >
            <FiDollarSign size={20} />
            {sidebarOpen && <span className="ml-3">Finanças</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activeTab === 'analytics' ? 'bg-primary-700' : 'hover:bg-primary-700'} cursor-pointer`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiBarChart2 size={20} />
            {sidebarOpen && <span className="ml-3">Análises</span>}
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
              {activeTab === 'orders' && 'Pedidos'}
              {activeTab === 'services' && 'Serviços'}
              {activeTab === 'auctions' && 'Leilões'}
              {activeTab === 'customers' && 'Clientes'}
              {activeTab === 'finances' && 'Finanças'}
              {activeTab === 'analytics' && 'Análises'}
              {activeTab === 'settings' && 'Configurações'}
            </h1>
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm text-gray-500">Gráfica</div>
                <div className="font-medium">Gráfica Rápida Express</div>
              </div>
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                GR
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                      <FiShoppingBag size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Pedidos Hoje</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ 8% em relação a ontem</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Faturamento Hoje</div>
                      <div className="text-2xl font-bold">R$ 850,00</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ 12% em relação a ontem</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Pedidos Pendentes</div>
                      <div className="text-2xl font-bold">8</div>
                    </div>
                  </div>
                  <div className="text-sm text-red-500 mt-2">↑ 2 desde ontem</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                      <FiStar size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avaliação Média</div>
                      <div className="text-2xl font-bold">4.8 ★</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-500 mt-2">↑ 0.2 no último mês</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                  <h2 className="text-lg font-bold mb-4">Pedidos Recentes</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">João Silva</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Impressão Colorida A4</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 45,00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12344</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Oliveira</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Encadernação</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 25,00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Em Produção
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12343</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carlos Santos</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cartões de Visita</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 120,00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Pronto para Entrega
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12342</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ana Pereira</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 180,00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Entregue
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button className="text-primary-500 hover:text-primary-700">Ver todos os pedidos →</button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold mb-4">Leilões Ativos</h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium">10.000 Flyers A5 Coloridos</div>
                      <div className="text-sm text-gray-500 mt-1">Prazo: 15/05/2025</div>
                      <div className="text-sm text-gray-500">Orçamento: Até R$ 2.000,00</div>
                      <div className="text-sm text-gray-500">Lances: 3</div>
                      <div className="mt-2">
                        <button className="text-primary-500 hover:text-primary-700">Ver detalhes →</button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium">500 Catálogos de Produtos</div>
                      <div className="text-sm text-gray-500 mt-1">Prazo: 30/05/2025</div>
                      <div className="text-sm text-gray-500">Orçamento: Até R$ 3.500,00</div>
                      <div className="text-sm text-gray-500">Lances: 1</div>
                      <div className="mt-2">
                        <button className="text-primary-500 hover:text-primary-700">Ver detalhes →</button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium">200 Camisetas Personalizadas</div>
                      <div className="text-sm text-gray-500 mt-1">Prazo: 10/06/2025</div>
                      <div className="text-sm text-gray-500">Orçamento: Até R$ 4.000,00</div>
                      <div className="text-sm text-gray-500">Lances: 0</div>
                      <div className="mt-2">
                        <button className="text-primary-500 hover:text-primary-700">Dar lance →</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <button className="text-primary-500 hover:text-primary-700">Ver todos os leilões →</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Content */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-bold">Pedidos</h2>
                  <div className="flex space-x-2">
                    <select className="border rounded-md px-3 py-2 text-sm">
                      <option>Todos os Status</option>
                      <option>Pendente</option>
                      <option>Em Produção</option>
                      <option>Pronto para Entrega</option>
                      <option>Em Entrega</option>
                      <option>Entregue</option>
                      <option>Cancelado</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Buscar pedidos..." 
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">João Silva</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Impressão Colorida A4</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 45,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pendente
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700 mr-2">Ver</button>
                          <button className="text-green-500 hover:text-green-700">Aceitar</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12344</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Oliveira</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Encadernação</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 25,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Em Produção
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700 mr-2">Ver</button>
                          <button className="text-green-500 hover:text-green-700">Concluir</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12343</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carlos Santos</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cartões de Visita</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 120,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Pronto para Entrega
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-500 hover:text-blue-700 mr-2">Ver</button>
                          <button className="text-purple-500 hover:text-purple-700">Entregar</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12342</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16/04/2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ana Pereira</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banner</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 180,00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
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
          
          {/* Services Content */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Meus Serviços</h2>
                <button className="bg-primary-500 text-white px-4 py-2 rounded-md">Adicionar Serviço</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Serviço</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Impressão Colorida A4</h3>
                    <div className="text-sm text-gray-500 mt-1">Preço: R$ 1,50 por página</div>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-sm text-gray-500 ml-1">(120 avaliações)</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="text-blue-500 hover:text-blue-700">Editar</button>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Ativo</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Serviço</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Encadernação Espiral</h3>
                    <div className="text-sm text-gray-500 mt-1">Preço: R$ 5,00 por unidade</div>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-sm text-gray-500 ml-1">(85 avaliações)</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="text-blue-500 hover:text-blue-700">Editar</button>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Ativo</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Serviço</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Cartões de Visita</h3>
                    <div className="text-sm text-gray-500 mt-1">Preço: R$ 50,00 por 100 unidades</div>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-sm text-gray-500 ml-1">(42 avaliações)</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="text-blue-500 hover:text-blue-700">Editar</button>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Ativo</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                  <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Serviço</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Plotagem A0</h3>
                    <div className="text-sm text-gray-500 mt-1">Preço: R$ 15,00 por m²</div>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-sm text-gray-500 ml-1">(63 avaliações)</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="text-blue-500 hover:text-blue-700">Editar</button>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Ativo</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" name="toggle" id="toggle4" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                          <label htmlFor="toggle4" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {(activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'services') && (
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
