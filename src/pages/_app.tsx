import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { useWrappedStore } from '@/store'

// Create a client
const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  const { store, props } = useWrappedStore(pageProps)

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Layout>
            <Component {...props.pageProps} {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App

