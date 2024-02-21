import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import './SignUp.css'

export const SignUp = () => {

  // TODO.

  return (
    <>
      <div className='sign-up-container'>
        <h1>CRM Example</h1>

        <form>
          <TextField variant='outlined' required={true} type='email' name='email' label='Email'></TextField>

          <br />

          <TextField variant='outlined' required={true} type='password' name='password' label='Password'></TextField>

          <br />

          <TextField variant='outlined' required={true} type='password' name='confirmPassword' label='Confirm Password'></TextField>

          <br />

          <Button variant='contained' className='w-full'>Sign Up</Button>
        </form >

        <Button variant='outlined'>Or Sign In</Button>

      </div >
    </>
  )
}