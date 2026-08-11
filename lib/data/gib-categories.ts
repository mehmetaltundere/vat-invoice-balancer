/**
 * Official Turkish GİB (Gelir İdaresi Başkanlığı) VAT Categories Dataset
 * Read-Only Client/Server Reference
 */

export interface GibVatCategory {
  id: string;
  name: string;
  code: string;
  defaultVatRate: 1 | 10 | 20;
  description: string;
}

const RAW_GIB_CATEGORIES: GibVatCategory[] = [
  {
    id: "gib_01",
    name: "Temel Gıda Maddeleri (Un, Ekmek, Süt, Peynir, Yumurta)",
    code: "GIB-101",
    defaultVatRate: 1,
    description: "KDV Kanunu Madde 28 - I Sayılı Liste kapsamındaki temel gıda ürünleri",
  },
  {
    id: "gib_02",
    name: "Tekstil, Konfeksiyon ve Giyim Ürünleri",
    code: "GIB-201",
    defaultVatRate: 10,
    description: "II Sayılı Liste - İplik, kumaş, giyim eşyası ve ayakkabı",
  },
  {
    id: "gib_03",
    name: "Elektronik Cihazlar, Telefon ve Bilgisayar",
    code: "GIB-301",
    defaultVatRate: 20,
    description: "Genel Oran - Tüketici elektroniği, bilgisayar, cep telefonu",
  },
  {
    id: "gib_04",
    name: "Kozmetik, Parfüm ve Kişisel Bakım Ürünleri",
    code: "GIB-302",
    defaultVatRate: 20,
    description: "Genel Oran - Güzellik, hijyen, parfüm ve şampuan ürünleri",
  },
  {
    id: "gib_05",
    name: "Optik Gözlük, Reçeteli İlaç ve Tıbbi Cihazlar",
    code: "GIB-202",
    defaultVatRate: 10,
    description: "II Sayılı Liste - Tıbbi donanım, ortopedik cihazlar, reçeteli ilaç",
  },
  {
    id: "gib_06",
    name: "Kitap, Dergi ve Süreli Yayınlar",
    code: "GIB-102",
    defaultVatRate: 1,
    description: "I Sayılı Liste - Basılı kitap, gazete ve akademik dergiler",
  },
  {
    id: "gib_07",
    name: "Mobilya, Ev Dekorasyon ve Mutfak Eşyası",
    code: "GIB-303",
    defaultVatRate: 20,
    description: "Genel Oran - Ev mobilyası, züccaciye ve aydınlatma",
  },
  {
    id: "gib_08",
    name: "Temizlik ve Deterjan Malzemeleri",
    code: "GIB-203",
    defaultVatRate: 10,
    description: "II Sayılı Liste - Sabun, deterjan, çamaşır suyu, dezenfektan",
  },
  {
    id: "gib_09",
    name: "Restoran, Kafeterya ve Yemek Hizmetleri",
    code: "GIB-204",
    defaultVatRate: 10,
    description: "II Sayılı Liste - Hazır yemek servis ve lokanta hizmetleri",
  },
  {
    id: "gib_10",
    name: "Kırtasiye ve Büro Malzemeleri",
    code: "GIB-304",
    defaultVatRate: 20,
    description: "Genel Oran - Kalem, kağıt, dosyalama ürünleri (Defterler %10)",
  },
  {
    id: "gib_11",
    name: "Otomotiv, Yedek Parça ve Aksesuar",
    code: "GIB-305",
    defaultVatRate: 20,
    description: "Genel Oran - Motorlu kara taşıtları ve aksamları",
  },
  {
    id: "gib_12",
    name: "Spor Malzemeleri ve Oyuncak",
    code: "GIB-306",
    defaultVatRate: 20,
    description: "Genel Oran - Spor ekipmanları, hobi malzemeleri, çocuk oyuncakları",
  },
];

/**
 * Freeze array to enforce read-only compliance on client-side
 */
export const OFFICIAL_GIB_VAT_CATEGORIES: ReadonlyArray<GibVatCategory> =
  Object.freeze(RAW_GIB_CATEGORIES);
