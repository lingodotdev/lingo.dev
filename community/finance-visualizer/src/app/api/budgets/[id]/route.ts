import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id } = await params;
    const budget = await Budget.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!budget) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: budget });
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
    const deletedBudget = await Budget.deleteOne({ _id: id });
    if (deletedBudget.deletedCount === 0) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
