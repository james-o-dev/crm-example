import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import './SignUp.css'
import { EMAIL_REGEXP, PASSWORD_REGEXP, PASSWORD_REGEXP_MESSAGE } from '../../lib/constants'
import InfoIcon from '@mui/icons-material/Info'
import { useNavigate } from 'react-router-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { signUp } from '../../services/auth.service'
import { IBadResponse } from '../../lib/api'
import { useState } from 'react'
import { IMuiDialogConfig, MuiDialog, MuiErrorDialog } from '../../components/MuiDialog/MuiDialog'

interface Inputs {
  email: string
  password: string
  confirmPassword: string
}

export const SignUp = () => {
  const navigate = useNavigate()

  const {
    control,
    // reset,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorDialogConfig, setErrorDialogConfig] = useState<IMuiDialogConfig>({})

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordDialogConfig, setPasswordDialogConfig] = useState<IMuiDialogConfig>({})

  /**
   * Display dialog on an API error.
   *
   * @param {string[]} content Error message
   */
  const displayErrorDialog = (message?: string) => {
    const content = message ? [message] : undefined
    setErrorDialogConfig({
      content,
      onClose: () => setErrorDialogOpen(false),
    })
    setErrorDialogOpen(true)
  }

  /**
   * Submit the form to sign up
   *
   * @param {Inputs} formValue
   */
  const onSubmit: SubmitHandler<Inputs> = async (formValue: Inputs) => {
    if (isSubmitting || !isValid) return

    setIsSubmitting(true)
    try {
      await signUp(formValue.email, formValue.password, formValue.confirmPassword)
      navigate('/home')

    } catch (error) {
      if (error instanceof Response) {
        const { message } = await error.json() as IBadResponse
        displayErrorDialog(message)
      } else {
        displayErrorDialog()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Opens the password info dialog.
   */
  const handlePasswordDialog = () => {
    setPasswordDialogConfig({
      title: 'Password',
      content: [PASSWORD_REGEXP_MESSAGE],
      actions: [{ text: 'OK' }],
      onClose: () => setPasswordDialogOpen(false),
    })
    setPasswordDialogOpen(true)
  }

  return (
    <>
      <div className='sign-up-container'>
        <h1>CRM Example</h1>

        <form onSubmit={handleSubmit(onSubmit)}>

          <Controller
            name='email'
            control={control}
            rules={{ required: true, pattern: EMAIL_REGEXP }}
            render={({ field }) => (
              <TextField
                fullWidth
                variant='outlined'
                required={true}
                type='email'
                label='Email'
                autoComplete='username'
                error={!!errors.email}
                helperText={errors.email ? 'Invalid' : ' '}
                {...field}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            rules={{ required: true, pattern: PASSWORD_REGEXP }}
            render={({ field }) => (
              <TextField
                fullWidth
                variant='outlined'
                required={true}
                type='password'
                label='Password'
                autoComplete='new-password'
                error={!!errors.password}
                helperText={errors.password ? 'Invalid' : ' '}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handlePasswordDialog}>
                        <InfoIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...field}
              />)}
          />

          <Controller
            name='confirmPassword'
            control={control}
            rules={{ required: true, pattern: PASSWORD_REGEXP, validate: (value) => value === watch('password') || 'Passwords do not match' }}
            render={({ field }) => (
              <TextField
                fullWidth
                variant='outlined'
                required={true}
                type='password'
                label='Confirm Password'
                autoComplete='new-password'
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? 'Invalid' : ' '}
                {...field}
              />)}
          />

          <Button variant='contained' className='w-full' type='submit' disabled={!isValid || isSubmitting}>Sign Up</Button>
        </form >

        <Button variant='outlined' onClick={() => navigate('/sign-in')}>Or Sign In</Button>

      </div >

      <MuiErrorDialog open={errorDialogOpen} config={errorDialogConfig} />
      <MuiDialog open={passwordDialogOpen} config={passwordDialogConfig} />
    </>
  )
}