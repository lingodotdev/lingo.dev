import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { validateTransactionPayload } from '@/lib/validators';

/**
 * Handles GET requests to fetch all transactions.
 * Returns transactions sorted by date in descending order (newest first).
 * @returns JSON response with transaction data or error
 */
export async function GET() {
  await dbConnect();
  try {
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

/**
 * Handles POST requests to create a new transaction.
 * Validates required fields and sanitizes input to prevent mass assignment.
 * Required fields: amount (positive number), date (valid date), description (non-empty), category (non-empty).
 * @param request - The incoming HTTP request with transaction data in body
 * @returns JSON response with created transaction or 400 with validation errors
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate and sanitize the transaction body
    const validation = validateTransactionPayload(body, false);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Use only the validated/sanitized payload
    const sanitizedPayload = validation.data!;
    
    await dbConnect();
    const transaction = await Transaction.create(sanitizedPayload);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
