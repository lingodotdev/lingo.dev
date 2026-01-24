import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a Transaction document in MongoDB.
 * Stores individual financial transactions with category tracking.
 */
export interface ITransaction extends Document {
  /** The transaction amount in currency units */
  amount: number;
  /** The date when the transaction occurred */
  date: Date;
  /** A brief description of the transaction */
  description: string;
  /** The spending category for this transaction */
  category: string;
}

/**
 * Mongoose schema for Transaction documents.
 * All fields are required for proper transaction tracking.
 */
const TransactionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
