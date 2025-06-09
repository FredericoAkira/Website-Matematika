import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './component/Toast/toaster'
import RouterApp from './router/RouterApp'

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterApp/>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
