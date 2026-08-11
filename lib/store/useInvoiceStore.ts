import { create } from "zustand";
import { OrderItem } from "@/components/invoice/master-order-list";
import { ExactMatchResult } from "@/services/balancer";
import { CustomCategoryItem } from "@/components/settings/custom-category-form";

export interface CategoryInputRow {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  targetPercent: number;
  vatRate: number;
}

interface InvoiceStoreState {
  orders: OrderItem[];
  selectedOrder: OrderItem | null;
  selectedOrderIds: string[];
  categories: CategoryInputRow[];
  customVatCategories: CustomCategoryItem[];
  calculationResult: ExactMatchResult | null;

  // Actions
  setOrders: (orders: OrderItem[]) => void;
  setSelectedOrder: (order: OrderItem | null) => void;
  setSelectedOrderIds: (ids: string[]) => void;
  toggleBatchSelect: (orderId: string) => void;
  updateOrder: (updatedOrder: OrderItem) => void;

  setCategories: (categories: CategoryInputRow[]) => void;
  addCategory: (row: CategoryInputRow) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, field: keyof CategoryInputRow, value: any) => void;

  setCustomVatCategories: (list: CustomCategoryItem[]) => void;
  addCustomVatCategory: (item: CustomCategoryItem) => void;
  removeCustomVatCategory: (id: string) => void;

  setCalculationResult: (result: ExactMatchResult | null) => void;
}

const defaultInvoiceCategories: CategoryInputRow[] = [
  {
    id: "cat_1",
    name: "Saten Kurdele (Tekstil Malzemesi)",
    minPrice: 50,
    maxPrice: 300,
    targetPercent: 50,
    vatRate: 10,
  },
  {
    id: "cat_2",
    name: "Güneş Gözlüğü (Aksesuar)",
    minPrice: 100,
    maxPrice: 600,
    targetPercent: 30,
    vatRate: 20,
  },
  {
    id: "cat_3",
    name: "Plastik Saç Tokası & Mandallı Klips",
    minPrice: 20,
    maxPrice: 150,
    targetPercent: 20,
    vatRate: 10,
  },
];

export const useInvoiceStore = create<InvoiceStoreState>((set) => ({
  orders: [], // STRICTLY EMPTY
  selectedOrder: null, // STRICTLY NULL
  selectedOrderIds: [],
  categories: defaultInvoiceCategories,
  customVatCategories: [],
  calculationResult: null,

  setOrders: (orders) =>
    set((state) => ({
      orders,
      selectedOrder: state.selectedOrder || (orders.length > 0 ? orders[0] : null),
      selectedOrderIds:
        state.selectedOrderIds.length > 0
          ? state.selectedOrderIds
          : orders.length > 0
          ? [orders[0].id]
          : [],
    })),

  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),

  setSelectedOrderIds: (selectedOrderIds) => set({ selectedOrderIds }),

  toggleBatchSelect: (orderId) =>
    set((state) => {
      const exists = state.selectedOrderIds.includes(orderId);
      const newIds = exists
        ? state.selectedOrderIds.filter((id) => id !== orderId)
        : [...state.selectedOrderIds, orderId];
      return { selectedOrderIds: newIds };
    }),

  updateOrder: (updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
      selectedOrder:
        state.selectedOrder?.id === updatedOrder.id
          ? updatedOrder
          : state.selectedOrder,
    })),

  setCategories: (categories) => set({ categories }),

  addCategory: (row) =>
    set((state) => ({ categories: [...state.categories, row] })),

  removeCategory: (id) =>
    set((state) => ({
      categories:
        state.categories.length > 1
          ? state.categories.filter((c) => c.id !== id)
          : state.categories,
    })),

  updateCategory: (id, field, value) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    })),

  setCustomVatCategories: (customVatCategories) => set({ customVatCategories }),

  addCustomVatCategory: (item) =>
    set((state) => ({
      customVatCategories: [...state.customVatCategories, item],
    })),

  removeCustomVatCategory: (id) =>
    set((state) => ({
      customVatCategories: state.customVatCategories.filter((c) => c.id !== id),
    })),

  setCalculationResult: (calculationResult) => set({ calculationResult }),
}));
