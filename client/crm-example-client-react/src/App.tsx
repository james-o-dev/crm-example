import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Route, Routes } from 'react-router-dom'
import { SignUp } from './pages/SignUp'

function App() {

  return (
    <>
      <Routes>
        <Route path='/'>
          {/* <Route index element={<Home />} /> */}
          {/* <Route path='/sign-in' element={<SignIn />} /> */}
          <Route path='/sign-up' element={<SignUp />} />

          {/* Protected */}

        </Route>
      </Routes>
    </>
  )
}

export default App
