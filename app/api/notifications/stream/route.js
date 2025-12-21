export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let clients = [];

export async function GET(req) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Identifiant du client
  const client = { writer };
  clients.push(client);

  // Message de bienvenue
  writer.write(`data: ${JSON.stringify({ connected: true })}\n\n`);

  // Cleanup (client ferme)
  req.signal.addEventListener("abort", () => {
    clients = clients.filter(c => c !== client);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// Fonction pour envoyer un event SSE
export function pushNotificationToClients(notification) {
  const str = `data: ${JSON.stringify(notification)}\n\n`;
  clients.forEach(c => {
    c.writer.write(str);
  });
}