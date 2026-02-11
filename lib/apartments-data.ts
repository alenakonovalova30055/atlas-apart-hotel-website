import { getApartments as getStrapiApartments } from './strapi'

export interface Apartment {
  id: string;
  name: string;
  description: string;
  rooms: string;
  image: string | string[];
  price: number;
  size: string;
  guests: string;
  amenities: string[];
  fullAmenities: string[] | Array<{ title: string; description: string; included: boolean }>;
  isAvailable: boolean;
  shortDescription?: string;
  bedroom?: number;
  bathroom?: number;
  roomCount?: number;
  rules?: { checkIn: string; checkOut: string; smoking: boolean; pets: boolean; description: string };
  bonuses?: Array<{ title: string; description: string; included: boolean }>;
}

// Local fallback data (used when Strapi is unavailable)
export const apartments: Apartment[] = [
  {
    id: "azure",
    name: "Azure",
    description: "Стильные апартаменты в современном дизайне с тёплой, уютной атмосферой. Большая двуспальная кровать с мягким матрасом, сатиновым бельём, тремя подушками разной плотности и двумя большими одеялами. Спальня изолирована и закрывается дверями, в гостиной — просторный двуспальный диван.\n\nТёплый пол по всей зоне, эффектная лазурная ванная с полотенцесушителем. Кухня оснащена всем необходимым. Уютный балкон с комфортными стульями идеально подходит для утреннего кофе.\n\nДля гостей — взрослые и детские халаты, мягкие тапочки, профессиональная косметика и все необходимые косметические принадлежности.\n\nГости часто говорят, что здесь они чувствуют себя как в сказке.",
    rooms: "2 спальных места + 1 гостиная + 1 ванная",
    image: [
      "/apartments/azure-main.jpg",
      "/apartments/azure-1.jpg",
      "/apartments/azure-2.jpg",
      "/apartments/azure-3.jpg",
      "/apartments/azure-4.jpg",
      "/apartments/azure-5.jpg",
      "/apartments/azure-6.jpg",
      "/apartments/azure-7.jpg",
      "/apartments/azure-8.jpg",
      "/apartments/azure-9.jpg"
    ],
    price: 12000,
    size: "45 м²",
    guests: "до 4 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Smart TV", "Кухня"],
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Smart TV",
      "Голосовой помощник Алиса",
      "Кухня, полностью оборудованная",
      "Холодильник",
      "Стиральная машина",
      "Посудомоечная машина",
      "Кофемашина",
      "Фен",
      "Выпрямитель для волос",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ],
    isAvailable: true
  },
  {
    id: "sea-deluxe",
    name: "Морской Делюкс",
    description: "Шикарные апартаменты в спокойном современном стиле с мягкой светло-серой и пастельной палитрой, идеально подходящей для размеренного и комфортного отдыха. Интерьер создаёт ощущение тишины, уюта и лёгкости — здесь легко расслабиться и переключиться от повседневной суеты.\n\nВ апартаментах предусмотрены 2 уютные спальни и просторная гостиная с большим раскладывающимся диваном, удобным как для отдыха, так и для сна. Пространство продумано так, чтобы каждому гостю было комфортно и свободно.\n\nОсобое удовольствие — просторный балкон с невероятным видом на море, где приятно встречать рассветы, проводить тёплые вечера и просто наслаждаться моментом.\n\nВ апартаментах есть всё для по-настоящему приятного отдыха: комфорт, эстетика, продуманные детали и ощущение заботы. Гости часто отмечают, что здесь легко замедлиться, выдохнуть и почувствовать себя в идеальном месте у моря.",
    rooms: "2 кровати + 1 гостиная + 1 ванная",
    image: [
      "/apartments/sea-deluxe/main.jpg",
      "/apartments/sea-deluxe/4.jpg",
      "/apartments/sea-deluxe/7.jpg",
      "/apartments/sea-deluxe/9.jpg",
      "/apartments/sea-deluxe/10.jpg",
      "/apartments/sea-deluxe/11.jpg",
      "/apartments/sea-deluxe/13.jpg",
      "/apartments/sea-deluxe/14.jpg",
      "/apartments/sea-deluxe/15.jpg",
      "/apartments/sea-deluxe/16.jpg"
    ],
    price: 12500,
    size: "55 м²",
    guests: "до 4 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Балкон", "Вид на море"],
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Балкон",
      "Кухня",
      "Микроволновая печь",
      "Телевизор",
      "Вид на море",
      "Кофемашина",
      "Индукционная плита",
      "Стиральная машина",
      "Фен",
      "Холодильник",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ],
    isAvailable: true
  },
  {
    id: "sunrise-terrace",
    name: "Белый Бархат",
    description: "Роскошные апартаменты, идеально подходящие для большой семьи или компании друзей. Просторное пространство включает две отдельные спальни, большую гостиную с кухней и огромный раскладной диван, создавая комфорт для совместного отдыха и личного уединения.\n\nВ апартаментах две полноценные ванные комнаты, одна из которых особенно впечатляет — с эстетичной отдельно стоящей ванной, превращающей ежедневные ритуалы в настоящее удовольствие.\n\nОсобая гордость апартаментов — большая приватная терраса с выходом на улицу и прямым расположением на берегу моря. Здесь море становится частью вашего отдыха: шаг — и вы уже у воды.\n\nЭти апартаменты созданы для того, чтобы провести время вместе красиво, спокойно и с ощущением настоящего люкса и роскоши, когда каждая деталь работает на комфорт и удовольствие гостей.",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    image: [
      "/apartments/luxury-bedroom.jpg",
      "/apartments/white-velvet/11.jpg",
      "/apartments/white-velvet/12.jpg",
      "/apartments/white-velvet/13.jpg",
      "/apartments/white-velvet/14.jpg",
      "/apartments/white-velvet/15.jpg",
      "/apartments/white-velvet/16.jpg",
      "/apartments/white-velvet/17.jpg"
    ],
    price: 25000,
    size: "85 м²",
    guests: "до 3 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Терраса", "Вид на море"],
    fullAmenities: [
      "Кондиционер",
      "Wi-Fi",
      "Smart TV",
      "Голосовой помощник Алиса",
      "Кухня, полностью оборудованная",
      "Холодильник",
      "Стиральная машина",
      "Посудомоечная машина",
      "Кофемашина",
      "Посуда для приготовления пищи",
      "Фен",
      "Фен-выпрямитель для волос",
      "Сейф",
      "Взрослые и детские халаты",
      "Тапочки",
      "Премиум косметика",
      "Полотенца для апартаментов",
      "Пляжные полотенца (с регулярной заменой)",
      "Утюг",
      "Настольные игры",
      "Детская кроватка (по запросу)"
    ],
    isAvailable: true
  },
  {
    id: "ocean-suite",
    name: "Оушен Сьют",
    description: "Люкс апартаменты с панорамным видом на море, современный дизайн и премиум-уровень комфорта",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    image: "/apartments/blur-ocean-suite.jpg",
    price: 28000,
    size: "75 м²",
    guests: "до 4 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Джакузи", "Терраса"],
    fullAmenities: ["Кондиционер", "Wi-Fi", "Джакузи", "Терраса", "Кухня", "Посудомойка", "Стиральная машина", "Халаты и тапочки"],
    isAvailable: false
  },
  {
    id: "white-onyx",
    name: "Белый Оникс",
    description: "Элегантные апартаменты с минималистичным дизайном и видом на горы",
    rooms: "1 спальня + 1 гостиная + 1 ванная",
    image: "/apartments/blur-white-onyx.jpg",
    price: 9500,
    size: "45 м²",
    guests: "до 2 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Мини-бар", "Балкон"],
    fullAmenities: ["Кондиционер", "Wi-Fi", "Мини-бар", "Балкон", "Телевизор", "Холодильник", "Чайник", "Фен"],
    isAvailable: false
  },
  {
    id: "white-porcelain",
    name: "Белый Фарфор",
    description: "Люкс с собственной SPA-зоной: сауна, хамам и массажная комната",
    rooms: "2 спальни + 1 гостиная + 2 ванные",
    image: "/apartments/blur-white-porcelain.jpg",
    price: 28000,
    size: "95 м²",
    guests: "до 2 гостей",
    amenities: ["Климат-контроль", "Wi-Fi", "Сауна", "Хамам"],
    fullAmenities: ["Климат-контроль", "Wi-Fi", "Сауна", "Хамам", "Массаж", "Кухня", "Телевизор", "Мини-кинотеатр"],
    isAvailable: false
  },
  {
    id: "pearl-light",
    name: "Жемчужный Свет",
    description: "Просторные апартаменты для семейного отдыха с отдельной гостиной зоной",
    rooms: "2 спальни + 1 гостиная + 1 ванная",
    image: "/apartments/blur-pearl-light.jpg",
    price: 15000,
    size: "70 м²",
    guests: "до 4 гостей",
    amenities: ["Кондиционер", "Wi-Fi", "Кухня", "Детские удобства"],
    fullAmenities: ["Кондиционер", "Wi-Fi", "Кухня", "Стиральная машина", "Посудомойка", "Детская кроватка", "Детский стул", "Игрушки"],
    isAvailable: false
  },
  {
    id: "soft-gold",
    name: "Мягкое Золото",
    description: "Эксклюзивный пентхаус с панорамной террасой и видом на море",
    rooms: "3 спальни + 1 гостиная + 2 ванные",
    image: "/apartments/blur-soft-gold.jpg",
    price: 35000,
    size: "120 м²",
    guests: "до 4 гостей",
    amenities: ["Климат-контроль", "Wi-Fi", "Терраса", "Панорамный вид"],
    fullAmenities: ["Климат-контроль", "Wi-Fi", "Терраса", "Панорамный вид", "Кухня", "Винотека", "Посудомойка", "Система умного дома"],
    isAvailable: false
  }
];

