import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { CommandPermissionModel } from '@botforge/database/src/schemas/CommandPermission';
import { getGuildRoles } from '@/lib/discord';

export async function GET(req: NextRequest, { params }: { guildId: string }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const [permissions, roles] = await Promise.all([
    CommandPermissionModel.find({ guildId: params.guildId }).lean(),
    getGuildRoles(params.guildId),
  ]);
  return NextResponse.json({ permissions, roles });
}

export async function PUT(req: NextRequest, { params }: { guildId: string }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { target, targetType, enabled, allowedRoles, deniedRoles } = await req.json();
  await connectDB();
  const perm = await CommandPermissionModel.findOneAndUpdate(
    { guildId: params.guildId, target },
    { $set: { targetType, enabled, allowedRoles, deniedRoles } },
    { upsert: true, new: true },
  ).lean();
  return NextResponse.json({ success: true, permission: perm });
}
