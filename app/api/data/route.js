import { createClient } from '@vercel/kv';

const DATA_KEY = 'buzzer-planner-data';

function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  return createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

export async function GET() {
  const kv = getKV();
  if (!kv) {
    return Response.json({ tasks: [], metrics: {}, kvReady: false });
  }
  try {
    const data = await kv.get(DATA_KEY);
    return Response.json({ ...data, kvReady: true } || { tasks: [], metrics: {}, kvReady: true });
  } catch (e) {
    return Response.json({ tasks: [], metrics: {}, kvReady: false });
  }
}

export async function POST(request) {
  const kv = getKV();
  const data = await request.json();

  if (!kv) {
    return Response.json({ success: false, error: 'KV not configured' }, { status: 200 });
  }

  try {
    await kv.set(DATA_KEY, data);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
