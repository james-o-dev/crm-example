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
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import { AccountCircle, Assignment, Backup, Group, Logout } from '@mui/icons-material'

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
  const { setAuthenticated, drawerOpen, setDrawerOpen } = useApp()

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

  const handleLogoClick = () => navigate('/home', { replace: true })

  const listItem = ({ icon, text, onClick }: { icon: JSX.Element, text: string, onClick: () => void }) => (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  )

  return authLoaded && (
    <>
      <AppBar component='nav'>
        <Toolbar>
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <span className='cursor-pointer' onClick={handleLogoClick}>CRM Example</span>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='persistent'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          {listItem({ text: 'Home', icon: <HomeIcon />, onClick: () => navigate('/home') })}
          {listItem({ text: 'Contacts', icon: <Group />, onClick: () => navigate('/todo') })}
          {listItem({ text: 'Tasks', icon: <Assignment />, onClick: () => navigate('/todo') })}
          {listItem({ text: 'Import / Export', icon: <Backup />, onClick: () => navigate('/todo') })}
          <Divider />
          {listItem({ text: 'Profile', icon: <AccountCircle />, onClick: () => {} })}
          {listItem({ text: 'Sign Out', icon: <Logout />, onClick: () => signOutLocally(navigate) })}
        </List>

      </Drawer>

      <Outlet />

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div>test</div>
    </>
  )
}

export default App
