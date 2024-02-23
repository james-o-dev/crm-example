import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { SignUp } from './pages/SignUp/SignUp'
import { SignIn } from './pages/SignIn/SignIn'
import CssBaseline from '@mui/material/CssBaseline'
import { AppProvider } from './providers/AppProvider'
import { useState, useEffect } from 'react'
import { useApp } from './contexts/AppContext'
import { isAuthenticated, signOutLocally } from './services/auth.service'
import { Home } from './pages/Home/Home'

function App() {

  return (
    <AppProvider>
      <CssBaseline />

      <Routes>
        {/* Unprotected */}
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

        {/* Protected */}
        <Route element={<AuthenticatedArea />}>
          <Route path='/home' element={<Home />} />
        </Route>

        {/* Default/root */}
        <Route path='*' element={<Navigate to='/home' replace />} />
      </Routes>
    </AppProvider>
  )
}

/**
 * Routes under this element require authentication.
 * * If not authenticated, sign out locally and redirect to the sign-in page.
 * * Shared elements that are only displayed if authenticated (i.e. top bar, side drawer) should be contained within.
 */
const AuthenticatedArea = () => {
  const [authLoaded, setAuthLoaded] = useState(false)
  const navigate = useNavigate()
  const { setAuthenticated } = useApp()

  useEffect(() => {
    const request = async () => {
      // Make request.
      const auth = await isAuthenticated()
      setAuthenticated(auth)
      // Not authenticated; Inject/provide the navigation function.
      if (!auth) signOutLocally(navigate)
      // Authenticated and loaded.
      else setAuthLoaded(true)
    }
    // Async function.
    request()
  }, [navigate, setAuthenticated])

  return (
    // TODO App bar.
    // TODO drawer.
    authLoaded && <Outlet />
  )
}

export default App
