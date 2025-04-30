import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Go Print</h3>
            <ul>
              <li className="mb-2">
                <Link href="/about" className="text-secondary-300 hover:text-white">
                  Sobre nós
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/how-it-works" className="text-secondary-300 hover:text-white">
                  Como funciona
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/careers" className="text-secondary-300 hover:text-white">
                  Carreiras
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="text-secondary-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Para Clientes</h3>
            <ul>
              <li className="mb-2">
                <Link href="/register" className="text-secondary-300 hover:text-white">
                  Cadastre-se
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/marketplace" className="text-secondary-300 hover:text-white">
                  Fazer pedido
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/track" className="text-secondary-300 hover:text-white">
                  Rastrear entrega
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/support" className="text-secondary-300 hover:text-white">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Para Gráficas</h3>
            <ul>
              <li className="mb-2">
                <Link href="/partner" className="text-secondary-300 hover:text-white">
                  Seja um parceiro
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/printer-dashboard" className="text-secondary-300 hover:text-white">
                  Painel de controle
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/pricing" className="text-secondary-300 hover:text-white">
                  Preços e taxas
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/partner-support" className="text-secondary-300 hover:text-white">
                  Suporte para parceiros
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Para Entregadores</h3>
            <ul>
              <li className="mb-2">
                <Link href="/deliverer" className="text-secondary-300 hover:text-white">
                  Cadastre-se como entregador
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/deliverer-app" className="text-secondary-300 hover:text-white">
                  App do entregador
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/earnings" className="text-secondary-300 hover:text-white">
                  Ganhos e pagamentos
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/deliverer-support" className="text-secondary-300 hover:text-white">
                  Suporte para entregadores
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Go Print. Todos os direitos reservados.</p>
          <div className="flex mt-4 md:mt-0">
            <a href="#" className="text-secondary-300 hover:text-white mx-2">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="text-secondary-300 hover:text-white mx-2">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="text-secondary-300 hover:text-white mx-2">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="text-secondary-300 hover:text-white mx-2">
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
