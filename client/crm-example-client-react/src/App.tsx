import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Navigate, Route, Routes } from 'react-router-dom'
import { SignUp } from './pages/SignUp/SignUp'
import { SignIn } from './pages/SignIn/SignIn'
import CssBaseline from '@mui/material/CssBaseline'
import { Home } from './pages/Home/Home'

function App() {

  return (
    <>
      <CssBaseline />

      <Routes>
        <Route>
          <Route path='/home' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />

          {/* Protected */}


          {/* Default/root */}
          <Route path='*' element={<Navigate to='/home' replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
