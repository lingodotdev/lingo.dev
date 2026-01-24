/**
 * Shared validation utilities for API request bodies.
 * Provides consistent validation across budget and transaction endpoints.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validated budget payload after sanitization.
 */
export interface ValidatedBudgetPayload {
  category: string;
  amount: number;
  month?: number;
  year?: number;
}

/**
 * Validates and sanitizes a budget payload.
 * Ensures category is a non-empty string, amount is a positive finite number,
 * and optionally validates month (1-12) and year (4-digit).
 * @param body - The raw request body to validate
 * @param requireMonthYear - Whether month and year are required fields
 * @returns ValidationResult with sanitized data or errors
 */
export function validateBudgetPayload(
  body: Record<string, unknown>,
  requireMonthYear: boolean = false
): ValidationResult<ValidatedBudgetPayload> {
  const errors: ValidationError[] = [];
  const result: ValidatedBudgetPayload = {
    category: '',
    amount: 0,
  };

  // Validate category
  if (body.category === undefined || body.category === null) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else {
    const categoryStr = String(body.category).trim();
    if (categoryStr === '') {
      errors.push({ field: 'category', message: 'Category cannot be empty' });
    } else {
      result.category = categoryStr;
    }
  }

  // Validate amount
  if (body.amount === undefined || body.amount === null) {
    errors.push({ field: 'amount', message: 'Amount is required' });
  } else {
    const amountValue = typeof body.amount === 'string' 
      ? parseFloat(body.amount) 
      : Number(body.amount);
    
    if (!isFinite(amountValue)) {
      errors.push({ field: 'amount', message: 'Amount must be a valid finite number' });
    } else if (amountValue <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    } else {
      result.amount = amountValue;
    }
  }

  // Validate month and year if required or provided
  if (requireMonthYear || body.month !== undefined || body.year !== undefined) {
    if (body.month === undefined || body.month === null) {
      if (requireMonthYear) {
        errors.push({ field: 'month', message: 'Month is required' });
      }
    } else {
      const monthNum = typeof body.month === 'string' 
        ? parseInt(body.month, 10) 
        : Number(body.month);
      
      if (isNaN(monthNum) || !Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
        errors.push({ field: 'month', message: 'Month must be an integer between 1 and 12' });
      } else {
        result.month = monthNum;
      }
    }

    if (body.year === undefined || body.year === null) {
      if (requireMonthYear) {
        errors.push({ field: 'year', message: 'Year is required' });
      }
    } else {
      const yearNum = typeof body.year === 'string' 
        ? parseInt(body.year, 10) 
        : Number(body.year);
      
      if (isNaN(yearNum) || !Number.isInteger(yearNum) || yearNum < 1000 || yearNum > 9999) {
        errors.push({ field: 'year', message: 'Year must be a valid 4-digit year' });
      } else {
        result.year = yearNum;
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}

/**
 * Validated transaction payload after sanitization.
 */
export interface ValidatedTransactionPayload {
  amount: number;
  date: Date;
  description: string;
  category: string;
}

/**
 * Allowed fields for transaction updates to prevent mass assignment.
 */
const ALLOWED_TRANSACTION_FIELDS = ['amount', 'date', 'description', 'category'] as const;

/**
 * Validates and sanitizes a transaction payload.
 * Ensures amount is a positive number, date is valid, 
 * and description/category are non-empty strings.
 * Whitelists only allowed fields to prevent mass assignment.
 * @param body - The raw request body to validate
 * @param partial - Whether all fields are required (false) or partial updates allowed (true)
 * @returns ValidationResult with sanitized data or errors
 */
export function validateTransactionPayload(
  body: Record<string, unknown>,
  partial: boolean = false
): ValidationResult<Partial<ValidatedTransactionPayload>> {
  const errors: ValidationError[] = [];
  const result: Partial<ValidatedTransactionPayload> = {};

  // Validate amount
  if (body.amount !== undefined) {
    const amountValue = typeof body.amount === 'string' 
      ? parseFloat(body.amount) 
      : Number(body.amount);
    
    if (!isFinite(amountValue)) {
      errors.push({ field: 'amount', message: 'Amount must be a valid finite number' });
    } else if (amountValue <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    } else {
      result.amount = amountValue;
    }
  } else if (!partial) {
    errors.push({ field: 'amount', message: 'Amount is required' });
  }

  // Validate date
  if (body.date !== undefined) {
    const dateValue = new Date(body.date as string | number | Date);
    if (isNaN(dateValue.getTime())) {
      errors.push({ field: 'date', message: 'Date must be a valid date value' });
    } else {
      result.date = dateValue;
    }
  } else if (!partial) {
    errors.push({ field: 'date', message: 'Date is required' });
  }

  // Validate description
  if (body.description !== undefined) {
    const descStr = String(body.description).trim();
    if (descStr === '') {
      errors.push({ field: 'description', message: 'Description cannot be empty' });
    } else {
      result.description = descStr;
    }
  } else if (!partial) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  // Validate category
  if (body.category !== undefined) {
    const categoryStr = String(body.category).trim();
    if (categoryStr === '') {
      errors.push({ field: 'category', message: 'Category cannot be empty' });
    } else {
      result.category = categoryStr;
    }
  } else if (!partial) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}

/**
 * Picks only allowed fields from an object to prevent mass assignment.
 * @param obj - The source object
 * @param allowedFields - Array of allowed field names
 * @returns A new object with only the allowed fields
 */
export function pickAllowedFields<T extends Record<string, unknown>>(
  obj: T,
  allowedFields: readonly string[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in obj) {
      (result as Record<string, unknown>)[field] = obj[field];
    }
  }
  return result;
}
