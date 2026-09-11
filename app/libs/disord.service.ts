export type LOGS_TYPE = 'schedules' | 'requets'
export async function sendWebhook(content: string, logs_type: LOGS_TYPE) {
  const res = await fetch(`/api/webhook?type=${logs_type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
    }),
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Respuesta completa:", data); // <-- esto es clave
  return data;
}
