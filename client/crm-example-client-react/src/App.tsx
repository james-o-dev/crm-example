import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Navigate, Route, Routes } from 'react-router-dom'
import { SignUp } from './pages/SignUp/SignUp'
import { SignIn } from './pages/SignIn/SignIn'

function App() {

  return (
    <>
      <Routes>
        <Route>
          {/* <Route index element={<Home />} /> */}
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />

          {/* Protected */}


          {/* Default/root */}
          <Route path='*' element={<Navigate to='/sign-up' replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
