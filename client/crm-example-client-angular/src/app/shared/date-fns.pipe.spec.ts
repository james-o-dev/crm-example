import { DateFnsPipe } from './date-fns.pipe'

describe('DateFnsPipe', () => {
  it('create an instance', () => {
    const pipe = new DateFnsPipe()
    expect(pipe).toBeTruthy()
  })
})
