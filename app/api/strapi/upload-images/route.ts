import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join, basename } from "path";

const STRAPI_URL = "https://whimsical-laughter-bb3c04df0e.strapiapp.com";
const STRAPI_TOKEN = "f10c68d75349960ef64637fadf78996bf5388110dccd846dfa76dfbc1b88ba65bd3ea697d4c2d77ddbf76117316135731a1871966a7431acc724f284f04df25d3facf89bc52f066b5887c83076709ebdf0826609628d5a88042e5e6ebfb1300513558fe14665e515aafbde13cda59e6598168ee94d0cba72c2c04d047c97fe58";

// Upload a single file to Strapi Media Library
async function uploadToStrapi(
	filePath: string,
	fileName: string,
): Promise<{ id: number; url: string } | null> {
	try {
		const fullPath = join(process.cwd(), "public", filePath);
		if (!existsSync(fullPath)) {
			console.log(`[v0] File not found: ${fullPath}`);
			return null;
		}

		const fileBuffer = readFileSync(fullPath);
		const blob = new Blob([fileBuffer]);

		const formData = new FormData();
		formData.append("files", blob, fileName);

		const res = await fetch(`${STRAPI_URL}/api/upload`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${STRAPI_TOKEN}`,
			},
			body: formData,
		});

		if (!res.ok) {
			const errText = await res.text();
			console.log(`[v0] Upload failed for ${fileName}:`, errText);
			return null;
		}

		const data = await res.json();
		if (Array.isArray(data) && data.length > 0) {
			return { id: data[0].id, url: data[0].url };
		}
		return null;
	} catch (err) {
		console.log(`[v0] Upload error for ${fileName}:`, err);
		return null;
	}
}

// Link uploaded media to a Strapi entry
async function linkMediaToEntry(
	contentType: string,
	documentId: string,
	field: string,
	mediaIds: number[],
) {
	// For linking media, we need to use the REST API with relation format
	const body =
		mediaIds.length === 1
			? { data: { [field]: mediaIds[0] } }
			: { data: { [field]: mediaIds } };

	const res = await fetch(
		`${STRAPI_URL}/api/${contentType}/${documentId}`,
		{
			method: "PUT",
			headers: {
				Authorization: `Bearer ${STRAPI_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}
	return { ok: res.ok, status: res.status, data: json };
}

async function strapiGet(endpoint: string) {
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
}

// Image mapping: which images go to which apartments/attractions
const imageMap = {
	apartments: {
		azure: [
			"apartments/azure-main.jpg",
			"apartments/azure-bedroom-featured.jpg",
			"apartments/azure-bedroom1.jpg",
			"apartments/azure-living-area.jpg",
			"apartments/azure-bathroom.jpg",
			"apartments/azure-bathroom2.jpg",
			"apartments/azure-interior.jpg",
			"apartments/azure-bed-detail.jpg",
			"apartments/azure.jpg",
		],
		"sea-deluxe": [
			"apartments/sea-deluxe/main.jpg",
			"apartments/sea-deluxe/1.jpg",
			"apartments/sea-deluxe/2.jpg",
			"apartments/sea-deluxe/3.jpg",
			"apartments/sea-deluxe/4.jpg",
			"apartments/sea-deluxe/7.jpg",
			"apartments/sea-deluxe/9.jpg",
			"apartments/sea-deluxe/10.jpg",
			"apartments/sea-deluxe/11.jpg",
			"apartments/sea-deluxe/12.jpg",
		],
		"sunrise-terrace": [
			"apartments/white-velvet/11.jpg",
			"apartments/white-velvet/12.jpg",
			"apartments/white-velvet/13.jpg",
			"apartments/white-velvet/14.jpg",
			"apartments/white-velvet/15.jpg",
			"apartments/white-velvet/16.jpg",
			"apartments/white-velvet/17.jpg",
		],
	},
	attractions: {
		"genoese-fortress": "attractions/genoese-fortress.jpg",
		"novy-svet": "attractions/novy-svet.jpg",
		"mountain-trails": "attractions/mountain-trails.jpg",
		beaches: "attractions/beaches.jpg",
	},
	infrastructure: {
		"Собственный пляж": "features/beach.jpg",
		"SPA-зона": "features/spa.jpg",
		Ресторан: "features/restaurant.jpg",
		Парковка: "features/resort-view.jpg",
	},
	hero: [
		"hero-slides/slide1.jpg",
		"hero-slides/slide2.jpg",
		"hero-slides/slide3.jpg",
		"hero-slides/slide4.jpg",
	],
};

export async function POST(request: NextRequest) {
	const results: Record<string, unknown> = {};

	try {
		// 1. Upload apartment images
		results.apartments = {};
		for (const [slug, images] of Object.entries(imageMap.apartments)) {
			const existing = await strapiGet(
				`/apartments?filters[slug][$eq]=${slug}`,
			);
			const docId = existing?.data?.[0]?.documentId;
			if (!docId) {
				(results.apartments as Record<string, unknown>)[slug] =
					"Not found in Strapi";
				continue;
			}

			const uploadedIds: number[] = [];
			const uploadResults: unknown[] = [];
			for (const imgPath of images) {
				const fileName = `${slug}-${basename(imgPath)}`;
				const uploaded = await uploadToStrapi(imgPath, fileName);
				if (uploaded) {
					uploadedIds.push(uploaded.id);
					uploadResults.push({
						file: imgPath,
						id: uploaded.id,
						url: uploaded.url,
					});
				} else {
					uploadResults.push({ file: imgPath, error: "Upload failed" });
				}
			}

			// Link to apartment
			if (uploadedIds.length > 0) {
				const linkResult = await linkMediaToEntry(
					"apartments",
					docId,
					"images",
					uploadedIds,
				);
				(results.apartments as Record<string, unknown>)[slug] = {
					uploads: uploadResults,
					linked: linkResult,
				};
			}
		}

		// 2. Upload attraction images
		results.attractions = {};
		for (const [slug, imgPath] of Object.entries(imageMap.attractions)) {
			const existing = await strapiGet(
				`/attractions?filters[slug][$eq]=${slug}`,
			);
			const docId = existing?.data?.[0]?.documentId;
			if (!docId) {
				(results.attractions as Record<string, unknown>)[slug] =
					"Not found in Strapi";
				continue;
			}

			const fileName = `attraction-${basename(imgPath)}`;
			const uploaded = await uploadToStrapi(imgPath, fileName);
			if (uploaded) {
				const linkResult = await linkMediaToEntry(
					"attractions",
					docId,
					"image",
					[uploaded.id],
				);
				(results.attractions as Record<string, unknown>)[slug] = {
					uploaded,
					linked: linkResult,
				};
			}
		}

		// 3. Upload infrastructure images
		results.infrastructure = {};
		for (const [title, imgPath] of Object.entries(
			imageMap.infrastructure,
		)) {
			const existing = await strapiGet(
				`/infrastructure-items?filters[title][$eq]=${encodeURIComponent(title)}`,
			);
			const docId = existing?.data?.[0]?.documentId;
			if (!docId) {
				(results.infrastructure as Record<string, unknown>)[title] =
					"Not found in Strapi";
				continue;
			}

			const fileName = `infra-${basename(imgPath)}`;
			const uploaded = await uploadToStrapi(imgPath, fileName);
			if (uploaded) {
				const linkResult = await linkMediaToEntry(
					"infrastructure-items",
					docId,
					"image",
					[uploaded.id],
				);
				(results.infrastructure as Record<string, unknown>)[title] = {
					uploaded,
					linked: linkResult,
				};
			}
		}

		// 4. Upload hero images to Home
		const existingHome = await strapiGet("/homes");
		const homeDocId = existingHome?.data?.[0]?.documentId;
		if (homeDocId) {
			const heroIds: number[] = [];
			const heroResults: unknown[] = [];
			for (const imgPath of imageMap.hero) {
				const fileName = `hero-${basename(imgPath)}`;
				const uploaded = await uploadToStrapi(imgPath, fileName);
				if (uploaded) {
					heroIds.push(uploaded.id);
					heroResults.push(uploaded);
				}
			}
			if (heroIds.length > 0) {
				const linkResult = await linkMediaToEntry(
					"homes",
					homeDocId,
					"heroImage",
					heroIds,
				);
				results.home = { heroUploads: heroResults, linked: linkResult };
			}
		} else {
			results.home = "Home not found - run Populate first";
		}

		return NextResponse.json({
			success: true,
			message: "Images uploaded and linked to Strapi entries",
			results,
		});
	} catch (error) {
		console.error("[v0] Image upload error:", error);
		return NextResponse.json(
			{ error: String(error), results },
			{ status: 500 },
		);
	}
}
