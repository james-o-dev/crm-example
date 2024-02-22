import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Dialog from '@mui/material/Dialog'

export interface IMuiDialogActions {
  value?: boolean | string | object
  text: string
}

export interface IMuiDialogConfig {
  title?: string
  content?: string[] | undefined
  actions?: IMuiDialogActions[]

  /**
   * Callback when the dialog is closed.
   *
   * @param {boolean | string | object | undefined} value The action value from `MuiDialogActions`
   */
  onClose?: (value: boolean | string | object | undefined) => void;
}

interface MuiDialogProps {
  config: IMuiDialogConfig
  open: boolean
}

export const MuiDialog = ({ config, open }: MuiDialogProps) => {

  const handleClose = (value?: boolean | string | object | undefined) => config.onClose ? config.onClose(value) : null

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>{config.title}</DialogTitle>

      <DialogContent>
        {config.content?.map((item, index) => <div key={index}>{item}</div>)}
      </DialogContent>

      <DialogActions>
        {config.actions?.map((action, index) => (
          <Button key={index} onClick={() => handleClose(action.value)}>{action.text}</Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}

/**
 * Uses `MuiDialog` to open a generic dialog to display errors.
 * * Same title
 * * Same action
 * * Default content if it was not provided
 */
export const MuiErrorDialog = ({ config, open }: MuiDialogProps) => {
  config.title = 'Error'
  config.content = Array.isArray(config.content) && config.content.length ? config.content : ['An error has occurred. Please try again later.']
  config.actions = [{ text: 'Dismiss' }]

  return <MuiDialog open={open} config={config} />
}