import { Pipe, PipeTransform } from '@angular/core'
import { format } from 'date-fns'
import { enNZ } from 'date-fns/locale'

@Pipe({
  name: 'dateFns',
  standalone: true,
})
export class DateFnsPipe implements PipeTransform {

  transform(value: number | string | undefined, ...args: unknown[]) {
    if (!value) return ''

    // Default format.
    let dateFnsFormat = 'Pp'

    if (args[0]) dateFnsFormat = args[0] as string


    return format(value, dateFnsFormat, { locale: enNZ })
  }

}
