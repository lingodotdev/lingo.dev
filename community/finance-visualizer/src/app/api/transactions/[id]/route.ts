import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { validateTransactionPayload } from '@/lib/validators';

/**
 * Handles PUT requests to update a specific transaction by ID.
 * Validates and sanitizes the request body to prevent mass assignment.
 * Only allows updating: amount, date, description, category.
 * @param request - The incoming HTTP request with updated transaction data
 * @param params - Route parameters containing the transaction ID
 * @returns JSON response with updated transaction, 400/422 if validation fails, or 404 if not found
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Validate and sanitize the payload - allows partial updates
    const validation = validateTransactionPayload(body, true);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 422 }
      );
    }
    
    // Ensure at least one field is being updated
    const payload = validation.data!;
    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }
    
    const { id } = await params;
    
    await dbConnect();
    const transaction = await Transaction.findByIdAndUpdate(id, payload, {
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

/**
 * Handles DELETE requests to remove a specific transaction by ID.
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the transaction ID
 * @returns JSON response with success status or 404 if not found
 */
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
