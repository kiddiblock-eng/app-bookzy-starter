export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import Settings from '../../../../models/settings';

export async function GET(req) {
  try {
    await dbConnect();
    const settings = await Settings.findOne({ key: 'global' }).lean();
    
    return NextResponse.json({
      success: true,
      price: settings?.payment?.ebookPrice || 2100,
      currency: 'XOF'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}