import { Condition } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/slug";
import { prisma } from "../lib/prisma";

// Price delta applied on top of a model's base (smallest storage) price.
const STORAGE_PRICE_DELTA_CENTS: Record<number, number> = {
  128: 0,
  256: 150000,
  512: 400000,
  1024: 650000,
};

// Each condition tier is sold as its own SKU with its own price, stock and
// battery health -- this mirrors how graded-refurb resellers actually sell.
const CONDITION_TIERS: {
  condition: Condition;
  priceMultiplier: number;
  batteryHealthPct: number;
  stockQty: number;
}[] = [
  { condition: "EXCELLENT", priceMultiplier: 1, batteryHealthPct: 95, stockQty: 6 },
  { condition: "VERY_GOOD", priceMultiplier: 0.9, batteryHealthPct: 87, stockQty: 10 },
  { condition: "GOOD", priceMultiplier: 0.8, batteryHealthPct: 82, stockQty: 5 },
];

type ColourDef = { name: string; hex: string };

type ModelDef = {
  name: string;
  storages: number[];
  basePriceCents: number;
  screen: string;
  chip: string;
  camera: string;
  battery: string;
  colours?: ColourDef[]; // overrides the series default palette
};

type SeriesDef = {
  series: string;
  colours: ColourDef[];
  models: ModelDef[];
};

