import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { BackupModel } from '../../../../../../../packages/database/src/schemas/Backup';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const backups = await BackupModel.find({ guildId: params.guildId })
    .select('_id label guildName createdBy createdAt memberCount')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ backups });
}

export async function DELETE(req: NextRequest, { params }: { params: { guildId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { backupId } = await req.json();
  await connectDB();
  const result = await BackupModel.deleteOne({ _id: backupId, guildId: params.guildId });
  if (result.deletedCount === 0) return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
