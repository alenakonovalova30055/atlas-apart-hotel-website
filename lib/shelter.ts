// Shelter API Integration
// PMS REST API: https://pms.frontdesk24.ru/sheltercloudapi
// Online Widget API: https://pms.frontdesk24.ru/api/online

const SHELTER_PMS_API_URL = "https://pms.frontdesk24.ru/sheltercloudapi";
const SHELTER_ONLINE_API_URL = "https://pms.frontdesk24.ru/api/online";

// Маппинг ID апартаментов сайта на категории в Shelter
// Каждый апартамент = уникальная категория (чтобы избежать овербукинга)
// 
// При добавлении нового апартамента через Strapi CMS:
// 1. Создайте категорию в Shelter
// 2. Включите "Можно бронировать онлайн = Да"
// 3. Скопируйте categoryID из URL редактирования категории
// 4. Добавьте в Strapi поле shelterCategoryId с этим ID
//
// ТЕКУЩИЙ МАППИНГ (обновлен 2026-02-01):
// - azure → Азур (categoryID: 56017)
// - sea-deluxe → Морской делюкс (categoryID: 56018)
// - sunrise-terrace → Белый бархат (categoryID: 56020)
// 
// ВАЖНО: Убедитесь что в Shelter для этих категорий включено "Можно бронировать онлайн = Да"!
//
// Тарифы (обновлены 2026-02-01):
// - Normal (83995) - стандартный тариф
// - 3-я ночь в подарок (81079) - каждая 3-я ночь бесплатно
// - Last min -2000 руб (83921) - скидка при бронировании с 22:00 предыдущего дня

export const SHELTER_CATEGORY_MAPPING: Record<string, number> = {
  // Активные апартаменты (соответствуют ID в apartments-data.ts)
  "azure": 56017,            // Азур
  "sea-deluxe": 56018,       // Морской делюкс
  "sunrise-terrace": 56020,  // Белый бархат
  
  // Зарезервировано для будущих апартаментов:
  // "apartment-id": 55981,   // Стандарт 3
  // "apartment-id": 55988,   // Стандарт 4
  // "apartment-id": 55989,   // Стандарт 5
  // "apartment-id": 55990,   // Стандарт 6
};

// ID тарифов в Shelter
export const SHELTER_TARIFFS = {
  NORMAL: 83995,           // Стандартный тариф
  THIRD_NIGHT_FREE: 81079, // 3-я ночь в подарок
  LAST_MINUTE: 83921,      // Last min -2000 руб
};

// Получить Shelter categoryID по ID апартамента на сайте
// В будущем это будет браться из Strapi (поле shelterCategoryId)
export function getShelterCategoryId(apartmentId: string, strapiCategoryId?: number): number {
  // Если передан ID из Strapi - используем его (приоритет)
  if (strapiCategoryId) {
    return strapiCategoryId;
  }
  
  // Иначе используем хардкод маппинг
  const categoryId = SHELTER_CATEGORY_MAPPING[apartmentId];
  
  if (!categoryId) {
    console.warn(`[Shelter] No category mapping for apartment: ${apartmentId}, using default`);
    return 56017; // Азур по умолчанию
  }
  
  return categoryId;
}