// Dynamic apartments loader - tries Strapi first, falls back to local data
export async function loadApartments(): Promise<Apartment[]> {
  try {
    const strapiApartments = await getStrapiApartments()
    
    if (strapiApartments.length > 0) {
      console.log(`[Apartments] Loaded ${strapiApartments.length} from Strapi`)
      
      // Transform Strapi data to match local format
      return strapiApartments.map(apt => {
        // Normalize fullAmenities: Strapi returns objects, local data uses strings
        const normalizedFullAmenities = (apt.fullAmenities || []).map((a: any) =>
          typeof a === 'string' ? a : a.title || ''
        )
        return {
          id: apt.id,
          name: apt.name,
          description: apt.description,
          shortDescription: apt.shortDescription,
          rooms: apt.rooms,
          image: apt.image,
          price: apt.price,
          size: apt.size,
          guests: apt.guests,
          amenities: apt.amenities,
          fullAmenities: normalizedFullAmenities,
          isAvailable: apt.isActive ?? true,
          bedroom: apt.bedroom,
          bathroom: apt.bathroom,
          roomCount: apt.roomCount,
          rules: apt.rules,
          bonuses: apt.bonuses,
        }
      })
    }
  } catch (error) {
    console.error('[Apartments] Strapi error, using fallback:', error)
  }
  
  console.log('[Apartments] Using local fallback data')
  return apartments
}

// Get apartment by ID - tries Strapi first
export async function getApartmentById(id: string): Promise<Apartment | undefined> {
  const allApartments = await loadApartments()
  return allApartments.find(apt => apt.id === id)
}

// Get only available apartments
export async function getAvailableApartments(): Promise<Apartment[]> {
  const allApartments = await loadApartments()
  return allApartments.filter(apt => apt.isAvailable)
}
