/**
 * IdeaSoft API Integration Service
 * Responsible for fetching raw ecommerce orders and customer data
 */

export interface IdeaSoftOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  vatAmount: number;
  status: "PENDING" | "BALANCED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  itemsCount: number;
}

export async function fetchIdeaSoftOrders(): Promise<IdeaSoftOrder[]> {
  // Placeholder API call integration
  return [
    {
      id: "ord_101",
      orderNumber: "IS-2026-8801",
      customerName: "Ahmet Yılmaz",
      totalAmount: 14500.0,
      vatAmount: 2900.0,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      itemsCount: 3,
    },
    {
      id: "ord_102",
      orderNumber: "IS-2026-8802",
      customerName: "Mehmet Demir",
      totalAmount: 8200.5,
      vatAmount: 1640.1,
      status: "PENDING",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      itemsCount: 1,
    },
    {
      id: "ord_103",
      orderNumber: "IS-2026-8803",
      customerName: "Ayşe Kaya",
      totalAmount: 23100.0,
      vatAmount: 4620.0,
      status: "BALANCED",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      itemsCount: 5,
    },
  ];
}
