/**
 * Cloud-Ready Granular VAT Database Service
 * Simulates async API calls to secure cloud DB for retail-specific items
 */

export interface GranularVatItem {
  id: string;
  name: string;
  sku: string;
  vatRate: 1 | 10 | 20;
  categoryGroup: string;
  officialGibMatch: string;
}

const CLOUD_RETAIL_VAT_ITEMS: GranularVatItem[] = [
  {
    id: "vat_item_101",
    name: "Saten Kurdele (Tekstil Malzemesi)",
    sku: "KUR-SAT-01",
    vatRate: 10,
    categoryGroup: "Tuhafiye & Tekstil",
    officialGibMatch: "GİB-201 Tekstil Ürünleri",
  },
  {
    id: "vat_item_102",
    name: "Keten Kurdele (Doğal Elyaf)",
    sku: "KUR-KET-02",
    vatRate: 10,
    categoryGroup: "Tuhafiye & Tekstil",
    officialGibMatch: "GİB-201 Tekstil Ürünleri",
  },
  {
    id: "vat_item_103",
    name: "Güneş Gözlüğü (Aksesuar)",
    sku: "GOZ-GUN-03",
    vatRate: 20,
    categoryGroup: "Optik & Aksesuar",
    officialGibMatch: "GİB-301 Genel Aksesuar",
  },
  {
    id: "vat_item_104",
    name: "Plastik Saç Tokası & Mandallı Klips",
    sku: "TOK-PLS-04",
    vatRate: 10,
    categoryGroup: "Saç Aksesuarı",
    officialGibMatch: "GİB-201 Tekstil & Aksesuar",
  },
  {
    id: "vat_item_105",
    name: "Koli Bandı & Ambalaj Bandı (Büro/Paketleme)",
    sku: "BND-KOL-05",
    vatRate: 20,
    categoryGroup: "Paketleme & Ambalaj",
    officialGibMatch: "GİB-304 Büro Malzemeleri",
  },
  {
    id: "vat_item_106",
    name: "Metal Klipsli Saç Tokası",
    sku: "TOK-MET-06",
    vatRate: 10,
    categoryGroup: "Saç Aksesuarı",
    officialGibMatch: "GİB-201 Tekstil & Aksesuar",
  },
  {
    id: "vat_item_107",
    name: "Optik Gözlük Çerçevesi (Reçeteli Uyumlu)",
    sku: "GOZ-OPT-07",
    vatRate: 10,
    categoryGroup: "Optik & Sağlık",
    officialGibMatch: "GİB-202 Tıbbi Cihazlar",
  },
  {
    id: "vat_item_108",
    name: "Deri Kemer & Cüzdan Aksesuarı",
    sku: "KEM-DER-08",
    vatRate: 20,
    categoryGroup: "Giyim Aksesuarı",
    officialGibMatch: "GİB-301 Genel Aksesuar",
  },
  {
    id: "vat_item_109",
    name: "Hobi Pamuk Dikiş İpliği",
    sku: "IPL-PAM-09",
    vatRate: 10,
    categoryGroup: "Tuhafiye & Tekstil",
    officialGibMatch: "GİB-201 Tekstil Ürünleri",
  },
  {
    id: "vat_item_110",
    name: "Oluklu Karton Ambalaj Kutusu",
    sku: "KUT-OLU-10",
    vatRate: 20,
    categoryGroup: "Paketleme & Ambalaj",
    officialGibMatch: "GİB-304 Ambalaj Ürünleri",
  },
];

/**
 * Async fetch simulation targeting Cloud VAT Database API
 */
export async function fetchVATDatabase(query?: string): Promise<GranularVatItem[]> {
  // Simulate network round-trip to Cloud Database
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!query || !query.trim()) {
    return CLOUD_RETAIL_VAT_ITEMS;
  }

  const q = query.toLowerCase().trim();
  return CLOUD_RETAIL_VAT_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.categoryGroup.toLowerCase().includes(q)
  );
}
