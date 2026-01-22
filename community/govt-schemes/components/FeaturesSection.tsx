"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  MessageCircle,
  Target,
  Database,
  History,
  BarChart3,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
            Powerful Features
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with user-friendly interfaces
            to simplify your government scheme journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 mb-4">
                <Bot className="h-6 w-6 text-[#4299eb] dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                AI Processing
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Advanced natural language processing to understand your queries
                and provide accurate information about schemes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30 mb-4">
                <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                WhatsApp Integration
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Seamlessly accessible through WhatsApp for easy communication
                and wider reach among citizens.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30 mb-4">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Eligibility Matching
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Smart algorithms to match your profile with relevant government
                schemes you are eligible for.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30 mb-4">
                <Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Government Data
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Connected with official government databases to provide the most
                up-to-date and authentic information.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 mb-4">
                <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Conversation Memory
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Remembers context from previous interactions to provide a
                continuous and personalized experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-950/30 mb-4">
                <BarChart3 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Comprehensive insights into scheme popularity, user
                demographics, and query patterns.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
