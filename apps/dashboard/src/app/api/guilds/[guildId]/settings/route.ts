import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { GuildModel } from '../../../../../../../packages/database/src/schemas/Guild';
import { getGuildRoles } from '@/lib/discord';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const settings = await GuildModel.findOne({ guildId: params.guildId }).lean();
  const roles = await getGuildRoles(params.guildId);
  return NextResponse.json({ settings: settings ?? {}, roles });
}

export async function PATCH(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  await connectDB();
  const updated = await GuildModel.findOneAndUpdate(
    { guildId: params.guildId },
    { $set: body },
    { upsert: true, new: true },
  ).lean();
  return NextResponse.json({ success: true, settings: updated });
}
