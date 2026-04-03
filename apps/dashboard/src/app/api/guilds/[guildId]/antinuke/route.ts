import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { AntiNukeModel } from '../../../../../../../packages/database/src/schemas/AntiNuke';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const config = await AntiNukeModel.findOne({ guildId: params.guildId }).lean();
  return NextResponse.json({ config: config ?? {} });
}

export async function PATCH(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  await connectDB();
  const updated = await AntiNukeModel.findOneAndUpdate(
    { guildId: params.guildId },
    { $set: { ...body, guildId: params.guildId } },
    { upsert: true, new: true },
  ).lean();
  return NextResponse.json({ success: true, config: updated });
}
