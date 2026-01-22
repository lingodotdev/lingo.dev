import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function GET() {
  await dbConnect();
  try {
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
