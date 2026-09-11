export function calcularProgreso(totalHorasSemana: number) {
  const MINIMO = 8;
  const EXTRA_OBJETIVO = 5;

  // --- Progreso hacia el mínimo ---
  const porcentajeMinimo = Math.min((totalHorasSemana / MINIMO) * 100, 100);
  const porcentajeFaltanteMinimo = 100 - porcentajeMinimo;
  const horasFaltantesMinimo = Math.max(MINIMO - totalHorasSemana, 0);

  // --- Progreso hacia las horas extra (lo que excede el mínimo) ---
  const horasExtraTrabajadas = Math.max(totalHorasSemana - MINIMO, 0);
  const porcentajeExtra = Math.min((horasExtraTrabajadas / EXTRA_OBJETIVO) * 100, 100);
  const porcentajeFaltanteExtra = 100 - porcentajeExtra;
  const horasFaltantesExtra = Math.max(EXTRA_OBJETIVO - horasExtraTrabajadas, 0);

  return {
    minimo: {
      cumplido: Number(porcentajeMinimo.toFixed(1)),
      faltantePorcentaje: Number(porcentajeFaltanteMinimo.toFixed(1)),
      faltanteHoras: Number(horasFaltantesMinimo.toFixed(1)),
    },
    extra: {
      cumplido: Number(porcentajeExtra.toFixed(1)),
      faltantePorcentaje: Number(porcentajeFaltanteExtra.toFixed(1)),
      faltanteHoras: Number(horasFaltantesExtra.toFixed(1)),
    },
  };
}