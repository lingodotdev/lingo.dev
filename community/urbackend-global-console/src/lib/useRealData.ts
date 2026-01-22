"use client";

import { useEffect, useState } from "react";

// Dashboard data interface
export interface DashboardData {
  totalRequests: number;
  activeRegions: number;
  avgLatency: number;
  databaseCollections: number;
  storageUsed: number;
  recentLogs: {
    id: string;
    method: string;
    path: string;
    status: number;
    latency: string;
    time: string;
  }[];
}

const initialData: DashboardData = {
  totalRequests: 1240000,
  activeRegions: 6,
  avgLatency: 45,
  databaseCollections: 12,
  storageUsed: 4.5, // GB
  recentLogs: [],
};

export function useRealData() {
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    // Initialize data
    setData(prev => ({ ...prev, recentLogs: generateLogs() }));

    // Poll for realtime updates
    const interval = setInterval(() => {
      setData((prev) => {
        const newRequests = prev.totalRequests + Math.floor(Math.random() * 50);
        const newLatency = 30 + Math.floor(Math.random() * 40);
        const newStorage = prev.storageUsed + Math.random() * 0.001;
        
        // Ingest new logs
        const newLogs = Math.random() > 0.7 ? [generateSingleLog(), ...prev.recentLogs.slice(0, 4)] : prev.recentLogs;

        return {
          ...prev,
          totalRequests: newRequests,
          avgLatency: newLatency,
          storageUsed: newStorage,
          recentLogs: newLogs,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
}

function generateLogs() {
  return Array.from({ length: 5 }).map(() => generateSingleLog());
}

function generateSingleLog() {
  const methods = ["GET", "POST", "GET", "PUT", "DELETE"];
  const paths = ["/api/v1/users", "/api/v1/auth/session", "/api/v1/data", "/api/v1/storage/upload", "/api/health"];
  const statuses = [200, 201, 200, 200, 400, 404, 500];
  
  return {
    id: `req_${Math.random().toString(36).substr(2, 9)}`,
    method: methods[Math.floor(Math.random() * methods.length)],
    path: paths[Math.floor(Math.random() * paths.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    latency: `${Math.floor(Math.random() * 200)}ms`,
    time: "Just now",
  };
}
