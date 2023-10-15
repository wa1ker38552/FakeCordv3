async function makeRequest(route) {
  const a = await fetch(route)
  const b = await a.json()
  return b
}