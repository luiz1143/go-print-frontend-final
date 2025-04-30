import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Go Print - Marketplace de Serviços Gráficos</title>
        <meta name="description" content="Marketplace para gráficas e papelarias, oferecendo serviços de impressão sob demanda com sistema de leilão e entrega rápida." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
