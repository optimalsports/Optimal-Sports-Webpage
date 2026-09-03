import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const rel = 'catalog';
    const dir = path.join(publicDir, rel);
    if (!fs.existsSync(dir)) return NextResponse.json([]);
    const exts = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg']);
    const files = fs.readdirSync(dir)
      .filter((f) => exts.has(path.extname(f).toLowerCase()))
      .map((f) => `/${rel}/${f}`);
    return NextResponse.json(files);
  } catch (e) {
    return NextResponse.json([]);
  }
}


