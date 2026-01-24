import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

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
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

/**
 * Handles POST requests to create or update a budget.
 * Validates month (1-12) and year inputs before processing.
 * Updates existing budget if one exists for the category/month, otherwise creates new.
 * @param request - The incoming HTTP request with budget data in body
 * @returns JSON response with created/updated budget or validation error
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { category, amount, month, year } = body;
    
    // Input validation for month and year
    if (month === undefined || month === null || year === undefined || year === null) {
      return NextResponse.json(
        { success: false, error: 'Both month and year are required' },
        { status: 400 }
      );
    }
    
    const monthNum = typeof month === 'string' ? parseInt(month, 10) : Number(month);
    const yearNum = typeof year === 'string' ? parseInt(year, 10) : Number(year);
    
    if (isNaN(monthNum) || !Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { success: false, error: 'Month must be an integer between 1 and 12' },
        { status: 400 }
      );
    }
    
    if (isNaN(yearNum) || !Number.isInteger(yearNum) || yearNum < 1000 || yearNum > 9999) {
      return NextResponse.json(
        { success: false, error: 'Year must be a valid 4-digit year' },
        { status: 400 }
      );
    }
    
    const formattedMonth = `${yearNum}-${String(monthNum).padStart(2, '0')}`;
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ 
      category, 
      month: formattedMonth 
    });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      await existingBudget.save();
      return NextResponse.json({ success: true, data: existingBudget });
    } else {
      // Create new budget
      const budget = await Budget.create({
        category,
        amount,
        month: formattedMonth,
        year: yearNum,
      });
      return NextResponse.json({ success: true, data: budget }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
