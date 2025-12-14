export async function POST(request) {
  const body = await request.json();
  return new Response(JSON.stringify({
    ok: true,
    message: "Génération lancée (mock). Téléchargement bloqué jusqu’au paiement.",
    input: body
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
