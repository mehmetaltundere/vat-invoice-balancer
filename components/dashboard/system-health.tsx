"use client";

import React from "react";
import { Activity, Database, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SystemHealth() {
  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#0066CC]" />
          EFA Sistem & Entegrasyon Sağlığı
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 text-xs">
        {/* System Health Item 1 */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-[#0066CC]">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">IdeaSoft REST API</p>
              <p className="text-[11px] text-gray-500">Sipariş Çekme & Geri Besleme</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] gap-1 font-mono">
            <CheckCircle2 className="h-3 w-3" /> Erişilebilir
          </Badge>
        </div>

        {/* System Health Item 2 */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dopigo e-Fatura Servisi</p>
              <p className="text-[11px] text-gray-500">Exact-Match Fatura Gönderimi</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] gap-1 font-mono">
            <CheckCircle2 className="h-3 w-3" /> Erişilebilir
          </Badge>
        </div>

        {/* System Health Item 3 */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Matematiksel Dengeleme Motoru</p>
              <p className="text-[11px] text-gray-500">Kuruş Hassasiyetli Solver</p>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] gap-1 font-mono">
            <CheckCircle2 className="h-3 w-3" /> %100 Uyumlu
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
