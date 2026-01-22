import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id } = await params;
    const transaction = await Transaction.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!transaction) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedTransaction = await Transaction.deleteOne({ _id: id });
    if (deletedTransaction.deletedCount === 0) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
