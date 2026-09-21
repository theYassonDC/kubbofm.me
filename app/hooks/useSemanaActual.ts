export const useSemanaActual = (timeZone = 'America/Bogota') => {
  // Obtenemos año/mes/día tal como se ven en Colombia,
  // sin importar el timezone del servidor/hosting (aunque sea UTC).
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const partes = formatter.formatToParts(new Date())
  const anio = Number(partes.find(p => p.type === 'year')?.value ?? 0)
  const mes  = Number(partes.find(p => p.type === 'month')?.value ?? 1) - 1
  const dia  = Number(partes.find(p => p.type === 'day')?.value ?? 1)

  // A partir de aquí todo el cálculo se hace en UTC "puro" (sin timezone),
  // usando los valores que ya corresponden a Colombia.
  const hoy    = Date.UTC(anio, mes, dia)
  const inicio = Date.UTC(anio, 0, 1)
  const diaSemanaInicio = new Date(inicio).getUTCDay()

  const diasTranscurridos = Math.round((hoy - inicio) / 86400000)
  const semana = Math.ceil((diasTranscurridos + diaSemanaInicio + 1) / 7)

  return { semana, anio }
}