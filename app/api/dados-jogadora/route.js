let latestData = { speed: 0, accel: 0, bpm: 0, stamina: 100 };

export async function POST(req) {
  const body = await req.json();
  latestData = body;
  return Response.json({ status: 'ok' });
}

export async function GET() {
  return Response.json(latestData);
}