import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import './SignIn.css'
import { EMAIL_REGEXP, PASSWORD_REGEXP } from '../../lib/constants'
import { useNavigate } from 'react-router-dom'

export const SignIn = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [emailInvalid, setEmailInvalid] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)

  const [password, setPassword] = useState<string>('')
  const [passwordInvalid, setPasswordInvalid] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

  // const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation - email.
  useEffect(() => {
    if (emailFocused && !EMAIL_REGEXP.test(email)) setEmailInvalid('Invalid')
    else setEmailInvalid('')
  }, [email, emailFocused])

  // Validation - password.
  useEffect(() => {
    if (passwordFocused && !PASSWORD_REGEXP.test(password)) setPasswordInvalid('Invalid')
    else setPasswordInvalid('')
  }, [password, passwordFocused])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // If the form is invalid, return.

    // TODO
    console.log({ email, password })
  }

  return (
    <>
      <div className='sign-up-container'>
        <h1>CRM Example</h1>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant='outlined'
            required={true}
            type='email'
            name='email'
            label='Email'
            autoComplete='username'
            error={!!emailInvalid}
            helperText={emailInvalid || ' '}
            value={email}
            onFocus={() => setEmailFocused(true)}
            onChange={e => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            variant='outlined'
            required={true}
            type='password'
            name='password'
            label='Password'
            autoComplete='new-password'
            error={!!passwordInvalid}
            helperText={passwordInvalid || ' '}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
          />

          <Button variant='contained' className='w-full' type='submit'>Sign In</Button>
        </form >

        <Button variant='outlined' onClick={() => navigate('/sign-up')}>Or Sign Up</Button>
      </div >
    </>
  )
}