const SERIES: SeriesDef[] = [
  {
    series: "iPhone 13 Series",
    colours: [
      { name: "Midnight", hex: "1e1e22" },
      { name: "Starlight", hex: "f5f0e6" },
      { name: "Blue", hex: "9bb5ce" },
      { name: "Pink", hex: "f6d7d3" },
      { name: "(PRODUCT)RED", hex: "b1242a" },
    ],
    models: [
      {
        name: "iPhone 13 mini",
        storages: [128, 256],
        basePriceCents: 749900,
        screen: "5.4-inch Super Retina XDR",
        chip: "A15 Bionic",
        camera: "Dual 12MP wide + ultra-wide",
        battery: "Up to 17 hours video playback",
      },
      {
        name: "iPhone 13",
        storages: [128, 256, 512],
        basePriceCents: 849900,
        screen: "6.1-inch Super Retina XDR",
        chip: "A15 Bionic",
        camera: "Dual 12MP wide + ultra-wide",
        battery: "Up to 19 hours video playback",
      },
      {
        name: "iPhone 13 Pro",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1299900,
        screen: "6.1-inch Super Retina XDR ProMotion",
        chip: "A15 Bionic",
        camera: "Triple 12MP wide + ultra-wide + telephoto",
        battery: "Up to 22 hours video playback",
        colours: [
          { name: "Graphite", hex: "4a4a4d" },
          { name: "Gold", hex: "e9ddc8" },
          { name: "Silver", hex: "f2f2f2" },
          { name: "Sierra Blue", hex: "a9c4d6" },
        ],
      },
      {
        name: "iPhone 13 Pro Max",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1499900,
        screen: "6.7-inch Super Retina XDR ProMotion",
        chip: "A15 Bionic",
        camera: "Triple 12MP wide + ultra-wide + telephoto",
        battery: "Up to 28 hours video playback",
        colours: [
          { name: "Graphite", hex: "4a4a4d" },
          { name: "Gold", hex: "e9ddc8" },
          { name: "Silver", hex: "f2f2f2" },
          { name: "Sierra Blue", hex: "a9c4d6" },
        ],
      },
    ],
  },
  {
    series: "iPhone 14 Series",
    colours: [
      { name: "Midnight", hex: "1e1e22" },
      { name: "Starlight", hex: "f5f0e6" },
      { name: "Blue", hex: "b6c9dc" },
      { name: "Purple", hex: "cfc4dd" },
      { name: "(PRODUCT)RED", hex: "b1242a" },
    ],
    models: [
      {
        name: "iPhone 14",
        storages: [128, 256, 512],
        basePriceCents: 949900,
        screen: "6.1-inch Super Retina XDR",
        chip: "A15 Bionic (5-core GPU)",
        camera: "Dual 12MP wide + ultra-wide",
        battery: "Up to 20 hours video playback",
      },
      {
        name: "iPhone 14 Plus",
        storages: [128, 256, 512],
        basePriceCents: 1049900,
        screen: "6.7-inch Super Retina XDR",
        chip: "A15 Bionic (5-core GPU)",
        camera: "Dual 12MP wide + ultra-wide",
        battery: "Up to 26 hours video playback",
      },
      {
        name: "iPhone 14 Pro",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1499900,
        screen: "6.1-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A16 Bionic",
        camera: "Triple 48MP wide + ultra-wide + telephoto",
        battery: "Up to 23 hours video playback",
        colours: [
          { name: "Space Black", hex: "2b2a28" },
          { name: "Silver", hex: "f2f2f2" },
          { name: "Gold", hex: "e9ddc8" },
          { name: "Deep Purple", hex: "5c5866" },
        ],
      },
      {
        name: "iPhone 14 Pro Max",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1699900,
        screen: "6.7-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A16 Bionic",
        camera: "Triple 48MP wide + ultra-wide + telephoto",
        battery: "Up to 29 hours video playback",
        colours: [
          { name: "Space Black", hex: "2b2a28" },
          { name: "Silver", hex: "f2f2f2" },
          { name: "Gold", hex: "e9ddc8" },
          { name: "Deep Purple", hex: "5c5866" },
        ],
      },
    ],
  },
  {
    series: "iPhone 15 Series",
    colours: [
      { name: "Black", hex: "35383b" },
      { name: "Blue", hex: "b6c4d6" },
      { name: "Green", hex: "c4cfbd" },
      { name: "Yellow", hex: "eee3bb" },
      { name: "Pink", hex: "f0d8dd" },
    ],
    models: [
      {
        name: "iPhone 15",
        storages: [128, 256, 512],
        basePriceCents: 1099900,
        screen: "6.1-inch Super Retina XDR, Dynamic Island",
        chip: "A16 Bionic",
        camera: "Dual 48MP wide + ultra-wide",
        battery: "Up to 20 hours video playback",
      },
      {
        name: "iPhone 15 Plus",
        storages: [128, 256, 512],
        basePriceCents: 1199900,
        screen: "6.7-inch Super Retina XDR, Dynamic Island",
        chip: "A16 Bionic",
        camera: "Dual 48MP wide + ultra-wide",
        battery: "Up to 26 hours video playback",
      },
      {
        name: "iPhone 15 Pro",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1699900,
        screen: "6.1-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A17 Pro",
        camera: "Triple 48MP wide + ultra-wide + telephoto",
        battery: "Up to 23 hours video playback",
        colours: [
          { name: "Black Titanium", hex: "3b3b3c" },
          { name: "White Titanium", hex: "e9e6df" },
          { name: "Blue Titanium", hex: "4f5f6d" },
          { name: "Natural Titanium", hex: "8a8378" },
        ],
      },
      {
        name: "iPhone 15 Pro Max",
        storages: [256, 512, 1024],
        basePriceCents: 1999900,
        screen: "6.7-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A17 Pro",
        camera: "Triple 48MP wide + ultra-wide + 5x telephoto",
        battery: "Up to 29 hours video playback",
        colours: [
          { name: "Black Titanium", hex: "3b3b3c" },
          { name: "White Titanium", hex: "e9e6df" },
          { name: "Blue Titanium", hex: "4f5f6d" },
          { name: "Natural Titanium", hex: "8a8378" },
        ],
      },
    ],
  },
  {
    series: "iPhone 16 Series",
    colours: [
      { name: "Black", hex: "34353a" },
      { name: "White", hex: "f2f1ec" },
      { name: "Pink", hex: "f2d9d6" },
      { name: "Teal", hex: "aec2c2" },
      { name: "Ultramarine", hex: "9fb0d6" },
    ],
    models: [
      {
        name: "iPhone 16",
        storages: [128, 256, 512],
        basePriceCents: 1299900,
        screen: "6.1-inch Super Retina XDR, Dynamic Island",
        chip: "A18",
        camera: "Dual 48MP fusion + ultra-wide",
        battery: "Up to 22 hours video playback",
      },
      {
        name: "iPhone 16 Plus",
        storages: [128, 256, 512],
        basePriceCents: 1399900,
        screen: "6.7-inch Super Retina XDR, Dynamic Island",
        chip: "A18",
        camera: "Dual 48MP fusion + ultra-wide",
        battery: "Up to 27 hours video playback",
      },
      {
        name: "iPhone 16 Pro",
        storages: [128, 256, 512, 1024],
        basePriceCents: 1899900,
        screen: "6.3-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A18 Pro",
        camera: "Triple 48MP fusion + ultra-wide + 5x telephoto",
        battery: "Up to 27 hours video playback",
        colours: [
          { name: "Black Titanium", hex: "3b3b3c" },
          { name: "White Titanium", hex: "e9e6df" },
          { name: "Natural Titanium", hex: "8a8378" },
          { name: "Desert Titanium", hex: "b8a488" },
        ],
      },
      {
        name: "iPhone 16 Pro Max",
        storages: [256, 512, 1024],
        basePriceCents: 2199900,
        screen: "6.9-inch Super Retina XDR ProMotion, Dynamic Island",
        chip: "A18 Pro",
        camera: "Triple 48MP fusion + ultra-wide + 5x telephoto",
        battery: "Up to 33 hours video playback",
        colours: [
          { name: "Black Titanium", hex: "3b3b3c" },
          { name: "White Titanium", hex: "e9e6df" },
          { name: "Natural Titanium", hex: "8a8378" },
          { name: "Desert Titanium", hex: "b8a488" },
        ],
      },
    ],
  },
];

