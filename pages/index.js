import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiPrinter, FiFileText, FiCreditCard } from 'react-icons/fi';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Serviços gráficos sob demanda com entrega rápida</h1>
            <p className="text-xl mb-8">Conectamos você às melhores gráficas e papelarias da sua região para impressões, encadernações e muito mais.</p>
            <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center">
              <div className="flex items-center flex-grow mb-4 md:mb-0">
                <FiSearch className="text-secondary-500 mr-2" size={20} />
                <input 
                  type="text" 
                  placeholder="O que você precisa imprimir hoje?" 
                  className="w-full focus:outline-none text-secondary-800"
                />
              </div>
              <button className="btn btn-primary w-full md:w-auto">Buscar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Printers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Gráficas e Papelarias Próximas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-1">Gráfica Rápida Express</h3>
                <div className="text-yellow-500 mb-2">★★★★☆ 4.2</div>
                <div className="text-secondary-600 text-sm mb-2 flex items-start">
                  <FiMapPin className="mr-1 mt-1 flex-shrink-0" />
                  <span>Av. Paulista, 1000 - Bela Vista</span>
                </div>
                <div className="text-primary-500 text-sm">1.2 km de distância</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/marketplace" className="btn btn-primary">
              Ver todas as gráficas
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Serviços Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { icon: <FiFileText size={24} />, name: 'Impressão Colorida', price: 'A partir de R$ 1,50' },
              { icon: <FiFileText size={24} />, name: 'Encadernação', price: 'A partir de R$ 5,00' },
              { icon: <FiFileText size={24} />, name: 'Cartões de Visita', price: '100 un. por R$ 50,00' },
              { icon: <FiFileText size={24} />, name: 'Plotagem', price: 'A partir de R$ 15,00/m²' },
              { icon: <FiFileText size={24} />, name: 'Impressão de Documentos', price: 'A partir de R$ 0,25' },
              { icon: <FiFileText size={24} />, name: 'Banners', price: 'A partir de R$ 60,00' },
            ].map((service, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                  {service.icon}
                </div>
                <h3 className="font-bold mb-1">{service.name}</h3>
                <p className="text-secondary-600 text-sm">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Promoções</h2>
          <div className="space-y-6">
            {[
              { title: '50% OFF na primeira impressão', desc: 'Válido para novos usuários em pedidos acima de R$ 30,00', code: 'BEMVINDO50' },
              { title: 'Frete Grátis', desc: 'Em pedidos acima de R$ 50,00 para entregas até 5km', code: 'FRETEGRATIS' },
              { title: '10% OFF em Encadernações', desc: 'Válido para qualquer tipo de encadernação', code: 'ENCAD10' },
            ].map((promo, index) => (
              <div key={index} className="card flex flex-col md:flex-row items-center">
                <div className="w-full md:w-24 h-24 bg-primary-100 rounded-md flex items-center justify-center text-primary-500 mb-4 md:mb-0 md:mr-6">
                  <FiCreditCard size={32} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                  <p className="text-secondary-600 mb-2">{promo.desc}</p>
                  <div className="inline-block bg-gray-100 px-3 py-1 rounded border border-dashed border-gray-300 font-mono">
                    {promo.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                <FiSearch size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Escolha o serviço</h3>
              <p className="text-secondary-600">Navegue pelo marketplace e encontre o serviço gráfico que você precisa.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                <FiPrinter size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Envie seu arquivo</h3>
              <p className="text-secondary-600">Faça upload do seu arquivo e especifique os detalhes da impressão.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                <FiMapPin size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Receba onde estiver</h3>
              <p className="text-secondary-600">Acompanhe o status do seu pedido e receba-o no endereço escolhido.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn btn-primary">
              Saiba mais
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Cadastre-se agora e tenha acesso a serviços gráficos de qualidade com entrega rápida.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="btn bg-white text-primary-500 hover:bg-gray-100">
              Cadastre-se como cliente
            </Link>
            <Link href="/partner" className="btn bg-primary-600 text-white hover:bg-primary-700 border border-white">
              Seja uma gráfica parceira
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
