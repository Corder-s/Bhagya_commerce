import type {
  FilterState,
  ProductBucket,
  ProductDetail,
  ProductSummary,
  SortOption,
} from "@/types/catalogue";

/**
 * Bhagya Commerce catalogue dataset.
 *
 * Each product record implements `ProductDetail` which extends `ProductSummary`.
 * Spans all 8 official taxonomy categories, diverse price tiers, and verified crafts.
 */
export const products: readonly ProductDetail[] = [
  {
    id: "prd_1001",
    slug: "handloom-cotton-throw-indigo",
    name: "Handloom cotton throw, indigo",
    blurb: "Woven on pit looms, dyed in small indigo vats.",
    brand: { slug: "loom-and-land", name: "Loom & Land" },
    categorySlug: "home-living",
    priceInr: 2450,
    mrpInr: 3200,
    rating: { value: 4.6, count: 128 },
    badge: "Handloom",
    availability: "in-stock",
    buckets: ["for-you", "best-sellers", "conscious-picks"],
    tags: ["cotton", "indigo", "handloom", "living room", "natural dyes", "throw"],
    image: {
      src: "/images/products/handloom-cotton-throw.jpg",
      alt: "Indigo and undyed handloom cotton throw folded over a stoneware vase",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/handloom-cotton-throw.jpg",
        alt: "Indigo and undyed handloom cotton throw folded over a stoneware vase",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/home-living.jpg",
        alt: "Handwoven cotton throw styled in living room",
        width: 880,
        height: 660,
      },
      {
        src: "/images/hero/hero-still-life.jpg",
        alt: "Artisanal textile and ceramic still life detail",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Spun from rainwater-fed desi cotton and woven on traditional wooden pit looms by master artisans in Bhagalpur. Dyed using fermented natural indigo leaf paste with no synthetic fixatives or harsh chemicals.",
    specifications: [
      { label: "Material", value: "100% Desi Organic Cotton" },
      { label: "Dimensions", value: "130 cm × 180 cm (51\" × 71\")" },
      { label: "Dye Process", value: "Fermented natural indigo vat dye" },
      { label: "Origin", value: "Bhagalpur, Bihar" },
    ],
    shippingInfo:
      "Ships within 48 hours. Delivered in 3–5 business days in plastic-free recycled paper packaging.",
    careInstructions:
      "Gentle cold hand wash or machine wash on delicate cycle with mild soap. Dry in shade.",
    reviewsList: [
      {
        id: "rev_1",
        author: "Meera K.",
        rating: 5,
        date: "14 Aug 2026",
        title: "Breathable and heirloom quality",
        comment:
          "The weight is just right for mild evenings. You can feel the distinct texture of handspun yarn. Beautiful indigo hue.",
        verified: true,
      },
      {
        id: "rev_2",
        author: "Arjun V.",
        rating: 4,
        date: "02 Jul 2026",
        title: "Authentic craft feel",
        comment:
          "Slight initial color bleed on first rinse which is typical for real indigo. Very pleased with the purchase.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1002",
    slug: "unpolished-millet-grain-blend",
    name: "Unpolished millet & grain blend, 500 g",
    blurb: "Five millets, stone-cleaned, nothing added.",
    brand: { slug: "sattva-farms", name: "Sattva Farms" },
    categorySlug: "organic-food",
    priceInr: 420,
    mrpInr: 520,
    rating: { value: 4.7, count: 212 },
    badge: "Organic",
    availability: "in-stock",
    buckets: ["for-you", "trending", "conscious-picks"],
    tags: ["millet", "grains", "gluten-free", "organic", "pantry", "unpolished"],
    image: {
      src: "/images/products/millet-grain-blend.jpg",
      alt: "Unpolished millet grains in a brass bowl beside a cotton pouch",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/millet-grain-blend.jpg",
        alt: "Unpolished millet grains in a brass bowl beside a cotton pouch",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/organic-food.jpg",
        alt: "Raw millet bowl with cotton pouch",
        width: 880,
        height: 660,
      },
    ],
    description:
      "A heritage blend of five ancient grains: Foxtail, Kodo, Little, Barnyard and Browntop millets. Sourced from dryland farmer cooperatives in Tiptur, de-husked slowly to retain the nutrient-dense bran layer.",
    specifications: [
      { label: "Ingredients", value: "Foxtail, Kodo, Little, Barnyard & Browntop Millets" },
      { label: "Net Weight", value: "500 g" },
      { label: "Farming", value: "Rain-fed organic, non-GMO" },
      { label: "Origin", value: "Tiptur, Karnataka" },
    ],
    shippingInfo:
      "Packed fresh weekly in unbleached zip-lock paper bags. Pan-India shipping in 2–4 days.",
    careInstructions: "Store in an airtight glass container in a cool, dry place.",
    reviewsList: [
      {
        id: "rev_3",
        author: "Pooja N.",
        rating: 5,
        date: "28 Jul 2026",
        title: "Nutty and wholesome",
        comment:
          "Replaced white rice for dinner with this blend. Cooks evenly and feels very light on digestion.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1003",
    slug: "ashwagandha-churna",
    name: "Ashwagandha churna, 200 g",
    blurb: "Root dried in shade, ground in small batches.",
    brand: { slug: "veda-root", name: "Veda Root" },
    categorySlug: "ayurveda",
    priceInr: 680,
    mrpInr: 850,
    rating: { value: 4.8, count: 341 },
    badge: "Small batch",
    availability: "low-stock",
    buckets: ["trending", "best-sellers"],
    tags: ["ayurveda", "ashwagandha", "churna", "herbal", "immunity", "adaptogen"],
    image: {
      src: "/images/products/ashwagandha-churna.jpg",
      alt: "Glass jar of ashwagandha churna with a brass mortar and dried root",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/ashwagandha-churna.jpg",
        alt: "Glass jar of ashwagandha churna with a brass mortar and dried root",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/ayurveda.jpg",
        alt: "Ayurvedic mortar and pestle preparation",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Single-origin Withania somnifera roots grown in central Indian black soil. Harvested at peak potency, shade-dried over 14 days, and stone-pulverized into fine churna to protect active withanolides.",
    specifications: [
      { label: "Key Ingredient", value: "100% Pure Ashwagandha Root (Withania Somnifera)" },
      { label: "Quantity", value: "200 g" },
      { label: "Processing", value: "Shade-dried, stone-milled" },
      { label: "Origin", value: "Nagpur, Maharashtra" },
    ],
    shippingInfo: "Sealed in UV-protective amber glass jar. Dispatched within 24 hours.",
    careInstructions:
      "Take 1/2 teaspoon daily with warm milk or water before sleep, or as advised by an Ayurvedic physician.",
    reviewsList: [
      {
        id: "rev_4",
        author: "Rohan S.",
        rating: 5,
        date: "19 Aug 2026",
        title: "Remarkable difference in sleep quality",
        comment:
          "The aroma is distinctly fresh and earthy compared to commercial brands. Very potent quality.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1004",
    slug: "rose-and-saffron-face-oil",
    name: "Rose & saffron face oil, 30 ml",
    blurb: "Cold-pressed base oils, steam-distilled rose.",
    brand: { slug: "neer-herbals", name: "Neer Herbals" },
    categorySlug: "personal-care",
    priceInr: 1150,
    mrpInr: 1450,
    rating: { value: 4.9, count: 96 },
    badge: "New",
    availability: "in-stock",
    buckets: ["new-arrivals", "best-sellers", "conscious-picks"],
    tags: ["face oil", "rose", "saffron", "skincare", "glow", "cold pressed"],
    image: {
      src: "/images/products/rose-saffron-face-oil.jpg",
      alt: "Amber glass bottle of rose and saffron face oil on warm ivory linen",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/rose-saffron-face-oil.jpg",
        alt: "Amber glass bottle of rose and saffron face oil on warm ivory linen",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/personal-care.jpg",
        alt: "Botanical face oil and rose petals",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Formulated with Kashmiri Mongra saffron threads infused for 28 lunar cycles into virgin cold-pressed sweet almond and jojoba oils, enriched with pure Kannauj damask rose essential oil.",
    specifications: [
      { label: "Volume", value: "30 ml" },
      { label: "Skin Type", value: "All skin types, particularly dry and sensitive" },
      { label: "Extraction", value: "Cold-pressed & lunar maceration" },
      { label: "Origin", value: "Puducherry" },
    ],
    shippingInfo: "Shipped in padded recycled cardboard casing with tamper-evident seal.",
    careInstructions:
      "Warm 3-4 drops between fingertips and press gently into clean, damp skin mornings and nights.",
    reviewsList: [
      {
        id: "rev_5",
        author: "Devika B.",
        rating: 5,
        date: "05 Sep 2026",
        title: "Non-greasy, natural glow",
        comment:
          "Absorbs immediately without any tacky residue. Smells like fresh dew on roses, not perfume.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1005",
    slug: "cork-and-cotton-yoga-mat",
    name: "Cork & cotton yoga mat",
    blurb: "Cork surface, cotton backing, no PVC.",
    brand: { slug: "nira", name: "Nira" },
    categorySlug: "wellness",
    priceInr: 2890,
    mrpInr: 3600,
    rating: { value: 4.5, count: 74 },
    badge: "Eco Pick",
    availability: "in-stock",
    buckets: ["new-arrivals", "for-you", "conscious-picks"],
    tags: ["yoga", "cork", "wellness", "fitness", "eco-friendly", "non-toxic"],
    image: {
      src: "/images/products/cork-cotton-yoga-mat.jpg",
      alt: "Rolled cork and cotton yoga mat beside a copper water bottle",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/cork-cotton-yoga-mat.jpg",
        alt: "Rolled cork and cotton yoga mat beside a copper water bottle",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/wellness.jpg",
        alt: "Rolled yoga mat with singing bowl",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Naturally antimicrobial harvested cork oak surface heat-bonded to high-density organic cotton backing. Grip improves as moisture increases during rigorous practice. Free from PVC, TPE, and plasticizers.",
    specifications: [
      { label: "Dimensions", value: "183 cm × 61 cm × 4.5 mm" },
      { label: "Weight", value: "2.1 kg" },
      { label: "Materials", value: "Natural harvested cork & woven cotton" },
      { label: "Origin", value: "Kochi, Kerala" },
    ],
    shippingInfo: "Includes organic cotton carry sling strap. Ships pan-India.",
    careInstructions:
      "Wipe clean with a damp cloth and mild organic soap water. Roll with cork side facing outward.",
    reviewsList: [
      {
        id: "rev_6",
        author: "Kavita M.",
        rating: 5,
        date: "12 Jul 2026",
        title: "Superior grip when sweating",
        comment:
          "Zero chemical odour out of the box. Doesn't bunch up like flimsy rubber mats.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1006",
    slug: "bamboo-brush-and-comb-set",
    name: "Bamboo brush & comb set",
    blurb: "The plastic you stop buying, three at a time.",
    brand: { slug: "nira", name: "Nira" },
    categorySlug: "eco-friendly",
    priceInr: 349,
    mrpInr: 499,
    rating: { value: 4.4, count: 188 },
    badge: "Best Value",
    availability: "in-stock",
    buckets: ["trending", "new-arrivals"],
    tags: ["bamboo", "comb", "brush", "zero waste", "hygiene", "eco swap"],
    image: {
      src: "/images/products/bamboo-brush-set.jpg",
      alt: "Bamboo toothbrush, wooden comb and jute pouch on ivory linen",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/bamboo-brush-set.jpg",
        alt: "Bamboo toothbrush, wooden comb and jute pouch on ivory linen",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/eco-friendly.jpg",
        alt: "Low-waste bathroom daily swaps",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Includes 2 compostable Moso bamboo toothbrushes with castor-oil-infused soft bristles and 1 wide-tooth Neem wood comb. 100% biodegradable and compostable at end of life.",
    specifications: [
      { label: "Contents", value: "2 Bamboo Toothbrushes + 1 Neem Comb + 1 Jute Pouch" },
      { label: "Bristles", value: "Plant-derived bio-nylon" },
      { label: "Finish", value: "Beeswax coated handle" },
      { label: "Origin", value: "Kochi, Kerala" },
    ],
    shippingInfo: "Plastic-free corrugated paper envelope.",
    careInstructions: "Allow toothbrushes to air dry upright between uses.",
    reviewsList: [
      {
        id: "rev_7",
        author: "Vikram T.",
        rating: 4,
        date: "22 Jun 2026",
        title: "Great everyday swap",
        comment: "Soft bristles that don't hurt gums. Comb is very smooth without rough edges.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1007",
    slug: "terracotta-planter-hand-thrown",
    name: "Terracotta planter, hand-thrown",
    blurb: "Breathable clay, unglazed, fired in a shared kiln.",
    brand: { slug: "mitti-studio", name: "Mitti Studio" },
    categorySlug: "home-living",
    priceInr: 790,
    mrpInr: 950,
    rating: { value: 4.7, count: 63 },
    badge: "Artisanal",
    availability: "made-to-order",
    buckets: ["new-arrivals", "best-sellers"],
    tags: ["terracotta", "planter", "pottery", "clay", "indoor garden", "handmade"],
    image: {
      src: "/images/products/terracotta-planter.jpg",
      alt: "Hand-thrown terracotta pot holding a leafy plant in a sunlit room",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/terracotta-planter.jpg",
        alt: "Hand-thrown terracotta pot holding a leafy plant in a sunlit room",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/home-living.jpg",
        alt: "Ceramic and artisanal tableware",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Hand-thrown on traditional kick wheels in Khurja using riverbed clay. Porous terracotta allows roots to breathe and regulates moisture naturally. Includes drainage hole and matching saucer.",
    specifications: [
      { label: "Diameter", value: "18 cm (7 inches)" },
      { label: "Height", value: "16 cm (6.5 inches)" },
      { label: "Material", value: "Khurja riverbed unglazed clay" },
      { label: "Origin", value: "Khurja, Uttar Pradesh" },
    ],
    shippingInfo: "Reinforced molded pulp cushioning guarantees safe transit.",
    careInstructions: "Wipe with water; natural mineral patina develops over time.",
    reviewsList: [
      {
        id: "rev_8",
        author: "Shreya G.",
        rating: 5,
        date: "09 Aug 2026",
        title: "Plants thrive in this",
        comment: "Excellent breathability. You can tell it's handmade by the subtle throwing rings.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1008",
    slug: "home-garden-starter-kit",
    name: "Home garden starter kit",
    blurb: "Herb and greens seeds with living-soil mix.",
    brand: { slug: "beej-and-mitti", name: "Beej & Mitti" },
    categorySlug: "eco-friendly",
    priceInr: 560,
    mrpInr: 699,
    rating: { value: 4.6, count: 41 },
    badge: "Starter Kit",
    availability: "in-stock",
    buckets: ["for-you", "trending", "conscious-picks"],
    tags: ["seeds", "gardening", "herbs", "balcony", "living soil", "green home"],
    image: {
      src: "/images/products/home-garden-seed-kit.jpg",
      alt: "Hands holding dark soil with a young green seedling",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/products/home-garden-seed-kit.jpg",
        alt: "Hands holding dark soil with a young green seedling",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/sustainability/growing-together.jpg",
        alt: "Young seedling sprout in soil",
        width: 880,
        height: 660,
      },
    ],
    description:
      "Includes 4 heirloom open-pollinated seed varieties (Holy Basil, Coriander, Fenugreek, Cherry Tomato) accompanied by 2 kg enriched bio-char vermicompost discs and coir starter pots.",
    specifications: [
      { label: "Seed Types", value: "4 Native Open-pollinated heirloom varieties" },
      { label: "Soil Media", value: "Coco-peat + microbial enriched compost" },
      { label: "Containers", value: "4 biodegradable coir seedling cups" },
      { label: "Origin", value: "Pune, Maharashtra" },
    ],
    shippingInfo: "Ships within 24 hours in moisture-resistant kraft box.",
    careInstructions: "Sow in direct morning sunlight and moisten lightly with spray bottle.",
    reviewsList: [
      {
        id: "rev_9",
        author: "Nikhil P.",
        rating: 5,
        date: "30 Jun 2026",
        title: "All four sprouted within 6 days",
        comment: "Instructions were super clear for a beginner gardener. The holy basil is thriving!",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1009",
    slug: "natural-dhoop-sticks-temple-flower",
    name: "Natural dhoop sticks, temple flower",
    blurb: "Charcoal-free, crafted from upcycled temple marigold & rose.",
    brand: { slug: "bhagya-organics", name: "Bhagya Organics" },
    categorySlug: "spiritual",
    priceInr: 299,
    mrpInr: 399,
    rating: { value: 4.8, count: 512 },
    badge: "25% OFF",
    availability: "in-stock",
    buckets: ["for-you", "trending", "best-sellers", "conscious-picks"],
    tags: ["dhoop", "incense", "spiritual", "puja", "temple flowers", "charcoal free"],
    image: {
      src: "/images/categories/spiritual.jpg",
      alt: "Handcrafted natural dhoop sticks with dried rose and marigold petals on brass thali",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/spiritual.jpg",
        alt: "Natural dhoop sticks and flower petals on brass surface",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/hero/hero-still-life.jpg",
        alt: "Spiritual morning prayer atmosphere",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Hand-rolled by women artisan collectives in Varanasi using discarded sacred temple offerings. Infused with pure guggal, loban, and organic cedarwood oil. 100% charcoal-free, emitting a gentle soothing fragrance without dark smoke.",
    specifications: [
      { label: "Pack Size", value: "40 sticks + 1 handmade ceramic holder" },
      { label: "Burn Time", value: "45 minutes per stick" },
      { label: "Formulation", value: "Charcoal-free, zero sulfur, floral cellulose" },
      { label: "Origin", value: "Varanasi, Uttar Pradesh" },
    ],
    shippingInfo: "Packed in airtight cardboard tube. Dispatched same day.",
    careInstructions: "Light tip, gently blow out flame, and rest on the included ceramic holder.",
    reviewsList: [
      {
        id: "rev_10",
        author: "Ananya R.",
        rating: 5,
        date: "01 Sep 2026",
        title: "Cleanest burning incense I've ever used",
        comment: "Doesn't irritate the throat at all! The temple marigold fragrance is calming and divine.",
        verified: true,
      },
      {
        id: "rev_11",
        author: "Siddharth J.",
        rating: 5,
        date: "18 Aug 2026",
        title: "Long lasting and wonderful fragrance",
        comment: "Ordered 3 boxes. Excellent initiative helping women artisans in Varanasi.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1010",
    slug: "handcrafted-brass-diya-oil-lamp",
    name: "Handcrafted brass diya oil lamp",
    blurb: "Sand-cast solid brass with traditional peacock finial.",
    brand: { slug: "dhara-craft", name: "Dhara Craft" },
    categorySlug: "spiritual",
    priceInr: 890,
    mrpInr: 1199,
    rating: { value: 4.9, count: 87 },
    badge: "Solid Brass",
    availability: "in-stock",
    buckets: ["new-arrivals", "best-sellers"],
    tags: ["brass", "diya", "spiritual", "home mandir", "handmade", "puja"],
    image: {
      src: "/images/hero/hero-detail-cup.jpg",
      alt: "Polished brass ceremonial oil lamp with intricate engravings",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/hero/hero-detail-cup.jpg",
        alt: "Solid brass diya detail view",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/spiritual.jpg",
        alt: "Brass diya lit in mandir setup",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Heavyweight sand-cast brass diya crafted by sixth-generation metalsmiths in Saharanpur. Features deep oil reservoir for steady 4-hour burning and a hand-carved floral wick channel.",
    specifications: [
      { label: "Material", value: "Pure virgin brass (Kansa alloy)" },
      { label: "Weight", value: "320 grams" },
      { label: "Capacity", value: "60 ml oil capacity" },
      { label: "Origin", value: "Saharanpur, Uttar Pradesh" },
    ],
    shippingInfo: "Wrapped in butter paper and rigid foam protection.",
    careInstructions: "Clean with lemon and salt or pitambari powder to maintain warm golden luster.",
    reviewsList: [
      {
        id: "rev_12",
        author: "Sunita G.",
        rating: 5,
        date: "25 Aug 2026",
        title: "Substantial weight and stunning finish",
        comment: "Far superior to thin machine-stamped brass. Perfect centerpiece for Diwali and daily puja.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1011",
    slug: "cold-pressed-sesame-oil-500ml",
    name: "Wood-pressed black sesame oil, 500 ml",
    blurb: "Single-origin til seeds extracted on wooden cold expellers.",
    brand: { slug: "sattva-farms", name: "Sattva Farms" },
    categorySlug: "organic-food",
    priceInr: 380,
    mrpInr: 450,
    rating: { value: 4.8, count: 145 },
    badge: "Wood Pressed",
    availability: "in-stock",
    buckets: ["trending", "for-you"],
    tags: ["sesame oil", "cold pressed", "cooking", "ayurveda", "massage", "raw"],
    image: {
      src: "/images/categories/organic-food.jpg",
      alt: "Dark amber glass bottle of wood-pressed sesame oil with roasted black sesame seeds",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/organic-food.jpg",
        alt: "Sesame oil and organic pantry display",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/products/millet-grain-blend.jpg",
        alt: "Organic food collection preview",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Cold-extracted in Vaagai wood presses (Mara Chekku) below 42°C to safeguard heat-sensitive antioxidants and lignans. Unrefined, unbleached, and free from mineral oil adulteration.",
    specifications: [
      { label: "Ingredients", value: "100% Raw Black Sesame Seeds (Sesamum indicum)" },
      { label: "Extraction", value: "Traditional wood cold press (Chekku)" },
      { label: "Volume", value: "500 ml" },
      { label: "Origin", value: "Tiptur, Karnataka" },
    ],
    shippingInfo: "Bottled in food-grade UV protected tin/glass canister.",
    careInstructions: "Store away from heat and direct sunlight.",
    reviewsList: [
      {
        id: "rev_13",
        author: "Raghav M.",
        rating: 5,
        date: "04 Aug 2026",
        title: "Intense aroma and authentic taste",
        comment: "Unmatched flavor for South Indian tempering and also great for daily morning oil pulling.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1012",
    slug: "pure-copper-water-carafe",
    name: "Hammered pure copper carafe & tumbler",
    blurb: "Hand-beaten 99.7% pure copper for Ayurvedic water storage.",
    brand: { slug: "dhara-craft", name: "Dhara Craft" },
    categorySlug: "wellness",
    priceInr: 1650,
    mrpInr: 2100,
    rating: { value: 4.7, count: 98 },
    badge: "99.7% Pure",
    availability: "in-stock",
    buckets: ["best-sellers", "conscious-picks"],
    tags: ["copper", "tamra jal", "carafe", "wellness", "hydration", "ayurveda"],
    image: {
      src: "/images/categories/wellness.jpg",
      alt: "Hammered pure copper bedside carafe with nested tumbler cup",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/wellness.jpg",
        alt: "Hand-hammered copper vessel setup",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/products/cork-cotton-yoga-mat.jpg",
        alt: "Wellness lifestyle setting with copper bottle",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Hand-beaten by hereditary coppersmiths. Overnight storage in copper (Tamra Jal) naturally ionizes drinking water and supports digestive balance according to classical Charaka Samhita guidelines.",
    specifications: [
      { label: "Capacity", value: "950 ml Carafe + 250 ml Tumbler Cup" },
      { label: "Purity", value: "99.7% Certified Food-grade Copper" },
      { label: "Finish", value: "Hand-hammered dimpled texture" },
      { label: "Origin", value: "Saharanpur, Uttar Pradesh" },
    ],
    shippingInfo: "Shipped in protective presentation box.",
    careInstructions: "Rinse with tamarind pulp or lemon wedge weekly to remove natural oxidation.",
    reviewsList: [
      {
        id: "rev_14",
        author: "Aman T.",
        rating: 5,
        date: "16 Jul 2026",
        title: "Bedside essential",
        comment: "The nested tumbler lid keeps dust out. Beautiful craftsmanship and water tastes crisp.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1013",
    slug: "kansa-wand-face-massage-tool",
    name: "Ayurvedic Kansa wand facial tool",
    blurb: "Bronze alloy dome on reclaimed teak handle for lymphatic drainage.",
    brand: { slug: "veda-root", name: "Veda Root" },
    categorySlug: "ayurveda",
    priceInr: 1290,
    mrpInr: 1600,
    rating: { value: 4.9, count: 114 },
    badge: "Handcrafted",
    availability: "in-stock",
    buckets: ["trending", "new-arrivals"],
    tags: ["kansa wand", "ayurveda", "facial tool", "massage", "bronze", "glow"],
    image: {
      src: "/images/categories/ayurveda.jpg",
      alt: "Bronze Kansa wand with turned teak wood handle on organic linen",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/ayurveda.jpg",
        alt: "Kansa wand and herbal massage preparations",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/products/rose-saffron-face-oil.jpg",
        alt: "Kansa wand paired with botanical face oil",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Handcrafted using sacred Kansa metal (sacred bell metal alloy of copper and tin) mounted on an ergonomically turned teak handle. Massaging marma points balances skin pH and alleviates facial tension.",
    specifications: [
      { label: "Material", value: "Kansa (78% Copper, 22% Tin) & Salwood" },
      { label: "Dimensions", value: "14 cm length, 4.5 cm dome diameter" },
      { label: "Application", value: "Facial lymphatic massage & marma therapy" },
      { label: "Origin", value: "Nagpur, Maharashtra" },
    ],
    shippingInfo: "Includes organic cotton travel drawstring pouch.",
    careInstructions: "Wipe clean with a drop of coconut oil and soft cloth after use.",
    reviewsList: [
      {
        id: "rev_15",
        author: "Bhavna C.",
        rating: 5,
        date: "03 Aug 2026",
        title: "Relieves jaw tension noticeably",
        comment: "Pairing this with the rose saffron oil has become my favorite 5-minute nightly ritual.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1014",
    slug: "vetiver-exfoliating-bath-scrub",
    name: "Wild vetiver root bath scrubber",
    blurb: "Hand-knitted khus root scrubber for skin rejuvenation.",
    brand: { slug: "neer-herbals", name: "Neer Herbals" },
    categorySlug: "personal-care",
    priceInr: 280,
    mrpInr: 350,
    rating: { value: 4.5, count: 204 },
    badge: "Zero Plastic",
    availability: "in-stock",
    buckets: ["for-you", "conscious-picks"],
    tags: ["vetiver", "scrubber", "bath", "exfoliating", "plastic free", "natural root"],
    image: {
      src: "/images/categories/personal-care.jpg",
      alt: "Round woven wild vetiver root bath scrubber beside handmade cold-process soap",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/personal-care.jpg",
        alt: "Vetiver scrubber and herbal personal care products",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/products/bamboo-brush-set.jpg",
        alt: "Eco bathroom wellness collection",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Hand-knitted from aromatic wild vetiver (Khus) roots by tribal women self-help collectives. Gentle fibrous texture sloughs off dead cells while releasing a grounded woody fragrance with hot water.",
    specifications: [
      { label: "Material", value: "100% Wild Vetiver (Chrysopogon zizanioides) roots" },
      { label: "Dimensions", value: "10 cm diameter round disc" },
      { label: "Lifespan", value: "3–4 months with daily use" },
      { label: "Origin", value: "Puducherry" },
    ],
    shippingInfo: "Compostable cornstarch outer wrap.",
    careInstructions: "Hang dry by the integrated jute loop in a ventilated shower area.",
    reviewsList: [
      {
        id: "rev_16",
        author: "Kiran D.",
        rating: 5,
        date: "20 Jul 2026",
        title: "Heavenly earthy scent",
        comment: "Feels gentle on skin and makes the entire bathroom smell like fresh rain on earth.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1015",
    slug: "hand-thrown-stoneware-chai-kulhad-set",
    name: "Stoneware chai kulhad set of 4",
    blurb: "Matte glazed ribbed ceramic cups thrown by master potters.",
    brand: { slug: "mitti-studio", name: "Mitti Studio" },
    categorySlug: "handmade",
    priceInr: 980,
    mrpInr: 1250,
    rating: { value: 4.8, count: 156 },
    badge: "Set of 4",
    availability: "in-stock",
    buckets: ["best-sellers", "trending"],
    tags: ["ceramic", "kulhad", "chai", "pottery", "handmade", "tableware"],
    image: {
      src: "/images/categories/handmade.jpg",
      alt: "Set of four ribbed earthy stoneware chai kulhads on rough wooden slab",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/categories/handmade.jpg",
        alt: "Stoneware chai cups detail view",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/hero/hero-detail-cup.jpg",
        alt: "Ceramic cup still life study",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "High-fired stoneware inspired by the timeless roadside clay kulhad, engineered for everyday durability. Unglazed exterior highlights raw tactile slip clay, while food-grade matte glaze lines the inside.",
    specifications: [
      { label: "Quantity", value: "Set of 4 Kulhads" },
      { label: "Capacity", value: "160 ml each" },
      { label: "Properties", value: "Microwave and dishwasher safe, lead-free" },
      { label: "Origin", value: "Khurja, Uttar Pradesh" },
    ],
    shippingInfo: "Packaged in five-ply shatterproof double box.",
    careInstructions: "Dishwasher safe; avoid sudden thermal shocks.",
    reviewsList: [
      {
        id: "rev_17",
        author: "Gaurav K.",
        rating: 5,
        date: "11 Aug 2026",
        title: "Morning tea elevated",
        comment: "Great grip and warmth retention. Beautiful subtle variations in the glaze.",
        verified: true,
      },
    ],
  },
  {
    id: "prd_1016",
    slug: "sheesham-wood-spice-box-masala-dani",
    name: "Sheesham wood masala dani spice box",
    blurb: "Hand-carved hardwood container with 9 brass-lined compartments.",
    brand: { slug: "dhara-craft", name: "Dhara Craft" },
    categorySlug: "handmade",
    priceInr: 1490,
    mrpInr: 1850,
    rating: { value: 4.7, count: 78 },
    badge: "Artisanal",
    availability: "in-stock",
    buckets: ["for-you", "new-arrivals"],
    tags: ["wood", "spice box", "masala dani", "kitchen", "sheesham", "handmade"],
    image: {
      src: "/images/hero/hero-still-life.jpg",
      alt: "Handcrafted sheesham wood circular spice box with clear glass lid and brass latch",
      width: 880,
      height: 1100,
    },
    gallery: [
      {
        src: "/images/hero/hero-still-life.jpg",
        alt: "Craft wooden spice box with aromatic spices inside",
        width: 880,
        height: 1100,
      },
      {
        src: "/images/categories/handmade.jpg",
        alt: "Artisan woodwork and pottery assortment",
        width: 880,
        height: 1100,
      },
    ],
    description:
      "Crafted from seasoned natural Indian Rosewood (Sheesham) with glass window lid and brass fastener. Includes 9 removable wooden spice containers and miniature carved wooden spice spoon.",
    specifications: [
      { label: "Dimensions", value: "21 cm × 21 cm × 6.5 cm" },
      { label: "Compartments", value: "9 removable cups (50 ml each) + 1 small spoon" },
      { label: "Wood Polish", value: "Food-safe cold-pressed walnut oil polish" },
      { label: "Origin", value: "Saharanpur, Uttar Pradesh" },
    ],
    shippingInfo: "Shipped in reinforced cardboard crate.",
    careInstructions: "Do not soak in water; buff lightly with food oil once a year.",
    reviewsList: [
      {
        id: "rev_18",
        author: "Manju L.",
        rating: 5,
        date: "29 Jul 2026",
        title: "Heirloom kitchen centerpiece",
        comment: "Glass lid lets you see colorful spices at a glance. Splendid joinery and wood grain.",
        verified: true,
      },
    ],
  },
];

/** Bucket tabs on the home page and shop discovery, in display order. */
export const productBuckets: readonly { id: ProductBucket; label: string }[] = [
  { id: "for-you", label: "For You" },
  { id: "trending", label: "Trending" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "conscious-picks", label: "Conscious Picks" },
] as const;

/** `GET /api/v1/products?bucket=…` */
export function getProductsByBucket(bucket: ProductBucket): ProductDetail[] {
  return products.filter((product) => product.buckets.includes(bucket));
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsBySlugs(slugs: readonly string[]): ProductDetail[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is ProductDetail => Boolean(product));
}

export function getAllProducts(): readonly ProductDetail[] {
  return products;
}

/**
 * Filter and sort engine for the `/shop` route.
 */
export function filterAndSortProducts({
  query = "",
  bucket = null,
  category = "all",
  brand = "all",
  price = "all",
  rating = "all",
  availability = "all",
  discountOnly = false,
  sort = "recommended",
}: {
  query?: string;
  bucket?: ProductBucket | null;
  category?: string;
  brand?: string;
  price?: string;
  rating?: string;
  availability?: string;
  discountOnly?: boolean;
  sort?: SortOption;
}): ProductDetail[] {
  let result = [...products];

  // 1. Search Query
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }

  // 2. Bucket (Discovery Tab)
  if (bucket && bucket !== ("for-you" as ProductBucket)) {
    result = result.filter((p) => p.buckets.includes(bucket));
  }

  // 3. Category Filter
  if (category && category !== "all") {
    result = result.filter((p) => p.categorySlug === category);
  }

  // 4. Brand Filter
  if (brand && brand !== "all") {
    result = result.filter((p) => p.brand.slug === brand);
  }

  // 5. Price Filter
  if (price && price !== "all") {
    if (price === "under-500") {
      result = result.filter((p) => p.priceInr < 500);
    } else if (price === "500-1000") {
      result = result.filter((p) => p.priceInr >= 500 && p.priceInr <= 1000);
    } else if (price === "1000-2500") {
      result = result.filter((p) => p.priceInr > 1000 && p.priceInr <= 2500);
    } else if (price === "above-2500") {
      result = result.filter((p) => p.priceInr > 2500);
    }
  }

  // 6. Rating Filter
  if (rating && rating !== "all") {
    if (rating === "4-plus") {
      result = result.filter((p) => (p.rating?.value ?? 0) >= 4.0);
    } else if (rating === "3-plus") {
      result = result.filter((p) => (p.rating?.value ?? 0) >= 3.0);
    }
  }

  // 7. Availability Filter
  if (availability && availability !== "all") {
    result = result.filter((p) => p.availability === availability);
  }

  // 8. Discount Only
  if (discountOnly) {
    result = result.filter((p) => p.mrpInr !== null && p.mrpInr > p.priceInr);
  }

  // 9. Sorting
  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.priceInr - b.priceInr);
      break;
    case "price-desc":
      result.sort((a, b) => b.priceInr - a.priceInr);
      break;
    case "top-rated":
      result.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
      break;
    case "newest":
      result.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
      break;
    case "recommended":
    default:
      // Keep curated order or rating count
      break;
  }

  return result;
}

/** Related recommendations based on category / shared tags */
export function getRelatedProducts(currentProductSlug: string, limit = 4): ProductDetail[] {
  const current = getProductBySlug(currentProductSlug);
  if (!current) return products.slice(0, limit);

  const candidates = products.filter((p) => p.slug !== currentProductSlug);
  // Sort by same category first
  const sorted = candidates.sort((a, b) => {
    const aSameCategory = a.categorySlug === current.categorySlug ? 1 : 0;
    const bSameCategory = b.categorySlug === current.categorySlug ? 1 : 0;
    return bSameCategory - aSameCategory;
  });

  return sorted.slice(0, limit);
}
