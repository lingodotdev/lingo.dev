import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a Budget document in MongoDB.
 * Stores monthly budget allocations per category.
 */
export interface IBudget extends Document {
  /** The spending category (e.g., "Food & Dining", "Transportation") */
  category: string;
  /** The budgeted amount for this category */
  amount: number;
  /** Month in YYYY-MM format */
  month: string;
  /** Year derived from month field */
  year: number;
  /** Timestamp when the budget was created */
  createdAt: Date;
  /** Timestamp when the budget was last updated */
  updatedAt: Date;
}

/**
 * Mongoose schema for Budget documents.
 * Includes validation for month format and auto-derives year from month.
 */
const BudgetSchema: Schema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{4}-\d{2}$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid month format. Expected YYYY-MM.`
    }
  }, // Format: "YYYY-MM"
  year: { type: Number, required: true },
}, {
  timestamps: true,
});

// Pre-validate hook to derive year from month and ensure consistency
BudgetSchema.pre('validate', function(next) {
  if (this.month) {
    const monthStr = this.month as string;
    if (!/^\d{4}-\d{2}$/.test(monthStr)) {
      return next(new Error(`Invalid month format: ${monthStr}. Expected YYYY-MM.`));
    }
    const parsedYear = parseInt(monthStr.split('-')[0], 10);
    if (isNaN(parsedYear)) {
      return next(new Error(`Could not parse year from month: ${monthStr}`));
    }
    this.year = parsedYear;
  }
  next();
});

// Create compound index for category and month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