interface ShelterApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Базовый GET запрос к Shelter PMS REST API
async function shelterGet<T>(endpoint: string): Promise<ShelterApiResponse<T>> {
  const token = process.env.SHELTER_API_TOKEN;

  if (!token) {
    console.error("[Shelter API] Missing API token");
    return {
      success: false,
      error: "Shelter API token not configured",
    };
  }

  try {
    const url = `${SHELTER_PMS_API_URL}${endpoint}`;
    console.log(`[Shelter API] GET ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();
    console.log(`[Shelter API] Response status: ${response.status}`);
    console.log(`[Shelter API] Response: ${responseText.substring(0, 500)}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${responseText}`,
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid JSON response",
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error("[Shelter API] Request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Базовый POST запрос к Shelter Online API
// Используем token в теле И Bearer в заголовке для совместимости
async function shelterPost<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<ShelterApiResponse<T>> {
  const token = process.env.SHELTER_API_TOKEN;

  if (!token) {
    console.error("[Shelter API] Missing API token");
    return {
      success: false,
      error: "Shelter API token not configured",
    };
  }

  try {
    const url = `${SHELTER_PMS_API_URL}${endpoint}`;
    
    console.log(`[Shelter API] POST ${url}`);
    console.log(`[Shelter API] Request body:`, JSON.stringify(body, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log(`[Shelter API] Response status: ${response.status}`);
    console.log(`[Shelter API] Response: ${responseText.substring(0, 500)}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${responseText}`,
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid JSON response",
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error("[Shelter API] Request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// POST запрос к Shelter Online Widget API (для getVariants, putOrder)
async function shelterOnlinePost<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<ShelterApiResponse<T>> {
  // Online Widget API использует отдельный токен
  const token = process.env.SHELTER_ONLINE_TOKEN;

  if (!token) {
    console.error("[Shelter Online API] Missing SHELTER_ONLINE_TOKEN");
    return {
      success: false,
      error: "Shelter Online API token not configured. Please add SHELTER_ONLINE_TOKEN environment variable.",
    };
  }

  try {
    const url = `${SHELTER_ONLINE_API_URL}${endpoint}`;
    
    // Для putOrder токен должен быть внутри data.token
    // Для остальных методов (getVariants, getHotelParams) токен на верхнем уровне
    let requestBody: Record<string, unknown>;
    
    if (endpoint === "/putOrder" && body.data) {
      // putOrder: добавляем token внутрь data
      requestBody = {
        data: {
          token,
          ...(body.data as Record<string, unknown>),
        }
      };
    } else {
      // Другие методы: token на верхнем уровне
      requestBody = {
        token,
        ...body,
      };
    }
    
    console.log(`[Shelter Online API] POST ${url}`);
    console.log(`[Shelter Online API] Token first 8 chars:`, token.substring(0, 8));
    console.log(`[Shelter Online API] Request body:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log(`[Shelter Online API] Response status: ${response.status}`);
    console.log(`[Shelter Online API] Response: ${responseText.substring(0, 1000)}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${responseText}`,
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid JSON response",
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error("[Shelter Online API] Request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Типы данных
export interface HotelParams {
  hotelName?: string;
  rooms?: Array<{
    id: number;
    name: string;
    roomNumber: string;
  }>;
  categories?: Array<{
    id: number;
    name: string;
  }>;
  [key: string]: unknown;
}

export interface RoomVariant {
  signatureId: string;
  roomId: number;
  roomName: string;
  roomNumber: string;
  categoryId: number;
  categoryName: string;
  price: number;
  pricePerNight: number;
  meals?: string;
  [key: string]: unknown;
}

export interface VariantsResponse {
  variants?: RoomVariant[];
  [key: string]: unknown;
}

export interface PaymentOption {
  id: number;
  name: string;
  type: string;
  [key: string]: unknown;
}

export interface OrderResponse {
  orderId?: string;
  orderToken?: string;
  confirmationNumber?: string;
  status?: string;
  [key: string]: unknown;
}

// Получить параметры отеля (справочники, настройки)
export async function getHotelParams(): Promise<ShelterApiResponse<HotelParams>> {
  return shelterGet<HotelParams>("/getHotelParams");
}

// Структура ответа getVariants - массив из 6 массивов
export interface GetVariantsData {
  data: [
    CategoryInfo[],      // [0] категории номеров
    CategoryOption[],    // [1] опции категорий
    TariffInfo[],        // [2] тарифы и акции
    TariffOption[],      // [3] опции тарифов
    MediaInfo[],         // [4] фото/видео
    BookingVariant[]     // [5] варианты бронирования
  ];
}

export interface CategoryInfo {
  id: number;
  name: string;
  description: string | null;
  availableRooms: number;
  roomArea: string | null;
  mainBeds: number;
  extraBeds: number;
}

export interface CategoryOption {
  roomCategoryID: number;
  roomCategoryOptionID: number;
}

export interface TariffInfo {
  id: number;
  name: string;
  isPromotion: boolean;
  description: string | null;
}

export interface TariffOption {
  tariffID: number;
  isPromotion: boolean;
  tariffOptionID: number;
}

export interface MediaInfo {
  roomCategoryID: number;
  url: string;
  urlLarge: string;
  isVideo: boolean;
}

export interface BookingVariant {
  roomCategoryID: number;
  tariffID: number;
  isPromotion: boolean;
  accmdId: number;
  accmdName: string;
  price: number;
  priceRub: number;
  priceWithoutDiscount: number;
  totalDiscountPercent: number;
  prepaymentRub: number;
  amountOfAdults: number;
  amountOfChildrenWithBeds: number;
  signature: string;  // Уникальная подпись для putOrder!
}

// PMS REST API типы
export interface PmsRoom {
  id: number;
  number: string;
  name: string;
  roomTypeId: number;
  roomTypeName: string;
  building: string;
  stage: number;
  comment: string;
}

export interface PmsTariff {
  id: number;
  name: string;
  dateFrom: string;
  dateUntil: string;
  allowOnline: boolean;
  prepayment: number;
  prepaymentType: number;
}

export interface PmsReservation {
  id: number;
  roomId: number;
  roomNumber: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  guestName: string;
}

// Получить список номеров
export async function getRooms(): Promise<ShelterApiResponse<PmsRoom[]>> {
  return shelterGet<PmsRoom[]>("/Rooms");
}

// Получить список тарифов
export async function getTariffs(): Promise<ShelterApiResponse<PmsTariff[]>> {
  return shelterGet<PmsTariff[]>("/Tariffs");
}

// Получить список броней за период (старый формат)
export async function getReservations(params: {
  dateFrom: string;
  dateTo: string;
  roomId?: number;
}): Promise<ShelterApiResponse<PmsReservation[]>> {
  const filter: Record<string, unknown> = {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
  
  if (params.roomId) {
    filter.roomId = params.roomId;
  }
  
  return shelterPost<PmsReservation[]>("/Reservations/ByFilter", filter);
}

// Получить список броней по фильтру через POST /Reservations/ByFilter
// Важно: pagination.count должен быть <= 50
export async function getReservationsByFilter(params: {
  from?: string;
  until?: string;
  roomId?: number;
}): Promise<ShelterApiResponse<{ count: number; items: PmsReservation[] }>> {
  // ReservationFilterDto - фильтруем по roomId чтобы получить меньше результатов
  const filter: Record<string, unknown> = {
    pagination: {
      from: 0,
      count: 50, // Максимум 50 по ограничению API
    },
  };
  
  // Добавляем фильтр по датам
  if (params.from) {
    filter.from = params.from;
  }
  if (params.until) {
    filter.until = params.until;
  }
  // Фильтруем по конкретному номеру - это ключевой параметр для уменьшения результатов
  if (params.roomId) {
    filter.roomId = params.roomId;
  }
  
  console.log("[v0] getReservationsByFilter POST:", JSON.stringify(filter));
  
  return shelterPost<{ count: number; items: PmsReservation[] }>("/Reservations/ByFilter", filter);
}

// Вариант бронирования с тарифом
export interface BookingVariantWithTariff {
  signature: string;
  roomCategoryID: number;
  roomCategoryName: string;
  tariffID: number;
  tariffName: string;
  price: number;
  priceRub: number;
  priceWithoutDiscount: number;
  prepaymentRub: number;
  amountOfAdults: number;
}

// Результат проверки доступности
export interface AvailabilityResult {
  available: boolean;
  room?: PmsRoom;
  // Основной вариант (первый/стандартный тариф)
  variant?: BookingVariantWithTariff;
  // Все доступные варианты с разными тарифами для выбора
  allVariants?: BookingVariantWithTariff[];
  // Словарь тарифов: id -> name
  tariffs?: Record<number, string>;
  error?: string;
}

// Проверить доступность номера через Online Widget API (getVariants)
// getVariants возвращает только СВОБОДНЫЕ номера, поэтому если категория отсутствует - номер занят
export async function checkAvailability(params: {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenAges?: string;
}): Promise<AvailabilityResult> {
  console.log("[v0] checkAvailability called:", params);
  
  const categoryId = getShelterCategoryId(params.apartmentId);
  console.log("[v0] Category ID:", categoryId);

  // Используем ТОЛЬКО getVariants согласно официальной документации Shelter
  // getVariants возвращает варианты размещения только если номер свободен
  // Если массив вариантов (data[5]) пустой - номер занят
  const variantsResult = await getVariantsOnline({
    dateFrom: params.checkIn,
    dateTo: params.checkOut,
    adults: params.adults,
    childrenAges: params.childrenAges,
  });
  
  console.log("[v0] getVariantsOnline success:", variantsResult.success);
  console.log("[v0] getVariantsOnline raw response:", JSON.stringify(variantsResult.data).substring(0, 1000));
  
  if (!variantsResult.success || !variantsResult.data) {
    console.log("[v0] getVariantsOnline error:", variantsResult.error);
    return { 
      available: false, 
      error: variantsResult.error || "Не удалось проверить доступность" 
    };
  }
  
  const data = variantsResult.data;
  
  // Структура ответа getVariants согласно документации:
  // data[0] - категории номеров
  // data[1] - опции категорий
  // data[2] - тарифы и акции
  // data[3] - опции тарифов
  // data[4] - фото и видео
  // data[5] - варианты бронирования (самое важное!)
  const categories = data.data?.[0] || [];
  const tariffs = data.data?.[2] || [];
  const bookingVariants = data.data?.[5] || [];
  
  console.log("[v0] Categories:", categories.length, categories.map((c: CategoryInfo) => `${c.id}:${c.name}:avail=${c.availableRooms}`));
  console.log("[v0] Tariffs:", tariffs.map((t: TariffInfo) => `${t.id}:${t.name}`));
  console.log("[v0] Booking variants:", bookingVariants.length);
  
  // ВАЖНО: Проверяем availableRooms в категории - это реальное количество свободных номеров
  // API может возвращать варианты бронирования даже если availableRooms = 0
  const ourCategory = categories.find((c: CategoryInfo) => c.id === categoryId);
  
  if (ourCategory && ourCategory.availableRooms === 0) {
    console.log("[v0] Category availableRooms is 0 - room is occupied");
    return { 
      available: false, 
      error: "Номер занят на выбранные даты" 
    };
  }
  
  // Если нет вариантов бронирования - номер занят на эти даты
  if (bookingVariants.length === 0) {
    console.log("[v0] No booking variants - room is occupied");
    return { 
      available: false, 
      error: "Номер занят на выбранные даты" 
    };
  }
  
  // Создаем словарь тарифов: id -> name
  const tariffsMap: Record<number, string> = {};
  for (const t of tariffs) {
    tariffsMap[t.id] = t.name;
  }
  
  // Собираем ВСЕ варианты для нашей категории с разными тарифами
  const categoryVariants = bookingVariants.filter((v: BookingVariant) => v.roomCategoryID === categoryId);
  
  console.log("[v0] Variants for our category:", categoryVariants.length);
  
  // ВАЖНО: Если нет вариантов для нашей категории - это может быть из-за:
  // 1. Номер занят на эти даты
  // 2. Количество гостей превышает вместимость номера
  // 3. Ошибка конфигурации в Shelter
  // НЕ берем варианты из других категорий, чтобы избежать овербукинга
  if (categoryVariants.length === 0) {
    // Проверяем, есть ли наша категория в списке вообще
    const ourCategoryInfo = categories.find((c: CategoryInfo) => c.id === categoryId);
    
    if (!ourCategoryInfo) {
      // Категория не возвращается API - скорее всего, не подходит по количеству гостей
      // или занята на эти даты
      console.log("[v0] Category", categoryId, "not in API response - likely occupied or guest count exceeds capacity");
      console.log("[v0] Available categories:", categories.map((c: CategoryInfo) => `${c.id}:${c.name}:beds=${c.mainBeds}`));
      return {
        available: false,
        error: `Номер недоступен для ${params.adults} гостей или занят на выбранные даты`,
      };
    }
    
    // Категория есть, но нет вариантов - проблема с тарифами в Shelter
    console.error("[v0] ERROR: No variants for category", categoryId, "- check tariffs/prices in Shelter!");
    console.log("[v0] Available categories in response:", categories.map((c: CategoryInfo) => `${c.id}:${c.name}`));
    return {
      available: false,
      error: `Категория номера не настроена для онлайн-бронирования. Обратитесь к администратору.`,
    };
  }
  
  const variantsToUse = categoryVariants;
  console.log("[v0] All variants with tariffs:", variantsToUse.map((v: BookingVariant) => 
    `tariff=${v.tariffID}(${tariffsMap[v.tariffID]}), price=${v.price}`
  ));
  
  // Преобразуем в формат BookingVariantWithTariff
  const allVariants: BookingVariantWithTariff[] = variantsToUse.map((v: BookingVariant) => {
    const cat = categories.find((c: CategoryInfo) => c.id === v.roomCategoryID);
    return {
      signature: v.signature,
      roomCategoryID: v.roomCategoryID,
      roomCategoryName: cat?.name || "Стандарт",
      tariffID: v.tariffID,
      tariffName: tariffsMap[v.tariffID] || "Стандартный тариф",
      price: v.price,
      priceRub: v.priceRub,
      priceWithoutDiscount: v.priceWithoutDiscount,
      prepaymentRub: v.prepaymentRub,
      amountOfAdults: params.adults,
    };
  });
  
  // Основной вариант - первый (обычно стандартный тариф Normal)
  const mainVariant = allVariants[0];
  
  console.log("[v0] Selected main variant:", {
    categoryId: mainVariant.roomCategoryID,
    categoryName: mainVariant.roomCategoryName,
    tariffID: mainVariant.tariffID,
    tariffName: mainVariant.tariffName,
    price: mainVariant.price,
  });

  return {
    available: true,
    variant: mainVariant,
    allVariants,
    tariffs: tariffsMap,
  };
}

// Получить варианты бронирования через Online Widget API
export async function getVariantsOnline(params: {
  dateFrom: string;
  dateTo: string;
  adults: number;
  childrenAges?: string;
}): Promise<ShelterApiResponse<GetVariantsData>> {
  // Минимальный формат запроса согласно документации Shelter
  // token добавляется автоматически в shelterOnlinePost
  const room: Record<string, unknown> = {
    adults: params.adults,
  };
  
  // kidsAges - возраста детей через запятую, если нет - не передавать
  if (params.childrenAges) {
    room.kidsAges = params.childrenAges;
  }
  
  const body: Record<string, unknown> = {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    rooms: [room],
  };
  
  return shelterOnlinePost<GetVariantsData>("/getVariants", body);
}

// Получить способы оплаты
export async function getPaymentOptions(): Promise<ShelterApiResponse<PaymentOption[]>> {
  return shelterGet<PaymentOption[]>("/getPaymentOptions");
}

// Тип для ответа getAvailableDates
interface AvailableDateInfo {
  roomCategoryID: number;
  date: string;
  price: number;
}

// Получить доступные даты и цены через Online Widget API
export async function getAvailableDates(params: {
  dateFrom: string;
  dateTo: string;
  roomCategoryID: number;
}): Promise<ShelterApiResponse<AvailableDateInfo[]>> {
  const body: Record<string, unknown> = {
    language: "ru", // Обязательный параметр!
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    roomCategoryID: params.roomCategoryID,
  };
  
  return shelterOnlinePost<AvailableDateInfo[]>("/getAvailableDates", body);
}

// Создать бронирование через Online Widget API (putOrder)
export async function createOrder(params: {
  signature: string; // signature из getVariants
  dateFrom: string; // YYYY-MM-DD
  dateTo: string;
  roomCategoryID: number;
  tariffID: number;
  price: number; // итоговая цена со скидкой
  priceWithoutDiscount?: number; // цена без скидки
  discountPercent?: number; // процент скидки
  guestsCount: number;
  guest: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
  };
  comment?: string;
  paymentMethodID?: number;
}): Promise<ShelterApiResponse<OrderResponse>> {
  // Формат putOrder для Online Widget API
  const body: Record<string, unknown> = {
    data: {
      source: "atlas-apart.ru",
      paymentMethodID: params.paymentMethodID || 2, // 2 = Оплата в отеле
      comment: params.comment || "",
      customer: {
        email: params.guest.email,
        phone: params.guest.phone,
        surname: params.guest.lastName,
        name: params.guest.firstName,
        secondName: params.guest.middleName || "",
      },
      reservations: [
        {
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
          roomCategoryID: params.roomCategoryID,
          tariffID: params.tariffID,
          isPromotion: 0,
          promocode: null,
          guestsCount: params.guestsCount,
          bedPlace: 0,
          currency: "",
          price: params.price,
          totalDiscountPercent: params.discountPercent || 0,
          promocodeDiscountPercent: 0,
          promotionDiscountPercent: params.discountPercent || 0,
          priceWithoutDiscount: params.priceWithoutDiscount || params.price,
          priceRub: params.price,
          prepaymentRub: 0,
          prepaymentCurrency: 0,
          signature: params.signature,
          guests: [
            {
              surname: params.guest.lastName,
              name: params.guest.firstName,
              secondName: params.guest.middleName || "",
              email: params.guest.email,
              phone: params.guest.phone,
              withoutBed: false,
            }
          ],
        }
      ],
      extraServices: [],
    }
  };
  
  console.log("[v0] Creating reservation with putOrder:", JSON.stringify(body, null, 2));
  
  return shelterOnlinePost<OrderResponse>("/putOrder", body);
}

// Получить информацию о бронировании
export async function getOrder(orderToken: string): Promise<ShelterApiResponse<OrderResponse>> {
  return shelterGet<OrderResponse>("/getOrder", { orderToken });
}

// Получить занятые даты для апартамента на период
// Возвращает массив дат в формате "YYYY-MM-DD" когда номер ТОЧНО занят
// Логика: дата считается занятой ТОЛЬКО если API явно вернул availableRooms = 0
// Если API не вернул категорию или вернул ошибку - считаем дату свободной (оптимистичный подход)
export async function getOccupiedDates(params: {
  apartmentId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}): Promise<ShelterApiResponse<string[]>> {
  const categoryId = getShelterCategoryId(params.apartmentId);
  
  // Парсим даты
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  const occupiedDates: string[] = [];
  
  // Собираем все даты для проверки
  const datesToCheck: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    datesToCheck.push(d.toISOString().split('T')[0]);
  }
  
  // Проверяем даты пачками по 7 параллельно
  const batchSize = 7;
  for (let i = 0; i < datesToCheck.length; i += batchSize) {
    const batch = datesToCheck.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map(async (dateStr) => {
        const nextDate = new Date(dateStr);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().split('T')[0];
        
        const result = await getVariantsOnline({
          dateFrom: dateStr,
          dateTo: nextDateStr,
          adults: 2,
        });
        
        if (result.success && result.data) {
          const categories = result.data.data?.[0] || [];
          
          // Ищем нашу категорию в ответе
          const ourCategory = categories.find(
            (cat: CategoryInfo) => cat.id === categoryId
          );
          
          // Дата занята ТОЛЬКО если категория найдена и availableRooms === 0
          if (ourCategory && ourCategory.availableRooms === 0) {
            return dateStr;
          }
        }
        
        // Если категория не найдена, API вернул ошибку, или availableRooms > 0 
        // - считаем дату свободной
        return null;
      })
    );
    
    // Добавляем только реально занятые даты
    results.forEach(date => {
      if (date) occupiedDates.push(date);
    });
  }
  
  console.log(`[v0] getOccupiedDates for ${params.apartmentId}: checked ${datesToCheck.length} dates, found ${occupiedDates.length} occupied`);
  
  return {
    success: true,
    data: occupiedDates,
  };
}

// Общий запрос к Shelter PMS REST API
async function shelterRequest<T>(
  endpoint: string,
  method: string,
  body?: Record<string, unknown>
): Promise<ShelterApiResponse<T>> {
  const token = process.env.SHELTER_API_TOKEN;

  if (!token) {
    console.error("[Shelter API] Missing API token");
    return {
      success: false,
      error: "Shelter API token not configured",
    };
  }

  try {
    const url = `${SHELTER_PMS_API_URL}${endpoint}`;
    console.log(`[Shelter API] ${method} ${url}`);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseText = await response.text();
    console.log(`[Shelter API] Response status: ${response.status}`);
    console.log(`[Shelter API] Response: ${responseText.substring(0, 500)}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${responseText}`,
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid JSON response",
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error("[Shelter API] Request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Получить все доступные варианты
async function getVariants(params: {
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenAges?: string;
}): Promise<ShelterApiResponse<GetVariantsData>> {
  return shelterPost<GetVariantsData>("/getVariants", params);
}

// Объявляем totalPrice переменную
let totalPrice: number = 0;
