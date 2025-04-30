// Atualização forçada para corrigir erro de importação no Vercel

import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Flex, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Forçando Vercel a pegar o commit mais recente 2

const WithdrawalPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  // Buscar informações da conta conectada do usuário
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAccountLoading(true);
        const response = await axios.get('/api/stripe/accounts/me');
        if (response.data.success) {
          setAccount(response.data.account);
        }
      } catch (error) {
        console.error('Erro ao buscar conta:', error);
      } finally {
        setAccountLoading(false);
      }
    };

    const fetchWithdrawalHistory = async () => {
      try {
        const response = await axios.get('/api/stripe/withdrawals');
        if (response.data.success) {
          setWithdrawalHistory(response.data.withdrawals);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico de saques:', error);
      }
    };

    if (currentUser) {
      fetchAccount();
      fetchWithdrawalHistory();
    }
  }, [currentUser]);

  // Função para criar uma conta conectada
  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stripe/accounts', {
        userId: currentUser.uid,
        type: currentUser.userType, // 'store' ou 'courier'
        email: currentUser.email,
        name: currentUser.name,
        document: currentUser.document || '',
        bankAccount: {
          // Estes dados seriam coletados de um formulário
          bankCode: '',
          agencyNumber: '',
          accountNumber: '',
          accountType: 'checking',
          holderName: currentUser.name,
          holderDocument: currentUser.document || ''
        }
      });

      if (response.data.success) {
        // Redirecionar para a URL de onboarding do Stripe
        window.location.href = response.data.onboardingUrl;
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Não foi possível criar sua conta de recebimento.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para solicitar um saque
  const handleRequestWithdrawal = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, informe um valor válido para saque.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/stripe/withdrawals', {
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        toast({
          title: 'Saque solicitado',
          description: `Seu saque de R$ ${parseFloat(amount).toFixed(2)} foi solicitado com sucesso.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setAmount('');
        
        // Atualizar histórico de saques
        const updatedHistory = [response.data.withdrawal, ...withdrawalHistory];
        setWithdrawalHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Não foi possível processar seu saque.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para completar o cadastro no Stripe
  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/stripe/accounts/${currentUser.uid}/link`);
      
      if (response.data.success) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erro ao criar link de onboarding:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o link para completar seu cadastro.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Renderizar estado de carregamento
  if (accountLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Renderizar página de criação de conta
  if (!account) {
    return (
      <Box p={5}>
        <VStack spacing={5} align="stretch">
          <Heading size="lg">Configurar Conta de Recebimento</Heading>
          <Text>
            Para receber seus pagamentos, você precisa configurar uma conta de recebimento.
            Isso permitirá que você solicite saques dos valores ganhos na plataforma.
          </Text>
          <Button 
            colorScheme="blue" 
            isLoading={loading} 
            onClick={handleCreateAccount}
          >
            Configurar Conta de Recebimento
          </Button>
        </VStack>
      </Box>
    );
  }

  // Renderizar página de saque (conta já existe)
  return (
    <Box p={5}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Solicitar Saque</Heading>
        
        {/* Status da conta */}
        {account.status !== 'active' && (
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <AlertTitle>Sua conta ainda não está ativa</AlertTitle>
              <AlertDescription>
                Você precisa completar o cadastro no Stripe para poder solicitar saques.
              </AlertDescription>
              <Button 
                mt={3} 
                colorScheme="yellow" 
                size="sm" 
                onClick={handleCompleteOnboarding}
                isLoading={loading}
              >
                Completar Cadastro
              </Button>
            </Box>
          </Alert>
        )}
        
        {/* Formulário de saque */}
        {account.status === 'active' && (
          <Box borderWidth={1} borderRadius="lg" p={5}>
            <VStack spacing={4} align="stretch">
              <FormControl id="amount" isRequired>
                <FormLabel>Valor do Saque (R$)</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </FormControl>
              <Button 
                colorScheme="green" 
                isLoading={loading} 
                onClick={handleRequestWithdrawal}
                isDisabled={!amount || parseFloat(amount) <= 0}
              >
                Solicitar Saque
              </Button>
            </VStack>
          </Box>
        )}
        
        {/* Histórico de saques */}
        <Box>
          <Heading size="md" mb={4}>Histórico de Saques</Heading>
          {withdrawalHistory.length === 0 ? (
            <Text>Você ainda não realizou nenhum saque.</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {withdrawalHistory.map((withdrawal) => (
                <Box 
                  key={withdrawal.id} 
                  p={3} 
                  borderWidth={1} 
                  borderRadius="md"
                  bg={
                    withdrawal.status === 'succeeded' || withdrawal.status === 'paid' 
                      ? 'green.50' 
                      : withdrawal.status === 'failed' || withdrawal.status === 'canceled'
                        ? 'red.50'
                        : 'gray.50'
                  }
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">
                        R$ {withdrawal.amount.toFixed(2)}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(withdrawal.createdAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </Box>
                    <Text 
                      fontWeight="medium"
                      color={
                        withdrawal.status === 'succeeded' || withdrawal.status === 'paid' 
                          ? 'green.500' 
                          : withdrawal.status === 'failed' || withdrawal.status === 'canceled'
                            ? 'red.500'
                            : 'orange.500'
                      }
                    >
                      {withdrawal.status === 'succeeded' || withdrawal.status === 'paid' 
                        ? 'Concluído' 
                        : withdrawal.status === 'failed' 
                          ? 'Falhou'
                          : withdrawal.status === 'canceled'
                            ? 'Cancelado'
                            : withdrawal.status === 'pending'
                              ? 'Pendente'
                              : 'Em processamento'}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default WithdrawalPage;
