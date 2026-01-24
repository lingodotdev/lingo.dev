import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';
import { validateBudgetPayload } from '@/lib/validators';

/**
 * Handles PUT requests to update a specific budget by ID.
 * Validates the request body before updating to ensure data integrity.
 * @param request - The incoming HTTP request with updated budget data
 * @param params - Route parameters containing the budget ID
 * @returns JSON response with updated budget, 400 if validation fails, or 404 if not found
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Validate the request body before updating
    const validation = validateBudgetPayload(body, false);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    const { id } = await params;
    
    // Build the update payload from validated data
    const updatePayload: Record<string, unknown> = {
      category: validation.data!.category,
      amount: validation.data!.amount,
    };
    
    // Include month/year if they were validated
    if (validation.data!.month !== undefined && validation.data!.year !== undefined) {
      updatePayload.month = `${validation.data!.year}-${String(validation.data!.month).padStart(2, '0')}`;
      updatePayload.year = validation.data!.year;
    }
    
    await dbConnect();
    const budget = await Budget.findByIdAndUpdate(id, updatePayload, {
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

/**
 * Handles DELETE requests to remove a specific budget by ID.
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the budget ID
 * @returns JSON response with success status or 404 if not found
 */
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
