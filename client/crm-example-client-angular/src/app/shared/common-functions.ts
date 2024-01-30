import { AbstractControl } from '@angular/forms'


/**
 * Validator - the value of this field must match the value of another specified field.
 *
 * @param {string} fieldToMatch FormControlName of the field it should match
 *
 * @example
 * confirmPassword: ['', [Validators.required, matchFieldValidator('password')]]
 */
export const matchFieldValidator = (fieldToMatch: string) => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const controlToMatch = control.parent?.get(fieldToMatch)
    return controlToMatch && controlToMatch.value !== control.value ? { 'fieldMismatch': true } : null
  }
}
