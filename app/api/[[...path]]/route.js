import { NextResponse } from 'next/server';

// CollegeFinder is a frontend-only app (data lives in /data/colleges.json).
// This catch-all returns a clean 404 for any /api/* path so the route exists
// but doesn't drag in MongoDB connections or unpaginated queries.

function corsHeaders(res) {
  res.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export async function OPTIONS() {
  return corsHeaders(new NextResponse(null, { status: 204 }));
}

async function handler(request, { params }) {
  const { path = [] } = await params;
  return corsHeaders(NextResponse.json(
    { error: `Route /${path.join('/')} not found` },
    { status: 404 }
  ));
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
