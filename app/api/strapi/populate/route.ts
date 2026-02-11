import { NextResponse } from "next/server";

const STRAPI_URL =
	"https://whimsical-laughter-bb3c04df0e.strapiapp.com";
const STRAPI_TOKEN =
	"f10c68d75349960ef64637fadf78996bf5388110dccd846dfa76dfbc1b88ba65bd3ea697d4c2d77ddbf76117316135731a1871966a7431acc724f284f04df25d3facf89bc52f066b5887c83076709ebdf0826609628d5a88042e5e6ebfb1300513558fe14665e515aafbde13cda59e6598168ee94d0cba72c2c04d047c97fe58";

async function strapiPost(
	endpoint: string,
	data: Record<string, unknown>,
) {
	try {
		const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${STRAPI_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		const text = await res.text();
		let json: any;
		try {
			json = JSON.parse(text);
		} catch {
			json = { raw: text };
		}
		return { status: res.status, ok: res.ok, data: json };
	} catch (e: any) {
		return {
			status: 0,
			ok: false,
			data: { error: e.message },
		};
	}
}

async function strapiPut(
	endpoint: string,
	data: Record<string, unknown>,
) {
	try {
		const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${STRAPI_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		const text = await res.text();
		let json: any;
		try {
			json = JSON.parse(text);
		} catch {
			json = { raw: text };
		}
		return { status: res.status, ok: res.ok, data: json };
	} catch (e: any) {
		return {
			status: 0,
			ok: false,
			data: { error: e.message },
		};
	}
}

async function strapiGet(endpoint: string) {
	try {
		const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
			headers: {
				Authorization: `Bearer ${STRAPI_TOKEN}`,
				"Content-Type": "application/json",
			},
		});
		if (!res.ok) return null;
		const text = await res.text();
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	} catch {
		return null;
	}
}

