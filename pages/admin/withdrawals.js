import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Flex, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
iimport { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminWithdrawalPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState({ available: 0, pending: 0 });
  const [bankAccount, setBankAccount] = useState({
    bankCode: '',
    agencyNumber: '',
    accountNumber: '',
    accountType: 'checking',
    holderName: '',
    holderDocument: ''
  });

  // Verificar se o usuário é admin
  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.push('/'); // Redirecionar se não for admin
    }
  }, [currentUser, authLoading, router]);

  // Buscar balanço da plataforma
  useEffect(() => {
    const fetchBalance = async () => {
      if (currentUser && currentUser.isAdmin) {
        try {
          setBalanceLoading(true);
          const response = await axios.get('/api/stripe/platform/balance');
          if (response.data.success) {
            setBalance(response.data.balance);
          }
        } catch (error) {
          console.error('Erro ao buscar balanço da plataforma:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível buscar o balanço da plataforma.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setBalanceLoading(false);
        }
      }
    };

    fetchBalance();
  }, [currentUser, toast]);

  // Função para solicitar saque do dono da plataforma
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
    
    // Validação básica dos dados bancários
    if (!bankAccount.bankCode || !bankAccount.agencyNumber || !bankAccount.accountNumber || !bankAccount.holderName || !bankAccount.holderDocument) {
      toast({
        title: 'Dados bancários incompletos',
        description: 'Por favor, preencha todos os dados da conta bancária.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/stripe/platform/withdrawals', {
        amount: parseFloat(amount),
        bankAccount: bankAccount
      });

      if (response.data.success) {
        toast({
          title: 'Saque solicitado',
          description: `Saque de R$ ${parseFloat(amount).toFixed(2)} para a conta informada foi solicitado com sucesso.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setAmount('');
        // Opcional: Atualizar balanço após saque
        const updatedBalance = await axios.get('/api/stripe/platform/balance');
        if (updatedBalance.data.success) {
          setBalance(updatedBalance.data.balance);
        }
      }
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Não foi possível processar o saque.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({ ...prev, [name]: value }));
  };

  // Renderizar estado de carregamento ou se não for admin
  if (authLoading || !currentUser || !currentUser.isAdmin) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={5}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Saque da Plataforma (Admin)</Heading>

        {/* Balanço da Plataforma */}
        <Box borderWidth={1} borderRadius="lg" p={5}>
          <Heading size="md" mb={4}>Balanço da Plataforma</Heading>
          {balanceLoading ? (
            <Spinner />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              <Stat>
                <StatLabel>Saldo Disponível</StatLabel>
                <StatNumber>R$ {balance.available.toFixed(2)}</StatNumber>
                <StatHelpText>Valor disponível para saque imediato.</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Saldo Pendente</StatLabel>
                <StatNumber>R$ {balance.pending.toFixed(2)}</StatNumber>
                <StatHelpText>Valor aguardando liberação.</StatHelpText>
              </Stat>
            </SimpleGrid>
          )}
        </Box>

        {/* Formulário de Saque */}
        <Box borderWidth={1} borderRadius="lg" p={5}>
          <Heading size="md" mb={4}>Solicitar Saque</Heading>
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
            
            <Heading size="sm" mt={4}>Dados da Conta Bancária</Heading>
            <FormControl id="holderName" isRequired>
              <FormLabel>Nome do Titular</FormLabel>
              <Input name="holderName" value={bankAccount.holderName} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="holderDocument" isRequired>
              <FormLabel>CPF/CNPJ do Titular</FormLabel>
              <Input name="holderDocument" value={bankAccount.holderDocument} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="bankCode" isRequired>
              <FormLabel>Código do Banco</FormLabel>
              <Input name="bankCode" value={bankAccount.bankCode} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="agencyNumber" isRequired>
              <FormLabel>Agência (sem dígito)</FormLabel>
              <Input name="agencyNumber" value={bankAccount.agencyNumber} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="accountNumber" isRequired>
              <FormLabel>Número da Conta (com dígito)</FormLabel>
              <Input name="accountNumber" value={bankAccount.accountNumber} onChange={handleInputChange} />
            </FormControl>
            {/* Tipo de conta pode ser um Select */}
            <FormControl id="accountType" isRequired>
              <FormLabel>Tipo da Conta</FormLabel>
              <Input name="accountType" value={bankAccount.accountType} onChange={handleInputChange} placeholder="checking ou savings"/>
            </FormControl>

            <Button 
              colorScheme="green" 
              isLoading={loading} 
              onClick={handleRequestWithdrawal}
              isDisabled={!amount || parseFloat(amount) <= 0 || balanceLoading || parseFloat(amount) > balance.available}
              mt={4}
            >
              Solicitar Saque
            </Button>
            {parseFloat(amount) > balance.available && (
              <Text color="red.500" fontSize="sm">Valor do saque excede o saldo disponível.</Text>
            )}
          </VStack>
        </Box>
        
        {/* TODO: Adicionar histórico de saques da plataforma */}

      </VStack>
    </Box>
  );
};

export default AdminWithdrawalPage;

