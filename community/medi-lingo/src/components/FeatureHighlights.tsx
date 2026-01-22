"use client";

import { Shield, Zap, Globe, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Safe & Responsible",
    description:
      "No diagnosis or medical advice. Just clear explanations with appropriate disclaimers.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    title: "40+ Languages",
    description:
      "Translate explanations into your preferred language using Lingo.dev AI translation.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get patient-friendly explanations in seconds, powered by advanced AI.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "PDF and image processing happens in your browser. Your data stays with you.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why Use medi-lingo?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Designed with patients in mind
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-0 bg-card/50 shadow-lg shadow-muted/20 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
