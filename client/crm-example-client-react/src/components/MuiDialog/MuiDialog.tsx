import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Dialog from '@mui/material/Dialog'

export interface MuiDialogActions {
  value?: boolean | string | object
  text: string
}

interface MuiDialogProps {
  title?: string
  content?: string[]
  actions?: MuiDialogActions[]

  /**
   * Set this to open and close the dialog
   */
  open: boolean
  /**
   * Callback when the dialog is closed.
   *
   * @param {boolean | string | object | undefined} value The action value from `MuiDialogActions`
   */
  onClose?: (value: boolean | string | object | undefined) => void;
}

export const MuiDialog = ({ title, content, actions, open, onClose }: MuiDialogProps) => {

  const handleClose = (value?: boolean | string | object | undefined) => onClose ? onClose(value) : null

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {content?.map((item, index) => <div key={index}>{item}</div>)}
      </DialogContent>

      <DialogActions>
        {actions?.map((action, index) => (
          <Button key={index} onClick={() => handleClose(action.value)}>{action.text}</Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}

interface MuiErrorDialogProps {
  content?: string[]
  open: boolean
  onClose: () => void
}

/**
 * Uses `MuiDialog` to open a generic dialog to display errors.
 * * Same title
 * * Same action
 * * Default content if it was not provided
 */
export const MuiErrorDialog = ({ content, open, onClose }: MuiErrorDialogProps) => {
  return (
    <MuiDialog
      open={open}
      title='Error'
      content={content || ['An error has occurred. Please try again later.']}
      actions={[{ text: 'Dismiss' }]}
      onClose={onClose}
    />
  )
}