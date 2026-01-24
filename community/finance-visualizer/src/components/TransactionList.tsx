'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from './TransactionForm';
import { ITransaction } from '@/models/Transaction';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface TransactionListProps {
  transactions: ITransaction[];
  fetchTransactions: () => void;
}

/**
 * Displays a table of transactions with edit and delete actions.
 * Supports inline editing via dialog and provides category-colored badges.
 * @param props - Component props with transactions array and refresh callback
 * @returns A table with transaction data and action buttons
 */
export function TransactionList({ transactions, fetchTransactions }: TransactionListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        // Try to parse error body for more details
        let errorMessage = `Failed to delete transaction (HTTP ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : errorMessage;
          }
        } catch {
          // Ignore JSON parsing errors for error response
        }
        alert(errorMessage);
        return;
      }
      
      // Only refresh the list on successful deletion
      fetchTransactions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(`Failed to delete transaction: ${errorMessage}`);
    }
  };

  return (
    <>
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No transactions found. Add your first transaction to get started!
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: ITransaction) => (
              <TableRow key={transaction._id as unknown as string}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  <span 
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  >
                    <span>{getCategoryIcon(transaction.category)}</span>
                    <span>{transaction.category}</span>
                  </span>
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog
                      open={isEditDialogOpen && selectedTransaction?._id === transaction._id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setSelectedTransaction(null);
                        }
                        setIsEditDialogOpen(isOpen);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Transaction</DialogTitle>
                        </DialogHeader>
                        <TransactionForm
                          transaction={selectedTransaction!}
                          onSuccess={() => {
                            fetchTransactions();
                            setIsEditDialogOpen(false);
                            setSelectedTransaction(null);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction._id as unknown as string)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