// Official Apple Store finish-picker photography, one composite shot per
// model x colour showing the back with the front peeking out. Assets are
// served from Apple's Scene7 CDN and verified live for every colourway below.
// 13-era files are portrait "<model>-<colour>-select[-2021]"; 14-era onwards
// are wide-canvas "<model>-finish-select-<yyyymm>-<size>-<colour>" files that
// need a crop (cropN) to read as a portrait catalog shot.
const APPLE_IMG_BASE =
  "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is";

function appleColourSlug(name: string): string {
  if (name === "(PRODUCT)RED") return "product-red";
  if (name === "Sierra Blue") return "blue"; // Apple's own slug for the 13 Pro finish
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

function appleImageUrl(modelName: string, colourName: string): string {
  const colour = appleColourSlug(colourName);
  const select = (model: string, year = "") =>
    `${APPLE_IMG_BASE}/${model}-${colour}-select${year}?wid=940&hei=1112&fmt=png-alpha`;
  const finishSelect = (model: string, yyyymm: string, size: string) =>
    `${APPLE_IMG_BASE}/${model}-finish-select-${yyyymm}-${size}-${colour}?wid=940&hei=1112&fmt=png-alpha&cropN=0.34,0.16,0.32,0.68`;

  switch (modelName) {
    case "iPhone 13 mini":
      return select("iphone-13-mini", "-2021");
    case "iPhone 13":
      return select("iphone-13", "-2021");
    case "iPhone 13 Pro":
      return select("iphone-13-pro");
    case "iPhone 13 Pro Max":
      return select("iphone-13-pro-max");
    case "iPhone 14":
      return finishSelect("iphone-14", "202209", "6-1inch");
    case "iPhone 14 Plus":
      return finishSelect("iphone-14", "202209", "6-7inch");
    case "iPhone 14 Pro":
      return finishSelect("iphone-14-pro", "202209", "6-1inch");
    case "iPhone 14 Pro Max":
      return finishSelect("iphone-14-pro", "202209", "6-7inch");
    case "iPhone 15":
      return finishSelect("iphone-15", "202309", "6-1inch");
    case "iPhone 15 Plus":
      return finishSelect("iphone-15", "202309", "6-7inch");
    case "iPhone 15 Pro":
      return finishSelect("iphone-15-pro", "202309", "6-1inch");
    case "iPhone 15 Pro Max":
      return finishSelect("iphone-15-pro", "202309", "6-7inch");
    case "iPhone 16":
      return finishSelect("iphone-16", "202409", "6-1inch");
    case "iPhone 16 Plus":
      return finishSelect("iphone-16", "202409", "6-7inch");
    case "iPhone 16 Pro":
      return finishSelect("iphone-16-pro", "202409", "6-3inch");
    case "iPhone 16 Pro Max":
      return finishSelect("iphone-16-pro", "202409", "6-9inch");
    default:
      throw new Error(`No Apple image mapping for model "${modelName}"`);
  }
}

function roundToNearestRand(cents: number): number {
  return Math.round(cents / 100) * 100;
}

async function main() {
  console.log("Seeding White Box database...");

  const brand = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: { name: "Apple", slug: "apple" },
  });

  const category = await prisma.category.upsert({
    where: { slug: "phones" },
    update: {},
    create: { name: "Phones", slug: "phones" },
  });

  await prisma.storeSetting.upsert({
    where: { id: "1" },
    update: {},
    create: { id: "1", flatShippingFeeCents: 15000, minDeliveryDays: 2, maxDeliveryDays: 5 },
  });

  let productCount = 0;
  let variantCount = 0;

  for (const series of SERIES) {
    for (const model of series.models) {
      const slug = slugify(model.name);
      const colours = model.colours ?? series.colours;

      const specifications = JSON.stringify({
        screen: model.screen,
        chip: model.chip,
        camera: model.camera,
        battery: model.battery,
        connector: "Lightning",
        simOptions: "Nano-SIM and eSIM",
      });

      const product = await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: model.name,
          series: series.series,
          brandId: brand.id,
          categoryId: category.id,
          description: `Certified white-box ${model.name}, fully tested across 60+ checkpoints and backed by a 12-month warranty. Same performance as retail, without the retail box or markup.`,
          specifications,
        },
      });
      productCount++;

      for (const colour of colours) {
        const colourway = await prisma.colourway.upsert({
          where: { productId_name: { productId: product.id, name: colour.name } },
          update: {},
          create: {
            productId: product.id,
            name: colour.name,
            hexCode: `#${colour.hex}`,
          },
        });

        // Drop old generated placeholders so re-seeding upgrades them to the
        // real photo, but leave any admin-uploaded images untouched.
        await prisma.productImage.deleteMany({
          where: { colourwayId: colourway.id, url: { startsWith: "/api/placeholder/" } },
        });

        const existingImages = await prisma.productImage.findMany({
          where: { colourwayId: colourway.id },
        });
        if (existingImages.length === 0) {
          await prisma.productImage.create({
            data: {
              colourwayId: colourway.id,
              url: appleImageUrl(model.name, colour.name),
              altText: `${model.name} in ${colour.name}, front and back view`,
              position: 0,
            },
          });
        }

        for (const storageGb of model.storages) {
          const storageDelta = STORAGE_PRICE_DELTA_CENTS[storageGb] ?? 0;
          for (const tier of CONDITION_TIERS) {
            const priceCents = roundToNearestRand(
              (model.basePriceCents + storageDelta) * tier.priceMultiplier
            );
            const sku = `${slug}-${storageGb}-${slugify(colour.name)}-${tier.condition}`.toUpperCase();

            await prisma.productVariant.upsert({
              where: {
                productId_colourwayId_storageGb_condition: {
                  productId: product.id,
                  colourwayId: colourway.id,
                  storageGb,
                  condition: tier.condition,
                },
              },
              update: {
                priceCents,
                stockQty: tier.stockQty,
                batteryHealthPct: tier.batteryHealthPct,
              },
              create: {
                productId: product.id,
                colourwayId: colourway.id,
                storageGb,
                batteryHealthPct: tier.batteryHealthPct,
                condition: tier.condition,
                priceCents,
                stockQty: tier.stockQty,
                sku,
              },
            });
            variantCount++;
          }
        }
      }
    }
  }

  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@whitebox.co.za" },
    update: {},
    create: {
      email: "admin@whitebox.co.za",
      passwordHash: adminPasswordHash,
      name: "White Box Admin",
      role: "ADMIN",
    },
  });

  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPasswordHash,
      name: "Thandiwe Nkosi",
      role: "CUSTOMER",
      phone: "+27 82 555 0134",
      addresses: {
        create: {
          label: "Home",
          line1: "12 Florida Road",
          city: "Durban",
          province: "KwaZulu-Natal",
          postalCode: "4001",
          country: "South Africa",
          isDefault: true,
        },
      },
    },
  });

  const sampleProduct = await prisma.product.findUnique({ where: { slug: "iphone-15" } });
  if (sampleProduct) {
    await prisma.review.upsert({
      where: { id: "seed-review-1" },
      update: {},
      create: {
        id: "seed-review-1",
        productId: sampleProduct.id,
        userId: customer.id,
        rating: 5,
        title: "Looks brand new",
        body: "Battery health was exactly as described and it arrived within 3 days. Would buy from White Box again.",
        verifiedPurchase: true,
        status: "APPROVED",
      },
    });
  }

  console.log(`Seed complete: ${productCount} products, ${variantCount} variants.`);
  console.log(`Admin login: admin@whitebox.co.za / Admin123!`);
  console.log(`Customer login: customer@example.com / Customer123!`);
  void admin;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
