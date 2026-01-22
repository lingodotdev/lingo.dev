"use client";

import { Bell, HelpCircle } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-[56px] w-full items-center justify-between border-b border-[#1E1E1E] bg-[rgba(10,10,10,0.8)] px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Breadcrumb simulation */}
        <div className="flex items-center text-sm text-[#888]">
          <span className="hover:text-[#EDEDED] cursor-pointer transition-colors">lingo-dev</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-[#EDEDED]">global-console</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        
        <div className="h-4 w-[1px] bg-[#1E1E1E]" />

        <button className="text-[#888] hover:text-[#EDEDED] transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-[#888] hover:text-[#EDEDED] transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#ea5455]" />
        </button>
      </div>
    </header>
  );
}
