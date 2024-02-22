import Button from '@mui/material/Button'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import './SignUp.css'
import { EMAIL_REGEXP, PASSWORD_REGEXP } from '../../lib/constants'
import InfoIcon from '@mui/icons-material/Info'
import { useNavigate } from 'react-router-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  email: string
  password: string
  confirmPassword: string
}

export const SignUp = () => {
  const navigate = useNavigate()

  const {
    control,
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

  // const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit: SubmitHandler<Inputs> = (data) => {

    // TODO
    console.log(data)
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
                      <IconButton>
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

          <Button variant='contained' className='w-full' type='submit' disabled={!isValid}>Sign Up</Button>
        </form >

        <Button variant='outlined' onClick={() => navigate('/sign-in')}>Or Sign In</Button>

      </div >
    </>
  )
}