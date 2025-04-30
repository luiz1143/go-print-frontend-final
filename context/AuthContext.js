import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; // Importa a instância do auth
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Cria o contexto
const AuthContext = createContext();

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor do contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função de login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Função de cadastro
  function signup(email, password) {
    // No backend, já criamos o usuário no Firestore ao criar no Auth.
    // Aqui, apenas criamos no Firebase Auth.
    return createUserWithEmailAndPassword(auth, email, password);
    // A lógica adicional (como salvar dados no Firestore) deve ser feita
    // após o cadastro bem-sucedido, chamando a API do backend.
  }

  // Função de logout
  function logout() {
    return firebaseSignOut(auth);
  }

  // Monitora mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
      // Aqui você poderia buscar dados adicionais do usuário no Firestore
      // usando o user.uid e atualizar um estado global mais completo, se necessário.
    });

    // Limpa o listener ao desmontar
    return unsubscribe;
  }, []);

  // Valor fornecido pelo contexto
  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading // Adiciona o estado de loading para saber quando a verificação inicial terminou
  };

  // Renderiza os filhos apenas quando o loading inicial terminar
  // Isso evita renderizações com estado de autenticação incorreto
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

