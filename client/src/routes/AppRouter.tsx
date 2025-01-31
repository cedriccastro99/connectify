import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, useContext } from 'react'

import { routes } from './routes'
import ProtectedRoute from './ProtectedRoute'
import Loading from '@/components/Loading/Loading'
import { AuthContext } from '@/context/Auth/AuthContext'

//Router for ProtectedRoutes
const AppRouter = () => {

  const authContext = useContext(AuthContext)
  const { state } = authContext ?? {} 
  const { user } = state ?? {}

  const filteredRoutes = routes.filter(r => {
    const regex = /users/;
    if (regex.test(r.path) && user?.role !== 'admin') {
      return false
    }
    return true
  })

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {filteredRoutes.map(
          (route, index) =>
            route.protected && (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <route.component />
                  </ProtectedRoute>
                }
              />
            )
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

//create a new router for unprotect routes

export const UnprotectedRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map(
          (route, index) =>
            !route.protected && (
              <Route
                key={index}
                path={route.path}
                element={
                  <route.component />
                }
              />
            )
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
