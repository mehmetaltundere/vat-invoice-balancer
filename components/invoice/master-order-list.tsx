"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  CheckSquare,
  Square,
  Filter,
  UserX,
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  tckn: string;
  totalAmount: number;
  date: string;
  status: "PENDING" | "BALANCED";
}

interface MasterOrderListProps {
  orders: OrderItem[];
  selectedOrderId: string | null;
  onSelectOrder: (order: OrderItem) => void;
  selectedOrderIds: string[];
  onToggleBatchSelect: (orderId: string) => void;
  onSelectAllBatch: (orderIds: string[]) => void;
}

export function MasterOrderList({
  orders,
  selectedOrderId,
  onSelectOrder,
  selectedOrderIds,
  onToggleBatchSelect,
  onSelectAllBatch,
}: MasterOrderListProps) {
  const [filterDefaultTcknOnly, setFilterDefaultTcknOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // TCKN filter rule: Only process empty/default TCKNs ("11111111111")
  const filteredOrders = orders.filter((order) => {
    const matchesTckn = filterDefaultTcknOnly
      ? order.tckn === "11111111111"
      : true;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTckn && matchesSearch;
  });

  const excludedCount = orders.length - filteredOrders.length;
  const allFilteredSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      onSelectAllBatch([]);
    } else {
      onSelectAllBatch(filteredOrders.map((o) => o.id));
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-full">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-500" />
            IdeaSoft Sipariş Listesi
          </CardTitle>
          <Badge variant="outline" className="text-[11px] font-semibold">
            {filteredOrders.length} Sipariş
          </Badge>
        </div>

        {/* TCKN Strict Filter Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Filtre: Yalnızca TCKN: 11111111111
            </span>
          </div>
          <button
            onClick={() => setFilterDefaultTcknOnly(!filterDefaultTcknOnly)}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] ${
              filterDefaultTcknOnly
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
            }`}
          >
            {filterDefaultTcknOnly ? "Aktif (Süzülüyor)" : "Tümü Gösteriliyor"}
          </button>
        </div>

        {excludedCount > 0 && filterDefaultTcknOnly && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <UserX className="h-3 w-3 shrink-0" />
            Özel TCKN giren {excludedCount} sipariş otomatik süzüldü.
          </p>
        )}

        {/* Search & Batch Select Header */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            {allFilteredSelected ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            Tümünü Seç ({selectedOrderIds.length})
          </button>

          <div className="relative flex-1 max-w-[180px]">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 overflow-y-auto space-y-2 max-h-[620px]">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2 text-slate-400">
            <AlertCircle className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-xs font-semibold">İşlenecek varsayılan sipariş bulunamadı.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelectedForDetail = selectedOrderId === order.id;
            const isCheckedBatch = selectedOrderIds.includes(order.id);

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelectedForDetail
                    ? "bg-blue-600/10 border-blue-500/50 dark:bg-blue-500/15 shadow-sm"
                    : "bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBatchSelect(order.id);
                      }}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {isCheckedBatch ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {order.orderNumber}
                        </span>
                        {order.status === "BALANCED" && (
                          <Badge variant="success" className="text-[10px] py-0 px-1.5">
                            Dengelendi
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      ₺{order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      TCKN: {order.tckn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
