import { Pipe, PipeTransform } from '@angular/core'
import { format } from 'date-fns'
import { enNZ } from 'date-fns/locale'

/**
 * Pipe using the DateFns external library for formatting.
 * * Note: that currently it only supports a unix timestamp number (e.g. from Date.now())
 * * Default locale is en-NZ.
 * * Default format is 'Pp'.
 * * Usage: {{ unixTimestamp | dateFns: 'Pp' }}
 */
@Pipe({
  name: 'dateFns',
  standalone: true,
  pure: true,
})
export class DateFnsPipe implements PipeTransform {

  transform(value: number | string | undefined, ...args: unknown[]) {
    if (!value) return ''

    // If value is a string, convert to number.
    if (typeof value === 'string') value = parseInt(value)

    // Default format.
    let dateFnsFormat = 'Pp'

    if (args[0]) dateFnsFormat = args[0] as string

    return format(value, dateFnsFormat, { locale: enNZ })
  }

}
