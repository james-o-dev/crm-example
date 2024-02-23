import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import './SignIn.css'
import { EMAIL_REGEXP } from '../../lib/constants'
import { useNavigate } from 'react-router-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { IBadResponse } from '../../lib/api'
import { signIn } from '../../services/auth.service'
import { IMuiDialogConfig, MuiErrorDialog } from '../../components/MuiDialog/MuiDialog'

type Inputs = {
  email: string
  password: string
}

export const SignIn = () => {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [dialogOpened, setDialogOpened] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<IMuiDialogConfig>({})

  const displayErrorDialog = (content?: string[] | undefined) => {
      setDialogConfig({
        content,
        onClose: () => setDialogOpened(false),
      })
    setDialogOpened(true)
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
      await signIn(formValue.email, formValue.password)
      navigate('/home')

    } catch (error) {
      if (error instanceof Response) {
        const { message } = await error.json() as IBadResponse
        displayErrorDialog([message])
      } else {
        displayErrorDialog()
      }
    } finally {
      setIsSubmitting(false)
    }
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
            rules={{ required: true }}
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
                {...field}
              />
            )}
          />

          <Button variant='contained' className='w-full' type='submit' disabled={!isValid || isSubmitting}>Sign In</Button>
        </form >

        <Button variant='outlined' onClick={() => navigate('/sign-up')}>Or Sign Up</Button>
      </div >

      <MuiErrorDialog open={dialogOpened} config={dialogConfig} />
    </>
  )
}