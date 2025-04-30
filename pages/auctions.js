import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { FiClock, FiDollarSign, FiCalendar, FiFileText, FiUser, FiMapPin } from 'react-icons/fi';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Auctions() {
  const [activeTab, setActiveTab] = useState('open');
  const [bidFormVisible, setBidFormVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidData, setBidData] = useState({
    value: '',
    productionTime: '',
    deliveryTime: '',
    comments: ''
  });
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidError, setBidError] = useState('');
  
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        
        const auctionsRef = collection(db, 'auctions');
        let auctionsQuery;
        
        if (activeTab === 'open') {
          auctionsQuery = query(
            auctionsRef, 
            where('status', '==', 'open'),
            orderBy('endDate', 'asc')
          );
        } else if (activeTab === 'my-auctions' && currentUser) {
          auctionsQuery = query(
            auctionsRef, 
            where('userId', '==', currentUser.uid)
          );
        } else if (activeTab === 'my-bids' && currentUser) {
          // Para "Meus Lances", precisamos primeiro buscar os lances do usuário
          const bidsRef = collection(db, 'bids');
          const bidsQuery = query(
            bidsRef,
            where('userId', '==', currentUser.uid)
          );
          
          const bidsSnapshot = await getDocs(bidsQuery);
          const auctionIds = [...new Set(bidsSnapshot.docs.map(doc => doc.data().auctionId))];
          
          if (auctionIds.length === 0) {
            setAuctions([]);
            setLoading(false);
            return;
          }
          
          // Agora buscamos os leilões correspondentes
          auctionsQuery = query(
            auctionsRef,
            where('__name__', 'in', auctionIds)
          );
        } else {
          // Se não estiver logado e tentar ver "my-auctions" ou "my-bids"
          if (activeTab !== 'open') {
            setError('Você precisa estar logado para ver esta seção.');
            setAuctions([]);
            setLoading(false);
            return;
          }
          
          auctionsQuery = query(
            auctionsRef, 
            where('status', '==', 'open'),
            orderBy('endDate', 'asc')
          );
        }
        
        // Buscar os leilões
        const querySnapshot = await getDocs(auctionsQuery);
        
        // Array para armazenar as promessas de busca de lances
        const auctionsWithBidsPromises = querySnapshot.docs.map(async (auctionDoc) => {
          const auction = {
            id: auctionDoc.id,
            ...auctionDoc.data(),
            bids: []
          };
          
          // Buscar os lances para este leilão
          const bidsRef = collection(db, 'bids');
          const bidsQuery = query(
            bidsRef,
            where('auctionId', '==', auctionDoc.id),
            orderBy('value', 'asc')
          );
          
          const bidsSnapshot = await getDocs(bidsQuery);
          
          // Para cada lance, precisamos buscar informações da gráfica
          const bidsWithPrinterPromises = bidsSnapshot.docs.map(async (bidDoc) => {
            const bid = {
              id: bidDoc.id,
              ...bidDoc.data()
            };
            
            // Buscar informações da gráfica
            if (bid.userId) {
              const printerDoc = await getDoc(doc(db, 'users', bid.userId));
              if (printerDoc.exists()) {
                bid.printer = printerDoc.data().name || printerDoc.data().companyName || 'Gráfica';
              } else {
                bid.printer = 'Gráfica';
              }
            } else {
              bid.printer = 'Gráfica';
            }
            
            return bid;
          });
          
          // Aguardar todas as promessas de busca de informações de gráficas
          auction.bids = await Promise.all(bidsWithPrinterPromises);
          
          return auction;
        });
        
        // Aguardar todas as promessas de busca de lances
        const auctionsWithBids = await Promise.all(auctionsWithBidsPromises);
        
        setAuctions(auctionsWithBids);
        
      } catch (err) {
        console.error('Erro ao buscar leilões:', err);
        setError('Não foi possível carregar os leilões. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctions();
    
    // Configurar listener para atualizações em tempo real
    const unsubscribe = onSnapshot(collection(db, 'bids'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const newBid = {
            id: change.doc.id,
            ...change.doc.data()
          };
          
          // Atualizar o estado dos leilões com o novo lance
          setAuctions(prevAuctions => {
            return prevAuctions.map(auction => {
              if (auction.id === newBid.auctionId) {
                // Verificar se o lance já existe
                const bidIndex = auction.bids.findIndex(bid => bid.id === newBid.id);
                
                if (bidIndex >= 0) {
                  // Atualizar lance existente
                  const updatedBids = [...auction.bids];
                  updatedBids[bidIndex] = newBid;
                  return {
                    ...auction,
                    bids: updatedBids
                  };
                } else {
                  // Adicionar novo lance
                  return {
                    ...auction,
                    bids: [...auction.bids, newBid]
                  };
                }
              }
              return auction;
            });
          });
        }
      });
    });
    
    // Limpar listener ao desmontar
    return () => unsubscribe();
    
  }, [activeTab, currentUser]);
  
  const handleBidClick = (auction) => {
    if (!currentUser) {
      // Redirecionar para login se não estiver autenticado
      router.push('/login');
      return;
    }
    
    setSelectedAuction(auction);
    setBidFormVisible(true);
    // Limpar dados do formulário
    setBidData({
      value: '',
      productionTime: '',
      deliveryTime: '',
      comments: ''
    });
    setBidError('');
    
    // Scroll to bid form
    setTimeout(() => {
      document.getElementById('bid-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setBidError('Você precisa estar logado para dar um lance.');
      return;
    }
    
    if (!selectedAuction) {
      setBidError('Nenhum leilão selecionado.');
      return;
    }
    
    if (!bidData.value || !bidData.productionTime || !bidData.deliveryTime) {
      setBidError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setSubmittingBid(true);
      setBidError('');
      
      // Adicionar lance ao Firestore
      const bidRef = collection(db, 'bids');
      await addDoc(bidRef, {
        auctionId: selectedAuction.id,
        userId: currentUser.uid,
        value: parseFloat(bidData.value),
        productionTime: parseInt(bidData.productionTime),
        deliveryTime: parseInt(bidData.deliveryTime),
        comments: bidData.comments,
        createdAt: new Date()
      });
      
      // Fechar formulário
      setBidFormVisible(false);
      setSelectedAuction(null);
      
      // Mostrar mensagem de sucesso
      alert('Lance enviado com sucesso!');
      
    } catch (err) {
      console.error('Erro ao enviar lance:', err);
      setBidError('Ocorreu um erro ao enviar seu lance. Por favor, tente novamente.');
    } finally {
      setSubmittingBid(false);
    }
  };
  
  const handleAcceptBid = async (auction, bid) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Verificar se o usuário é o dono do leilão
    if (auction.userId !== currentUser.uid) {
      alert('Apenas o criador do leilão pode aceitar lances.');
      return;
    }
    
    try {
      // Atualizar status do leilão para 'closed'
      await fetch(`/api/auctions/${auction.id}/accept-bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bidId: bid.id
        })
      });
      
      // Atualizar UI
      setAuctions(prevAuctions => {
        return prevAuctions.map(a => {
          if (a.id === auction.id) {
            return {
              ...a,
              status: 'closed',
              winningBidId: bid.id
            };
          }
          return a;
        });
      });
      
      alert('Lance aceito com sucesso!');
      
    } catch (err) {
      console.error('Erro ao aceitar lance:', err);
      alert('Ocorreu um erro ao aceitar o lance. Por favor, tente novamente.');
    }
  };

  // Função para formatar a data
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função para calcular tempo restante
  const calculateTimeLeft = (endDate) => {
    if (!endDate) return 'Prazo não definido';
    
    const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Encerrado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''}`;
    } else {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sistema de Leilão</h1>
        
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 ${activeTab === 'open' ? 'border-b-2 border-primary-500 font-bold text-primary-500' : 'text-secondary-600'}`}
            onClick={() => setActiveTab('open')}
          >
            Leilões Abertos
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'my-auctions' ? 'border-b-2 border-primary-500 font-bold text-primary-500' : 'text-secondary-600'}`}
            onClick={() => setActiveTab('my-auctions')}
          >
            Meus Leilões
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'my-bids' ? 'border-b-2 border-primary-500 font-bold text-primary-500' : 'text-secondary-600'}`}
            onClick={() => setActiveTab('my-bids')}
          >
            Meus Lances
          </button>
        </div>
        
        <Link href="/create-auction" className="inline-block mb-8 btn btn-primary">
          Criar Novo Leilão
        </Link>
        
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
            {auctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-secondary-600">
                  {activeTab === 'open' 
                    ? 'Não há leilões abertos no momento.' 
                    : activeTab === 'my-auctions' 
                      ? 'Você ainda não criou nenhum leilão.' 
                      : 'Você ainda não deu nenhum lance.'}
                </p>
                {activeTab === 'open' && (
                  <Link href="/create-auction" className="mt-4 inline-block btn btn-primary">
                    Criar um Leilão
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {auctions.map((auction) => (
                  <div key={auction.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold">{auction.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        auction.status === 'open' 
                          ? 'bg-blue-100 text-blue-800' 
                          : auction.status === 'closed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {auction.status === 'open' ? 'Aberto' : auction.status === 'closed' ? 'Finalizado' : auction.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row mb-6">
                      <div className="md:w-2/3 md:pr-6 mb-4 md:mb-0">
                        <p className="text-secondary-700 mb-4">{auction.description}</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-secondary-600">
                            <FiDollarSign className="mr-1" />
                            <span><strong>Orçamento:</strong> {auction.budget}</span>
                          </div>
                          <div className="flex items-center text-secondary-600">
                            <FiCalendar className="mr-1" />
                            <span><strong>Prazo:</strong> {formatDate(auction.deadline)}</span>
                          </div>
                          <div className="flex items-center text-secondary-600">
                            <FiClock className="mr-1" />
                            <span><strong>Leilão encerra em:</strong> {calculateTimeLeft(auction.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-1/3 bg-gray-50 p-4 rounded-md">
                        <h3 className="font-bold mb-2">Especificações</h3>
                        <ul className="space-y-1">
                          {auction.specs && Object.entries(auction.specs).map(([key, value]) => (
                            <li key={key} className="text-sm">
                              <strong className="capitalize">{key}:</strong> {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Lances Recebidos</h3>
                        <span className="text-sm text-secondary-600">{auction.bids.length} lances</span>
                      </div>
                      
                      <div className="space-y-3">
                        {auction.bids.length === 0 ? (
                          <p className="text-secondary-600">Nenhum lance recebido ainda.</p>
                        ) : (
                          auction.bids.map((bid) => (
                            <div key={bid.id} className="border rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div>
                                <div className="font-bold mb-1">{bid.printer}</div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <span><strong>Valor:</strong> R$ {bid.value.toFixed(2)}</span>
                                  <span><strong>Tempo de produção:</strong> {bid.productionTime} dias</span>
                                  <span><strong>Entrega:</strong> {bid.deliveryTime} dias</span>
                                </div>
                                {bid.comments && (
                                  <div className="mt-2 text-sm text-secondary-600">
                                    <strong>Comentários:</strong> {bid.comments}
                                  </div>
                                )}
                              </div>
                              {auction.status === 'open' && auction.userId === currentUser?.uid && (
                                <div className="flex mt-3 md:mt-0">
                                  <button 
                                    className="btn bg-green-500 hover:bg-green-600 text-white mr-2"
                                    onClick={() => handleAcceptBid(auction, bid)}
                                  >
                                    Aceitar Lance
                                  </button>
                                  <button className="btn btn-secondary">
                                    Contatar
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      
                      {auction.status === 'open' && (
                        <div className="mt-6">
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleBidClick(auction)}
                          >
                            Dar Lance
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {bidFormVisible && selectedAuction && (
          <div id="bid-form" className="card mt-8">
            <h2 className="text-xl font-bold mb-4">Dar Lance para "{selectedAuction.title}"</h2>
            
            {bidError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {bidError}
              </div>
            )}
            
            <form onSubmit={handleBidSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Valor do Lance (R$)</label>
                  <input 
                    type="text" 
                    name="value"
                    className="form-input" 
                    placeholder="Ex: 1800.00" 
                    value={bidData.value}
                    onChange={handleBidChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tempo de Produção (dias)</label>
                  <input 
                    type="number" 
                    name="productionTime"
                    className="form-input" 
                    placeholder="Ex: 5" 
                    value={bidData.productionTime}
                    onChange={handleBidChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tempo de Entrega (dias)</label>
                  <input 
                    type="number" 
                    name="deliveryTime"
                    className="form-input" 
                    placeholder="Ex: 2" 
                    value={bidData.deliveryTime}
                    onChange={handleBidChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comentários Adicionais</label>
                <textarea 
                  name="comments"
                  className="form-input min-h-[100px]" 
                  placeholder="Descreva detalhes adicionais sobre seu lance, como especificações técnicas, garantias, etc."
                  value={bidData.comments}
                  onChange={handleBidChange}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submittingBid}
              >
                {submittingBid ? 'Enviando...' : 'Enviar Lance'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
