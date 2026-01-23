"use client";

import { EmailIcon, LockIcon } from "./FormIcons";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitText: string;
  submittingText: string;
  securityText: string;
}

export function SubmitButton({
  isSubmitting,
  isDirty,
  isValid,
  submitText,
  submittingText,
  securityText,
}: SubmitButtonProps) {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
          isSubmitting || !isDirty || !isValid
            ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
            : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{submittingText}</span>
            </>
          ) : (
            <>
              <EmailIcon />
              <span>{submitText}</span>
            </>
          )}
        </div>
      </button>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <LockIcon />
          {securityText}
        </div>
      </div>
    </div>
  );
}
