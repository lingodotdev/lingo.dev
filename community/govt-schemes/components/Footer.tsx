"use client";

import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Zap,
  CheckCircle,
  Globe,
  ExternalLink,
  Building2,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 border-t dark:border-gray-800">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">SchemeSaathi</h4>
                <p className="text-xs text-gray-400">
                  Government Schemes Simplified
                </p>
              </div>
            </div>
            <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
              Empowering citizens with easy access to government schemes.
            </p>
          </div>

          <div>
            <h5 className="font-semibold mb-6 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Features
            </h5>
            <ul className="space-y-3 text-gray-400 dark:text-gray-500">
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Language Support
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Instant Answers
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-blue-400" />
                Smart Search
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                AI Matching
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                Real-time Updates
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-6 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Languages
            </h5>
            <ul className="space-y-3 text-gray-400 dark:text-gray-500">
              <li>English</li>
              <li>Hindi</li>
              <li>Regional Languages</li>
              <li>And more...</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-6 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Resources
            </h5>
            <ul className="space-y-3 text-gray-400 dark:text-gray-500">
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Building2 className="w-3 h-3 mr-2" />
                  myScheme Portal
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tosif121/schemesetu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800 dark:bg-gray-800 mb-8 w-full" />

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-500">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <p>
              Copyright {new Date().getFullYear()} SchemeSaathi. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            Made with ❤️ for India
          </div>
        </div>
      </div>
    </footer>
  );
}
