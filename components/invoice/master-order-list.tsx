"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  CheckSquare,
  Square,
  Filter,
  UserX,
  Search,
  Pencil,
  Check,
  X,
  ChevronDown,
  Inbox,
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
  status: "PENDING" | "BALANCED" | "NEW" | "PROCESSING" | "SHIPPED";
}

interface MasterOrderListProps {
  orders: OrderItem[];
  selectedOrderId: string | null;
  onSelectOrder: (order: OrderItem) => void;
  selectedOrderIds: string[];
  onToggleBatchSelect: (orderId: string) => void;
  onSelectAllBatch: (orderIds: string[]) => void;
  onUpdateOrder: (updatedOrder: OrderItem) => void;
}

export function MasterOrderList({
  orders,
  selectedOrderId,
  onSelectOrder,
  selectedOrderIds,
  onToggleBatchSelect,
  onSelectAllBatch,
  onUpdateOrder,
}: MasterOrderListProps) {
  const [filterDefaultTcknOnly, setFilterDefaultTcknOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTckn, setEditTckn] = useState("");

  const isDefaultOrBlankTckn = (tckn?: string | null): boolean => {
    if (!tckn) return true;
    const trimmed = tckn.trim();
    return trimmed === "" || trimmed === "11111111111";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTcknRule = filterDefaultTcknOnly
      ? isDefaultOrBlankTckn(order.tckn)
      : true;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PENDING"
        ? order.status === "PENDING" || order.status === "NEW" || order.status === "PROCESSING"
        : order.status === statusFilter;

    return matchesTcknRule && matchesSearch && matchesStatus;
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

  const startInlineEdit = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    setEditingOrderId(order.id);
    setEditName(order.customerName);
    setEditTckn(order.tckn || "11111111111");
  };

  const saveInlineEdit = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    onUpdateOrder({
      ...order,
      customerName: editName.trim() || order.customerName,
      tckn: editTckn.trim() || "11111111111",
    });
    setEditingOrderId(null);
  };

  const cancelInlineEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrderId(null);
  };

  return (
    <Card className="flex flex-col h-full bg-white border border-slate-200">
      <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#0066CC]" />
            IdeaSoft Sipariş Akışı
          </CardTitle>
          <Badge variant="outline" className="text-[11px] font-semibold">
            {filteredOrders.length} Sipariş
          </Badge>
        </div>

        {/* TCKN Strict Filter Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#0066CC]" />
            <span className="font-semibold text-slate-700">
              Filtre: Boş veya Varsayılan TCKN
            </span>
          </div>
          <button
            onClick={() => setFilterDefaultTcknOnly(!filterDefaultTcknOnly)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-[11px] cursor-pointer hover:scale-[1.02] active:scale-95 ${
              filterDefaultTcknOnly
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {filterDefaultTcknOnly ? "Süzülüyor (11111111111)" : "Tümü"}
          </button>
        </div>

        {/* E-COMMERCE STATUS SELECT DROPDOWN */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sipariş Durumu:
          </span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 hover:border-slate-400 font-semibold text-xs text-slate-800 py-1.5 pl-3 pr-8 rounded-xl shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
            >
              <option value="ALL">Tüm Siparişler</option>
              <option value="NEW">Yeni Siparişler</option>
              <option value="PROCESSING">Hazırlanıyor</option>
              <option value="PENDING">Bekliyor / İşlenecek</option>
              <option value="SHIPPED">Kargolandı</option>
              <option value="BALANCED">Faturalandırıldı</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {excludedCount > 0 && filterDefaultTcknOnly && (
          <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
            <UserX className="h-3 w-3 shrink-0" />
            Özel TCKN giren {excludedCount} kurumsal sipariş süzüldü.
          </p>
        )}

        {/* Search & Batch Select Header */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#0066CC] transition-colors cursor-pointer"
          >
            {allFilteredSelected ? (
              <CheckSquare className="h-4 w-4 text-[#0066CC]" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            Toplu Seçim ({selectedOrderIds.length})
          </button>

          <div className="relative flex-1 max-w-[180px]">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex-1 overflow-y-auto space-y-2 max-h-[620px]">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3 text-slate-400 my-auto">
            <div className="p-3 rounded-2xl bg-slate-100 w-fit mx-auto text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto leading-relaxed">
              Bekleyen sipariş bulunamadı. IdeaSoft API üzerinden yeni sipariş bekleniyor...
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelectedForDetail = selectedOrderId === order.id;
            const isCheckedBatch = selectedOrderIds.includes(order.id);
            const isEditing = editingOrderId === order.id;

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelectedForDetail
                    ? "bg-blue-50/80 border-blue-300 shadow-2xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBatchSelect(order.id);
                      }}
                      className="text-slate-400 hover:text-[#0066CC] transition-colors cursor-pointer"
                    >
                      {isCheckedBatch ? (
                        <CheckSquare className="h-4 w-4 text-[#0066CC]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {order.orderNumber}
                        </span>
                        {order.status === "BALANCED" && (
                          <Badge variant="success" className="text-[10px] py-0 px-1.5">
                            Faturalandırıldı
                          </Badge>
                        )}
                      </div>

                      {/* Inline Customer Edit Mode */}
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Müşteri Adı"
                            className="px-2 py-1 rounded bg-white border border-blue-300 text-xs font-medium text-slate-900 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={editTckn}
                            onChange={(e) => setEditTckn(e.target.value)}
                            placeholder="TCKN"
                            className="w-24 px-2 py-1 rounded bg-white border border-blue-300 text-xs font-mono text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={(e) => saveInlineEdit(e, order)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-xs text-slate-600 font-medium truncate">
                            {order.customerName}
                          </p>
                          <button
                            onClick={(e) => startInlineEdit(e, order)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#0066CC] p-0.5 transition-opacity cursor-pointer"
                            title="Müşteri Bilgilerini Düzenle"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      ₺{order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      TCKN: {order.tckn || "Boş (11111111111)"}
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
