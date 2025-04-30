import React from 'react';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              Go Print
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-secondary-700 hover:text-primary-500">
                Início
              </Link>
              <Link href="/marketplace" className="text-secondary-700 hover:text-primary-500">
                Marketplace
              </Link>
              <Link href="/auctions" className="text-secondary-700 hover:text-primary-500">
                Leilões
              </Link>
              <Link href="/how-it-works" className="text-secondary-700 hover:text-primary-500">
                Como Funciona
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-secondary-700 hover:text-primary-500">
                Entrar
              </Link>
              <Link href="/register" className="btn btn-primary">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-secondary-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Go Print</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-secondary-300 hover:text-white">Sobre nós</Link></li>
                <li><Link href="/how-it-works" className="text-secondary-300 hover:text-white">Como funciona</Link></li>
                <li><Link href="/blog" className="text-secondary-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Para Clientes</h3>
              <ul className="space-y-2">
                <li><Link href="/register" className="text-secondary-300 hover:text-white">Cadastre-se</Link></li>
                <li><Link href="/marketplace" className="text-secondary-300 hover:text-white">Fazer pedido</Link></li>
                <li><Link href="/track" className="text-secondary-300 hover:text-white">Rastrear entrega</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Para Gráficas</h3>
              <ul className="space-y-2">
                <li><Link href="/partner" className="text-secondary-300 hover:text-white">Seja um parceiro</Link></li>
                <li><Link href="/printer-dashboard" className="text-secondary-300 hover:text-white">Painel de controle</Link></li>
                <li><Link href="/pricing" className="text-secondary-300 hover:text-white">Preços e taxas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Para Entregadores</h3>
              <ul className="space-y-2">
                <li><Link href="/deliverer" className="text-secondary-300 hover:text-white">Cadastre-se como entregador</Link></li>
                <li><Link href="/deliverer-app" className="text-secondary-300 hover:text-white">App do entregador</Link></li>
                <li><Link href="/earnings" className="text-secondary-300 hover:text-white">Ganhos e pagamentos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 mt-8 pt-4 text-center">
            <p>&copy; {new Date().getFullYear()} Go Print. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
