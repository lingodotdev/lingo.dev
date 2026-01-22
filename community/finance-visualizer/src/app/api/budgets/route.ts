import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    let query = {};
    if (month && year) {
      query = { month: `${year}-${month.padStart(2, '0')}` };
    }
    
    const budgets = await Budget.find(query).sort({ category: 1 });
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { category, amount, month, year } = body;
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ 
      category, 
      month: `${year}-${month.padStart(2, '0')}` 
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
        month: `${year}-${month.padStart(2, '0')}`,
        year: parseInt(year),
      });
      return NextResponse.json({ success: true, data: budget }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
