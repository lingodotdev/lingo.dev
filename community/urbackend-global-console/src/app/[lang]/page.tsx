"use client";

import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { t } from "@/lib/demo-dictionary";
import { useRealData } from "@/lib/useRealData";
import { 
  BarChart3, 
  ArrowUpRight, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Locale } from "@/lib/i18n-config";

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    POST: "text-green-400 bg-green-400/10 border-green-400/20",
    PUT: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    DELETE: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${colors[method] || "text-gray-400"}`}>
      {method}
    </span>
  );
}

function StatusBadge({ status }: { status: number }) {
  if (status >= 200 && status < 300) return <span className="text-[#3ECF8E] font-medium">{status}</span>;
  if (status >= 400 && status < 500) return <span className="text-orange-400 font-medium">{status}</span>;
  return <span className="text-red-400 font-medium">{status}</span>;
}

export default function Dashboard() {
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const data = useRealData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDEDED] flex items-center gap-3">
            {t("Project Overview", lang)}
            <span className="px-2 py-1 rounded-md bg-[#1E1E1E] text-xs font-mono text-[#888] font-normal border border-[#333]">Production</span>
          </h1>
          <p className="text-[#888] mt-2 text-lg">
            {t("Monitor your database, storage, and API usage in real-time.", lang)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[#888]">
            <span className="font-medium">{t("Total Requests", lang)}</span>
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{data.totalRequests.toLocaleString()}</div>
          <div className="text-xs text-[#3ECF8E] flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            {t("Last 30 Days", lang)}
          </div>
        </div>
        
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[#888]">
            <span className="font-medium">{t("Database Collections", lang)}</span>
            <Database className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{data.databaseCollections}</div>
          <div className="text-xs text-[#888]">
            {t("142MB Data Stored", lang)}
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[#888]">
            <span className="font-medium">{t("Storage Used", lang)}</span>
            <HardDrive className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{data.storageUsed.toFixed(2)} GB</div>
          <div className="text-xs text-[#3ECF8E] flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("Healthy", lang)}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b border-[#1E1E1E] flex items-center justify-between bg-[#0F0F0F]">
          <h2 className="text-sm font-semibold text-[#EDEDED] uppercase tracking-wider">
            {t("Recent API Activity", lang)}
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#3ECF8E] animate-pulse" />
            <span className="text-xs text-[#3ECF8E] font-medium">Live</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1E1E1E] bg-[#0A0A0A]">
                <th className="px-6 py-3 font-medium text-[#888] uppercase tracking-wider text-xs">{t("Method", lang)}</th>
                <th className="px-6 py-3 font-medium text-[#888] uppercase tracking-wider text-xs">{t("Endpoint", lang)}</th>
                <th className="px-6 py-3 font-medium text-[#888] uppercase tracking-wider text-xs">{t("Status", lang)}</th>
                <th className="px-6 py-3 font-medium text-[#888] uppercase tracking-wider text-xs">{t("Latency", lang)}</th>
                <th className="px-6 py-3 font-medium text-[#888] uppercase tracking-wider text-xs">{t("Time", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]">
              {data.recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors animate-in fade-in slide-in-from-left-4 duration-300">
                  <td className="px-6 py-4">
                    <MethodBadge method={log.method} />
                  </td>
                  <td className="px-6 py-4 font-mono text-[#EDEDED] text-xs">{log.path}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 text-[#888] font-mono text-xs">{log.latency}</td>
                  <td className="px-6 py-4 text-[#888] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
