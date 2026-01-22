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
  month: { type: String, required: true }, // Format: "YYYY-MM"
  year: { type: Number, required: true },
}, {
  timestamps: true,
});

// Create compound index for category and month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
