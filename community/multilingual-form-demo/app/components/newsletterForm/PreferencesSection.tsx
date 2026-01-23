"use client";

import { Controller, Control, UseFormRegister } from "react-hook-form";
import { FormCheckbox } from "./FormCheckbox";
import { FormSelect } from "./FormSelect";
import type { NewsletterFormData } from "../../types/form.types";

interface PreferencesSectionProps {
  control: Control<NewsletterFormData>;
  register: UseFormRegister<NewsletterFormData>;
  showFrequency: boolean;
  labels: {
    title: string;
    weekly: string;
    weeklyDesc: string;
    promotions: string;
    updates: string;
    frequency: string;
    daily: string;
    weeklyOption: string;
    monthly: string;
  };
}

export function PreferencesSection({
  control,
  register,
  showFrequency,
  labels,
}: PreferencesSectionProps) {
  const frequencyOptions = [
    { value: "daily", label: labels.daily },
    { value: "weekly", label: labels.weeklyOption },
    { value: "monthly", label: labels.monthly },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {labels.title}
      </h3>
      <div className="space-y-4">
        {(["weekly", "promotions", "updates"] as const).map((pref) => (
          <div key={pref} className="flex items-center justify-between">
            <FormCheckbox
              id={`pref-${pref}`}
              label={labels[pref]}
              description={pref === "weekly" ? labels.weeklyDesc : undefined}
              register={register(`preferences.${pref}`)}
            />
            {pref === "weekly" && showFrequency && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {labels.frequency}:
                </span>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      options={frequencyOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
