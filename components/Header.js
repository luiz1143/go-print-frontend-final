import React from 'react';
import Link from 'next/link';
import { FiUser, FiShoppingCart, FiMenu } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              Go Print
            </Link>
            <nav className="hidden md:flex ml-8">
              <Link href="/" className="mx-3 text-secondary-700 hover:text-primary-500">
                Início
              </Link>
              <Link href="/marketplace" className="mx-3 text-secondary-700 hover:text-primary-500">
                Marketplace
              </Link>
              <Link href="/auctions" className="mx-3 text-secondary-700 hover:text-primary-500">
                Leilões
              </Link>
              <Link href="/how-it-works" className="mx-3 text-secondary-700 hover:text-primary-500">
                Como Funciona
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login" className="mx-2 text-secondary-700 hover:text-primary-500">
              Entrar
            </Link>
            <Link href="/register" className="mx-2 btn btn-primary">
              Cadastrar
            </Link>
          </div>
          <button 
            className="md:hidden text-secondary-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiMenu size={24} />
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col">
              <Link href="/" className="py-2 text-secondary-700 hover:text-primary-500">
                Início
              </Link>
              <Link href="/marketplace" className="py-2 text-secondary-700 hover:text-primary-500">
                Marketplace
              </Link>
              <Link href="/auctions" className="py-2 text-secondary-700 hover:text-primary-500">
                Leilões
              </Link>
              <Link href="/how-it-works" className="py-2 text-secondary-700 hover:text-primary-500">
                Como Funciona
              </Link>
              <div className="flex mt-4">
                <Link href="/login" className="mr-2 text-secondary-700 hover:text-primary-500">
                  Entrar
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Cadastrar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