// Upsert helper: POST, if 400 -> find by filter and PUT
async function upsert(
	endpoint: string,
	data: Record<string, unknown>,
	filterField: string,
	filterValue: string,
) {
	let r = await strapiPost(endpoint, data);
	if (!r.ok && r.status === 400) {
		const errMsg = (r.data as any)?.error?.message || "";
		// If invalid key - strip unknown fields and retry
		const invalidKeyMatch = errMsg.match(/Invalid key (\w+)/);
		if (invalidKeyMatch) {
			const badKey = invalidKeyMatch[1];
			const cleaned = { ...data };
			delete cleaned[badKey];
			console.log(`[v0] Stripping invalid key "${badKey}" and retrying...`);
			r = await strapiPost(endpoint, cleaned);
		}
		// If still failing (duplicate or other), try update
		if (!r.ok) {
			const existing = await strapiGet(
				`${endpoint}?filters[${filterField}][$eq]=${encodeURIComponent(filterValue)}`,
			);
			const docId = existing?.data?.[0]?.documentId;
			if (docId) {
				r = await strapiPut(`${endpoint}/${docId}`, data);
				// If update also fails with invalid key, strip and retry
				if (!r.ok && r.status === 400) {
					const errMsg2 = (r.data as any)?.error?.message || "";
					const match2 = errMsg2.match(/Invalid key (\w+)/);
					if (match2) {
						const cleaned = { ...data };
						delete cleaned[match2[1]];
						r = await strapiPut(`${endpoint}/${docId}`, cleaned);
					}
				}
			}
		}
	}
	return r;
}

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const step = searchParams.get("step") || "1";
	const results: Record<string, unknown> = { step, strapiUrl: STRAPI_URL };

	try {
		console.log("[v0] Populate step:", step, "to:", STRAPI_URL);

		if (step === "1") {
			// Categories
			const categories = [
				{ title: "Премиум", slug: "premium", order: 1, active: true },
				{ title: "Делюкс", slug: "deluxe", order: 2, active: true },
				{ title: "Стандарт", slug: "standard", order: 3, active: true },
			];
			results.categories = [];
			for (const cat of categories) {
				const r = await upsert("/categories", cat, "slug", cat.slug);
				(results.categories as any[]).push({ title: cat.title, ...r });
			}
		}

		if (step === "2") {
			// Apartments (with components)
			const azureAmenities = [
				{ title: "Кондиционер", description: "Индивидуальный климат-контроль", included: true },
				{ title: "Wi-Fi", description: "Высокоскоростной интернет", included: true },
				{ title: "Smart TV", description: "Телевизор с подпиской", included: true },
				{ title: "Голосовой помощник Алиса", description: "", included: true },
				{ title: "Кухня", description: "Полностью оборудованная", included: true },
				{ title: "Холодильник", description: "", included: true },
				{ title: "Стиральная машина", description: "", included: true },
				{ title: "Посудомоечная машина", description: "", included: true },
				{ title: "Кофемашина", description: "", included: true },
				{ title: "Фен", description: "", included: true },
				{ title: "Выпрямитель для волос", description: "", included: true },
				{ title: "Халаты", description: "Взрослые и детские", included: true },
				{ title: "Тапочки", description: "", included: true },
				{ title: "Премиум косметика", description: "", included: true },
				{ title: "Полотенца", description: "Для апартаментов и пляжа", included: true },
				{ title: "Утюг", description: "", included: true },
				{ title: "Настольные игры", description: "", included: true },
				{ title: "Детская кроватка", description: "По запросу", included: false },
			];
			const seaDeluxeAmenities = [
				{ title: "Кондиционер", description: "", included: true },
				{ title: "Wi-Fi", description: "", included: true },
				{ title: "Балкон", description: "С видом на море", included: true },
				{ title: "Кухня", description: "", included: true },
				{ title: "Микроволновая печь", description: "", included: true },
				{ title: "Телевизор", description: "", included: true },
				{ title: "Кофемашина", description: "", included: true },
				{ title: "Индукционная плита", description: "", included: true },
				{ title: "Стиральная машина", description: "", included: true },
				{ title: "Фен", description: "", included: true },
				{ title: "Холодильник", description: "", included: true },
				{ title: "Халаты", description: "Взрослые и детские", included: true },
				{ title: "Тапочки", description: "", included: true },
				{ title: "Премиум косметика", description: "", included: true },
				{ title: "Полотенца", description: "Для апартаментов и пляжа", included: true },
				{ title: "Утюг", description: "", included: true },
				{ title: "Настольные игры", description: "", included: true },
				{ title: "Детская кроватка", description: "По запросу", included: false },
			];
			const whiteVelvetAmenities = [
				{ title: "Кондиционер", description: "", included: true },
				{ title: "Wi-Fi", description: "", included: true },
				{ title: "Smart TV", description: "", included: true },
				{ title: "Голосовой помощник Алиса", description: "", included: true },
				{ title: "Кухня", description: "Полностью оборудованная", included: true },
				{ title: "Холодильник", description: "", included: true },
				{ title: "Стиральная машина", description: "", included: true },
				{ title: "Посудомоечная машина", description: "", included: true },
				{ title: "Кофемашина", description: "", included: true },
				{ title: "Фен", description: "", included: true },
				{ title: "Фен-выпрямитель для волос", description: "", included: true },
				{ title: "Сейф", description: "", included: true },
				{ title: "Халаты", description: "Взрослые и детские", included: true },
				{ title: "Тапочки", description: "", included: true },
				{ title: "Премиум косметика", description: "", included: true },
				{ title: "Полотенца", description: "С регулярной заменой", included: true },
				{ title: "Пляжные полотенца", description: "С регулярной заменой", included: true },
				{ title: "Утюг", description: "", included: true },
				{ title: "Настольные игры", description: "", included: true },
				{ title: "Детская кроватка", description: "По запросу", included: false },
			];

			const defaultRules = {
				checkIn: "14:00",
				checkOut: "12:00",
				smoking: false,
				pets: false,
				description: "Тихий час с 23:00 до 8:00",
			};

			const apartments = [
				{
					title: "Azure",
					slug: "azure",
					description: "Стильные апартаменты в современном дизайне с тёплой, уютной атмосферой. Большая двуспальная кровать с мягким матрасом, сатиновым бельём, тремя подушками разной плотности и двумя большими одеялами. Спальня изолирована и закрывается дверями, в гостиной — просторный двуспальный диван.\n\nТёплый пол по всей зоне, эффектная лазурная ванная с полотенцесушителем. Кухня оснащена всем необходимым. Уютный балкон с комфортными стульями идеально подходит для утреннего кофе.\n\nДля гостей — взрослые и детские халаты, мягкие тапочки, профессиональная косметика и все необходимые косметические принадлежности.\n\nГости часто говорят, что здесь они чувствуют себя как в сказке.",
					shortDescription: "Стильные апартаменты с лазурной ванной и уютным балконом",
					maxguests: 4,
					price: 12000,
					active: true,
					sortOrder: 1,
					size: 45,
					bedroom: 1,
					bathroom: 1,
					rooms: 2,
					amenity: azureAmenities,
					rules: defaultRules,
					bonus: [
						{ Title: "Подогреваемый бассейн", description: "Посещение подогреваемого бассейна входит в стоимость проживания", included: true },
						{ Title: "Пляжные полотенца", description: "Комплект полотенец для пляжа", included: true },
					],
				},
				{
					title: "Морской Делюкс",
					slug: "sea-deluxe",
					description: "Шикарные апартаменты в спокойном современном стиле с мягкой светло-серой и пастельной палитрой, идеально подходящей для размеренного и комфортного отдыха. Интерьер создаёт ощущение тишины, уюта и лёгкости — здесь легко расслабиться и переключиться от повседневной суеты.\n\nВ апартаментах предусмотрены 2 уютные спальни и просторная гостиная с большим раскладывающимся диваном, удобным как для отдыха, так и для сна. Пространство продумано так, чтобы каждому гостю было комфортно и свободно.\n\nОсобое удовольствие — просторный балкон с невероятным видом на море, где приятно встречать рассветы, проводить тёплые вечера и просто наслаждаться моментом.\n\nВ апартаментах есть всё для по-настоящему приятного отдыха: комфорт, эстетика, продуманные детали и ощущение заботы.",
					shortDescription: "Апартаменты с видом на море и просторным балконом",
					maxguests: 4,
					price: 12500,
					active: true,
					sortOrder: 2,
					size: 55,
					bedroom: 2,
					bathroom: 1,
					rooms: 3,
					amenity: seaDeluxeAmenities,
					rules: defaultRules,
					bonus: [
						{ Title: "Вид на море", description: "Панорамный вид с балкона", included: true },
						{ Title: "Подогреваемый бассейн", description: "Посещение подогреваемого бассейна входит в стоимость проживания", included: true },
					],
				},
				{
					title: "Белый Бархат",
					slug: "sunrise-terrace",
					description: "Роскошные апартаменты, идеально подходящие для большой семьи или компании друзей. Просторное пространство включает две отдельные спальни, большую гостиную с кухней и огромный раскладной диван, создавая комфорт для совместного отдыха и личного уединения.\n\nВ апартаментах две полноценные ванные комнаты, одна из которых особенно впечатляет — с эстетичной отдельно стоящей ванной, превращающей ежедневные ритуалы в настоящее удовольствие.\n\nОсобая гордость апартаментов — большая приватная терраса с выходом на улицу и прямым расположением на берегу моря. Здесь море становится частью вашего отдыха: шаг — и вы уже у воды.\n\nЭти апартаменты созданы для того, чтобы провести время вместе красиво, спокойно и с ощущением настоящего люкса и роскоши.",
					shortDescription: "Роскошные апартаменты с приватной террасой у моря",
					maxguests: 3,
					price: 25000,
					active: true,
					sortOrder: 3,
					size: 85,
					bedroom: 2,
					bathroom: 2,
					rooms: 4,
					amenity: whiteVelvetAmenities,
					rules: defaultRules,
					bonus: [
						{ Title: "Терраса", description: "Приватная терраса с видом на море", included: true },
						{ Title: "Подогреваемый бассейн", description: "Посещение подогреваемого бассейна входит в стоимость проживания", included: true },
					],
				},
			];

			results.apartments = [];
			for (const apt of apartments) {
				const r = await upsert("/apartments", apt as any, "slug", apt.slug);
				(results.apartments as any[]).push({ title: apt.title, status: r.status, ok: r.ok, error: (r.data as any)?.error?.message });
			}
		}

		if (step === "3") {
			// Settings + Global + Home (single types)
			const settingsData = {
				adress: "г. Судак, ул. Набережная, 73",
				phone: "+7 (978) 020-71-71",
				email: "atlas.apart.hotel@gmail.com",
				checkInTime: "14:00",
				checkOutTime: "12:00",
				telegram: "@atlas_apart_hotel",
				max: "8",
			};
			results.settings = await strapiPut("/single-type", settingsData);

			const globalData = {
				siteName: "Atlas Apart Hotel & Spa",
				siteDescription: "Премиальный апарт-отель на берегу Чёрного моря в Судаке, Крым.",
			};
			results.global = await strapiPut("/global", globalData);

			const homeData = {
				heroTitle: "Atlas",
				heroSubtitle: "Apart Hotel & Spa",
				heroText: "Откройте для себя идеальное место для отдыха на берегу Чёрного моря. Панорамные виды, роскошные апартаменты и безупречный сервис в сердце солнечного Крыма.",
				aboutTitle: "Добро пожаловать в Atlas",
				aboutText: "Atlas Apart Hotel & Spa — это современный апарт-отель премиум-класса, расположенный на первой береговой линии в самом сердце Судака.\n\nМы предлагаем просторные апартаменты с дизайнерским интерьером, полностью оборудованной кухней и всеми удобствами для комфортного отдыха.",
			};
			results.home = await strapiPut("/home", homeData);
		}

		if (step === "4") {
			// Attractions
			const attractions = [
				{
					text: "Генуэзская крепость",
					slug: "genoese-fortress",
					type: "экскурсия",
					time: "1-2 часа",
					difficulty: "Легко",
					height: 157,
					order: 1,
					antive: true,
					description: "Средневековая крепость XIV века — главная достопримечательность Судака.",
				},
				{
					text: "Новый Свет",
					slug: "novy-svet",
					type: "город",
					time: "3-4 часа",
					difficulty: "Средне",
					height: 0,
					order: 2,
					antive: true,
					description: "Живописный посёлок с тропой Голицына, гротами и бухтами с кристально чистой водой.",
				},
				{
					text: "Горные тропы",
					slug: "mountain-trails",
					type: "пеший маршрут",
					time: "4-6 часов",
					difficulty: "Средне",
					height: 474,
					order: 3,
					antive: true,
					description: "Пешие маршруты по горам Судакского региона с видами на побережье.",
				},
				{
					text: "Пляжи Судака",
					slug: "beaches",
					type: "пляж",
					time: "Весь день",
					difficulty: "Легко",
					height: 0,
					order: 4,
					antive: true,
					description: "Лучшие пляжи Судака — от центрального городского до диких бухт.",
				},
			];
			results.attractions = [];
			for (const attr of attractions) {
				const r = await upsert("/attractions", attr, "slug", attr.slug);
				(results.attractions as any[]).push({ text: attr.text, status: r.status, ok: r.ok });
			}
		}

		if (step === "5") {
			// Promotions
			const promotions = [
				{
					title: "Раннее бронирование",
					badge: "ВЫГОДА",
					conditions: "При бронировании за 30+ дней до заезда",
					shortText: "Скидка 15% при раннем бронировании",
					description: "Забронируйте апартаменты заранее и получите скидку 15% на проживание.",
					validFrom: "2026-01-01",
					ValidTo: "2026-12-31",
					active: true,
					order: 1,
					showInBooking: true,
				},
				{
					title: "3-я ночь в подарок",
					badge: "ПОДАРОК",
					conditions: "При проживании от 3 ночей",
					shortText: "Каждая 3-я ночь бесплатно",
					description: "При бронировании от 3 ночей каждая третья ночь проживания предоставляется бесплатно.",
					validFrom: "2026-01-01",
					ValidTo: "2026-12-31",
					active: true,
					order: 2,
					showInBooking: true,
				},
			];
			results.promotions = [];
			for (const promo of promotions) {
				const r = await upsert("/promotions", promo, "title", promo.title);
				(results.promotions as any[]).push({ title: promo.title, status: r.status, ok: r.ok });
			}
		}

		if (step === "6") {
			// Infrastructure items
			const infraItems = [
				{
					title: "Собственный пляж",
					subtitle: "Первая береговая линия",
					description: "Оборудованный пляж с шезлонгами и зонтами в нескольких шагах от отеля.",
					order: 1,
					active: true,
				},
				{
					title: "SPA-зона",
					subtitle: "Релакс и восстановление",
					description: "Хаммам, сауна и массажный кабинет для полного расслабления.",
					order: 2,
					active: true,
				},
				{
					title: "Ресторан",
					subtitle: "Авторская кухня",
					description: "Завтраки, обеды и ужины с видом на море. Блюда из местных продуктов.",
					order: 3,
					active: true,
				},
				{
					title: "Парковка",
					subtitle: "Охраняемая территория",
					description: "Бесплатная охраняемая парковка на территории отеля.",
					order: 4,
					active: true,
				},
			];
			results.infrastructure = [];
			for (const item of infraItems) {
				const r = await upsert("/infrastructure-items", item, "title", item.title);
				(results.infrastructure as any[]).push({ title: item.title, status: r.status, ok: r.ok });
			}
		}

		return NextResponse.json(results);
	} catch (e: any) {
		return NextResponse.json(
			{ error: e.message, stack: e.stack?.split("\n").slice(0, 5), results },
			{ status: 500 },
		);
	}
}
