describe('General API test', () => {
  test('health test', async () => {
    const response = await fetch(`${process.env.API_HOST}`)
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.message).toBe('CRM Example API. For personal/demonstration/educational purposes only.')
  })
})