import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'lineBreak',
  standalone: true,
  pure: true,
})
export class LineBreakPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.replace(/\n/g, '<br>')
  }

}
