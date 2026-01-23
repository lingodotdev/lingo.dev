"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { createValidationSchema } from "../../lib/validation";
import type { NewsletterFormData } from "../types/form.types";
import {
  FormInput,
  PhoneInput,
  PreferencesSection,
  PrivacyCheckbox,
  SubmitButton,
  SuccessMessage,
  FormStats,
  UserIcon,
  EmailIcon,
  InfoIcon,
} from "./newsletterForm/index";
import { useFormHelpers } from "../hooks/useFormValidation";
import {
  FORM_DEFAULT_VALUES,
  FORM_MODE,
  SIMULATED_API_DELAY,
} from "../constants/form.constants";

export default function NewsletterForm() {
  const t = useTranslations("Form");
  const tValidation = useTranslations("Validation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = createValidationSchema(tValidation);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(schema),
    defaultValues: FORM_DEFAULT_VALUES,
    mode: FORM_MODE,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = form;

  const { formatPhoneNumber } = useFormHelpers(form);

  const preferences = watch("preferences");
  const showFrequency = preferences.weekly;

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
      console.log("Form data submitted:", data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <SuccessMessage
        title={t("success.title")}
        message={t("success.message")}
        ctaText={t("success.cta")}
        homeText={t("success.home")}
        onReset={handleReset}
        onHome={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {t("description")}
        </p>
      </div>

      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <InfoIcon />
          <span className="text-sm font-medium">
            {t("validation.demo")}: {t("validation.requiredFields")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          error={errors.name?.message}
          label={t("fields.name.label")}
          id="name"
          placeholder={t("fields.name.placeholder")}
          icon={<UserIcon />}
          register={register("name")}
          helperText={t("fields.name.length")}
        />

        <FormInput
          error={errors.email?.message}
          label={t("fields.email.label")}
          id="email"
          type="email"
          placeholder={t("fields.email.placeholder")}
          icon={<EmailIcon />}
          register={register("email")}
        />

        <PhoneInput
          control={control}
          error={errors.phone?.message}
          label={t("fields.phone.label")}
          placeholder={t("fields.phone.placeholder")}
          optional={t("fields.phone.optional")}
          formatPhoneNumber={formatPhoneNumber}
        />

        <PreferencesSection
          control={control}
          register={register}
          showFrequency={showFrequency}
          labels={{
            title: t("preferences.title"),
            weekly: t("preferences.weekly"),
            weeklyDesc: t("preferences.weeklyDesc"),
            promotions: t("preferences.promotions"),
            updates: t("preferences.updates"),
            frequency: t("preferences.frequency"),
            daily: t("preferences.daily"),
            weeklyOption: t("preferences.weeklyFrequency"),
            monthly: t("preferences.monthly"),
          }}
        />

        <PrivacyCheckbox
          register={register("privacy")}
          error={errors.privacy?.message}
          privacyText={t.rich("privacy", {
            terms: (chunks) => (
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {chunks}
              </Link>
            ),
          })}
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          isValid={isValid}
          submitText={t("submit")}
          submittingText={t("submitting")}
          securityText={t("security")}
        />
      </form>

      <FormStats
        errorCount={Object.keys(errors).length}
        isDirty={isDirty}
        isValid={isValid}
        labels={{
          errors: t("stats.errors"),
          dirty: t("stats.dirty"),
          valid: t("stats.valid"),
        }}
      />
    </motion.div>
  );
}
