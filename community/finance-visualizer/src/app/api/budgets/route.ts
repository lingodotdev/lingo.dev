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
      // Parse and validate month and year values
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return NextResponse.json(
          { success: false, error: 'Month must be an integer between 1 and 12' },
          { status: 400 }
        );
      }
      
      if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
        return NextResponse.json(
          { success: false, error: 'Year must be a valid 4-digit year' },
          { status: 400 }
        );
      }
      
      query = { month: `${yearNum}-${String(monthNum).padStart(2, '0')}` };
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
    
    // Use atomic findOneAndUpdate with upsert to prevent race conditions
    const result = await Budget.findOneAndUpdate(
      { category, month: formattedMonth },
      { 
        $set: { 
          amount, 
          year: yearNum, 
          category, 
          month: formattedMonth 
        } 
      },
      { 
        upsert: true, 
        new: true, 
        rawResult: true,
        runValidators: true
      }
    );
    
    // Determine if this was an insert (201) or update (200) based on rawResult
    const wasCreated = result.lastErrorObject?.upserted !== undefined;
    const status = wasCreated ? 201 : 200;
    
    return NextResponse.json({ success: true, data: result.value }, { status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
