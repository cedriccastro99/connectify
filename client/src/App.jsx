import Layout from '@/Layout/Layout'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import AppRouter, { UnprotectedRouter } from '@/routes/AppRouter.tsx'
import { AuthContext } from '@/context/Auth/AuthContext'
import { useContext } from 'react'
import { Toaster } from "@/components/ui/toaster"
import Loading from './components/Loading/Loading'

const App = () => {
  const authContext = useContext(AuthContext)

  const { state, actions } = authContext ?? {}
  const { loading, isAuthenticated } = state ?? {}

  return (
    <>
      <Router>
        {loading ? <Loading /> : 
          (!isAuthenticated ? (
            <UnprotectedRouter />
          ) : (
            <Layout>
              <AppRouter />
            </Layout>
          ))
        }
      </Router>
      <Toaster/>
    </>
  )
}

export default App
