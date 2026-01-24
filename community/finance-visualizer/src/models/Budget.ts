import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

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
