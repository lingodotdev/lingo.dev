import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';
import { validateBudgetPayload } from '@/lib/validators';

/**
 * Handles GET requests to fetch budgets.
 * Optionally filters by month and year query parameters.
 * Both month and year must be provided together for filtering; returns 400 if only one is supplied.
 * @param request - The incoming HTTP request
 * @returns JSON response with budget data or error
 */
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    // Validate: if one of month/year is provided, both must be provided
    const hasMonth = month !== null && month !== '';
    const hasYear = year !== null && year !== '';
    
    if (hasMonth !== hasYear) {
      return NextResponse.json(
        { success: false, error: 'Both month and year must be provided together for filtering' },
        { status: 400 }
      );
    }
    
    let query = {};
    if (hasMonth && hasYear) {
      query = { month: `${year}-${month.padStart(2, '0')}` };
    }
    
    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

/**
 * Handles POST requests to create or update a budget.
 * Validates category, amount, month (1-12) and year inputs before processing.
 * Updates existing budget if one exists for the category/month, otherwise creates new.
 * @param request - The incoming HTTP request with budget data in body
 * @returns JSON response with created/updated budget or validation error
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Validate category and amount using shared validator
    const validation = validateBudgetPayload(body, true);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    const { category, amount, month: monthNum, year: yearNum } = validation.data!;
    
    const formattedMonth = `${yearNum}-${String(monthNum).padStart(2, '0')}`;
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ 
      category, 
      month: formattedMonth 
    });
    
    if (existingBudget) {
      // Update existing budget with validated amount
      existingBudget.amount = amount;
      await existingBudget.save();
      return NextResponse.json({ success: true, data: existingBudget });
    } else {
      // Create new budget with validated values
      const budget = await Budget.create({
        category,
        amount,
        month: formattedMonth,
        year: yearNum,
      });
      return NextResponse.json({ success: true, data: budget }, { status: 201 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
