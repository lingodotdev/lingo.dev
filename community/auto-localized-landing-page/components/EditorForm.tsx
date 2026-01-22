"use client";

import { useState } from "react";
import type { LandingPageContent, Feature } from "@/lib/types";

interface EditorFormProps {
  onSubmit: (content: LandingPageContent) => void;
  isLoading: boolean;
}

export function EditorForm({ onSubmit, isLoading }: EditorFormProps) {
  const [productName, setProductName] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [features, setFeatures] = useState<[Feature, Feature, Feature]>([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFeature = (
    index: 0 | 1 | 2,
    field: keyof Feature,
    value: string,
  ) => {
    const newFeatures = [...features] as [Feature, Feature, Feature];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!productName.trim()) newErrors.productName = "Required";
    if (!headline.trim()) newErrors.headline = "Required";
    if (!ctaText.trim()) newErrors.ctaText = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ productName, headline, subheadline, features, ctaText });
  };

  const inputClass = (error?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
      error ? "border-red-300" : "border-neutral-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="pb-4 border-b border-neutral-200">
        <h2 className="text-sm font-medium text-neutral-900">Content Editor</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Enter your content in English
        </p>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Acme Cloud"
          className={inputClass(errors.productName)}
          disabled={isLoading}
        />
        {errors.productName && (
          <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
        )}
      </div>

      {/* Headline */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          Headline <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Scale Your Business Globally"
          className={inputClass(errors.headline)}
          disabled={isLoading}
        />
        {errors.headline && (
          <p className="text-red-500 text-xs mt-1">{errors.headline}</p>
        )}
      </div>

      {/* Subheadline */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          Subheadline
        </label>
        <textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          placeholder="The all-in-one platform for modern teams."
          rows={2}
          className={`${inputClass()} resize-none`}
          disabled={isLoading}
        />
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-neutral-700">
          Features
        </label>
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2"
          >
            <div className="text-xs text-neutral-500 font-medium">
              Feature {index + 1}
            </div>
            <input
              type="text"
              value={feature.title}
              onChange={(e) =>
                updateFeature(index as 0 | 1 | 2, "title", e.target.value)
              }
              placeholder="Title"
              className={inputClass()}
              disabled={isLoading}
            />
            <textarea
              value={feature.description}
              onChange={(e) =>
                updateFeature(index as 0 | 1 | 2, "description", e.target.value)
              }
              placeholder="Description"
              rows={2}
              className={`${inputClass()} resize-none`}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          CTA Button Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          placeholder="Get Started Free"
          className={inputClass(errors.ctaText)}
          disabled={isLoading}
        />
        {errors.ctaText && (
          <p className="text-red-500 text-xs mt-1">{errors.ctaText}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Translating..." : "Generate All Languages"}
      </button>
    </form>
  );
}
