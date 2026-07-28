/**
 * Seed content — the site renders from this until Supabase is connected, and
 * these same rows are inserted by supabase/seed.sql. Everything here is meant
 * to be edited by the owner from the (future) admin dashboard.
 *
 * Placeholder note: images are intentionally omitted (image_url: null) so the
 * app shows designed gradient placeholders. Drop in real URLs to replace them.
 */

import type {
  Faq,
  GalleryEvent,
  HeroSlide,
  MenuCategory,
  MenuItem,
  Package,
  Service,
  SiteSettings,
  Stat,
  Testimonial,
} from "@/types/db";

export const seedSiteSettings: SiteSettings = {
  id: "seed-settings",
  business_name: "All Seasons Catering Company",
  tagline: "Exceptional catering for life's most important seasons.",
  about_short:
    "For over a decade, All Seasons Catering Company has brought elegance, flavour and flawless service to weddings, corporate events and celebrations across Nigeria.",
  phone: "+234 800 000 0000",
  whatsapp: "+2348000000000",
  email: "hello@allseasonscatering.ng",
  address: "Lagos, Nigeria",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  tiktok_url: "https://tiktok.com",
  bank_name: "Your Bank Name",
  bank_account_name: "All Seasons Catering Company",
  bank_account_number: "0000000000",
  default_deposit_percent: 50,
};

export const seedStats: Stat[] = [
  { id: "s1", label: "Events Catered", value: "500", suffix: "+", sort_order: 1, is_active: true },
  { id: "s2", label: "Years of Experience", value: "12", suffix: "+", sort_order: 2, is_active: true },
  { id: "s3", label: "Guests Served", value: "80,000", suffix: "+", sort_order: 3, is_active: true },
  { id: "s4", label: "Client Rating", value: "4.9", suffix: "/5", sort_order: 4, is_active: true },
];

export const seedHeroSlides: HeroSlide[] = [
  {
    id: "h1",
    eyebrow: "Premium Event Catering",
    headline: "Catering that makes every season unforgettable",
    subheadline:
      "From intimate gatherings to grand celebrations, we craft menus and moments your guests will talk about for years.",
    image_url: null,
    cta_label: "Request a Quote",
    cta_href: "/request-quote",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "h2",
    eyebrow: "Weddings & Traditional Marriages",
    headline: "A feast worthy of the day you'll never forget",
    subheadline:
      "Signature Nigerian dishes, refined presentation and service that lets you enjoy your own celebration.",
    image_url: null,
    cta_label: "See Our Packages",
    cta_href: "/packages",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "h3",
    eyebrow: "Corporate & Private Events",
    headline: "Impeccable food. Effortless experience.",
    subheadline:
      "Trusted by families and organisations to deliver flawlessly, whatever the occasion or guest count.",
    image_url: null,
    cta_label: "Explore Our Menu",
    cta_href: "/menu",
    sort_order: 3,
    is_active: true,
  },
];

export const seedServices: Service[] = [
  { id: "sv1", slug: "weddings", title: "Weddings", description: "Elegant, unforgettable wedding catering tailored to your love story and guest list.", icon: "Heart", image_url: null, sort_order: 1, is_active: true },
  { id: "sv2", slug: "traditional-marriages", title: "Traditional Marriages", description: "Authentic delicacies and rich presentation that honour your culture and family.", icon: "Crown", image_url: null, sort_order: 2, is_active: true },
  { id: "sv3", slug: "corporate-events", title: "Corporate Events", description: "Professional, punctual catering for conferences, launches and company celebrations.", icon: "Briefcase", image_url: null, sort_order: 3, is_active: true },
  { id: "sv4", slug: "birthday-parties", title: "Birthday Parties", description: "Joyful spreads and small chops that turn any birthday into a proper celebration.", icon: "Cake", image_url: null, sort_order: 4, is_active: true },
  { id: "sv5", slug: "church-programs", title: "Church Programs", description: "Reliable large-scale catering for conventions, harvests and church anniversaries.", icon: "Church", image_url: null, sort_order: 5, is_active: true },
  { id: "sv6", slug: "outdoor-catering", title: "Outdoor Catering", description: "Fully equipped mobile catering that delivers hot, fresh food anywhere you gather.", icon: "Tent", image_url: null, sort_order: 6, is_active: true },
  { id: "sv7", slug: "graduation-ceremonies", title: "Graduation Ceremonies", description: "Celebrate the achievement with a feast as memorable as the milestone.", icon: "GraduationCap", image_url: null, sort_order: 7, is_active: true },
  { id: "sv8", slug: "naming-ceremonies", title: "Naming Ceremonies", description: "Warm, family-style catering to welcome your newest blessing in style.", icon: "Baby", image_url: null, sort_order: 8, is_active: true },
  { id: "sv9", slug: "funeral-receptions", title: "Funeral Receptions", description: "Dignified, compassionate catering that lets you focus on family and remembrance.", icon: "Flower2", image_url: null, sort_order: 9, is_active: true },
  { id: "sv10", slug: "private-parties", title: "Private Parties", description: "Intimate dinners and house parties with a personal, chef-driven touch.", icon: "PartyPopper", image_url: null, sort_order: 10, is_active: true },
  { id: "sv11", slug: "government-events", title: "Government Events", description: "Trusted, security-conscious catering for official functions at any scale.", icon: "Landmark", image_url: null, sort_order: 11, is_active: true },
];

export const seedPackages: Package[] = [
  {
    id: "pk-silver",
    slug: "silver",
    name: "Silver Package",
    tier: "Silver",
    tagline: "Everything you need for a beautiful, well-fed celebration.",
    description:
      "Our essential package delivers crowd-favourite Nigerian classics with the quality and service All Seasons is known for.",
    price_from: 8500,
    price_unit: "per guest",
    image_url: null,
    included_items: [
      "Jollof Rice",
      "Fried Rice",
      "Moi Moi",
      "One Soup of Choice",
      "Semo",
      "Chicken",
      "Coleslaw",
    ],
    is_popular: false,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "pk-gold",
    slug: "gold",
    name: "Gold Package",
    tier: "Gold",
    tagline: "Our most-loved package — variety, abundance and elegance.",
    description:
      "A generous spread of rice dishes, soups and proteins designed to impress larger celebrations and discerning guests.",
    price_from: 14500,
    price_unit: "per guest",
    image_url: null,
    included_items: [
      "Jollof Rice",
      "Fried Rice",
      "Coconut Rice",
      "White Rice with Chicken in Chilli Sauce",
      "Ukwa",
      "Moi Moi",
      "Two Soups of Choice",
      "Abacha & Nkwobi",
      "Semo",
      "Fried Plantain",
      "Peppered Chicken",
      "Peppered Fish",
      "Beef",
      "Salad",
    ],
    is_popular: true,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "pk-platinum",
    slug: "platinum",
    name: "Platinum Package",
    tier: "Platinum (VVIP)",
    tagline: "The ultimate luxury dining experience, without compromise.",
    description:
      "An extravagant, chef-curated banquet spanning continental and traditional favourites — reserved for events that deserve the very best.",
    price_from: 25000,
    price_unit: "per guest",
    image_url: null,
    included_items: [
      "Chinese Fried Rice",
      "Jambalaya Rice",
      "Basmati White Rice",
      "Sauce of Choice",
      "Coconut Rice",
      "Noodles",
      "Fried Plantain",
      "Pasta",
      "Ukwa",
      "Moi Moi",
      "Unripe Plantain Porridge",
      "Soups of Choice",
      "Semo / Oats",
      "Goat Meat Pepper Soup",
      "Abacha & Nkwobi",
      "Achicha & Akidi",
      "Ofada Rice with Ofada Sauce",
      "Peppered Chicken",
      "Peppered Fish",
      "Beef",
      "Salad",
    ],
    is_popular: false,
    sort_order: 3,
    is_active: true,
  },
];

export const seedMenuCategories: MenuCategory[] = [
  { id: "mc-rice", slug: "rice", name: "Rice Dishes", description: "Our signature rice, cooked to smoky, flavourful perfection.", sort_order: 1, is_active: true },
  { id: "mc-soups", slug: "soups", name: "Soups", description: "Rich, hearty Nigerian soups made from time-honoured recipes.", sort_order: 2, is_active: true },
  { id: "mc-proteins", slug: "proteins", name: "Proteins", description: "Perfectly seasoned meats, fish and poultry.", sort_order: 3, is_active: true },
  { id: "mc-small-chops", slug: "small-chops", name: "Small Chops", description: "Irresistible bites for cocktails, weddings and parties.", sort_order: 4, is_active: true },
  { id: "mc-local", slug: "local-delicacies", name: "Local Delicacies", description: "Authentic regional specialities that delight every crowd.", sort_order: 5, is_active: true },
  { id: "mc-sides", slug: "sides-swallow", name: "Sides & Swallow", description: "The perfect accompaniments to complete any plate.", sort_order: 6, is_active: true },
  { id: "mc-desserts", slug: "desserts", name: "Desserts", description: "Sweet finishes to round off the celebration.", sort_order: 7, is_active: true },
  { id: "mc-drinks", slug: "drinks", name: "Drinks", description: "Refreshing beverages, mocktails and fresh juices.", sort_order: 8, is_active: true },
];

export const seedMenuItems: MenuItem[] = [
  // Rice
  { id: "mi-jollof", category_id: "mc-rice", name: "Party Jollof Rice", description: "Smoky, tomato-rich jollof — the star of every Nigerian party.", image_url: "/images/menu/jollofrice.png", is_optional_extra: false, sort_order: 1, is_active: true },
  { id: "mi-fried-rice", category_id: "mc-rice", name: "Fried Rice", description: "Colourful vegetable fried rice with liver and shrimp.", image_url: "/images/menu/friedrice.png", is_optional_extra: false, sort_order: 2, is_active: true },
  { id: "mi-coconut-rice", category_id: "mc-rice", name: "Coconut Rice", description: "Fragrant rice simmered in fresh coconut milk.", image_url: "/images/menu/coconutrice.png", is_optional_extra: false, sort_order: 3, is_active: true },
  { id: "mi-ofada", category_id: "mc-rice", name: "Ofada Rice & Ayamase", description: "Local ofada rice with spicy designer stew.", image_url: "/images/menu/ofadarice.png", is_optional_extra: false, sort_order: 4, is_active: true },
  { id: "mi-chinese-rice", category_id: "mc-rice", name: "Chinese Fried Rice", description: "Wok-tossed rice with a continental twist.", image_url: "/images/menu/chinesefriedrice.png", is_optional_extra: false, sort_order: 5, is_active: true },

  // Soups
  { id: "mi-egusi", category_id: "mc-soups", name: "Egusi Soup", description: "Melon-seed soup loaded with assorted meat and fish.", image_url: "/images/menu/egusisoup.png", is_optional_extra: false, sort_order: 1, is_active: true },
  { id: "mi-oha", category_id: "mc-soups", name: "Oha Soup", description: "Delicate Eastern soup with tender oha leaves.", image_url: "/images/menu/uhasoup.png", is_optional_extra: false, sort_order: 2, is_active: true },
  { id: "mi-afang", category_id: "mc-soups", name: "Afang Soup", description: "Nutritious vegetable soup, a coastal favourite.", image_url: "/images/menu/afangsoup.png", is_optional_extra: false, sort_order: 3, is_active: true },
  { id: "mi-nsala", category_id: "mc-soups", name: "Ofe Nsala (White Soup)", description: "Aromatic white soup with catfish and utazi.", image_url: null, is_optional_extra: false, sort_order: 4, is_active: true },
  { id: "mi-banga", category_id: "mc-soups", name: "Banga Soup", description: "Rich palm-fruit soup bursting with flavour.", image_url: null, is_optional_extra: false, sort_order: 5, is_active: true },

  // Proteins
  { id: "mi-pep-chicken", category_id: "mc-proteins", name: "Peppered Chicken", description: "Grilled chicken tossed in spicy pepper sauce.", image_url: null, is_optional_extra: false, sort_order: 1, is_active: true },
  { id: "mi-pep-fish", category_id: "mc-proteins", name: "Peppered Fish", description: "Whole croaker fish, spiced and grilled.", image_url: null, is_optional_extra: false, sort_order: 2, is_active: true },
  { id: "mi-goat", category_id: "mc-proteins", name: "Goat Meat Pepper Soup", description: "Warming pepper soup with tender goat meat.", image_url: null, is_optional_extra: false, sort_order: 3, is_active: true },
  { id: "mi-beef", category_id: "mc-proteins", name: "Assorted Beef", description: "Slow-cooked, richly seasoned beef cuts.", image_url: null, is_optional_extra: false, sort_order: 4, is_active: true },
  { id: "mi-turkey", category_id: "mc-proteins", name: "Peppered Turkey", description: "Succulent turkey in a smoky pepper glaze.", image_url: null, is_optional_extra: false, sort_order: 5, is_active: true },

  // Small Chops (optional extras)
  { id: "mi-samosa", category_id: "mc-small-chops", name: "Samosa & Spring Rolls", description: "Crispy, golden and perfect for cocktails.", image_url: null, is_optional_extra: true, sort_order: 1, is_active: true },
  { id: "mi-puffpuff", category_id: "mc-small-chops", name: "Puff Puff", description: "Fluffy, sweet Nigerian doughnut bites.", image_url: null, is_optional_extra: true, sort_order: 2, is_active: true },
  { id: "mi-gizdodo", category_id: "mc-small-chops", name: "Gizdodo", description: "Gizzard and plantain in savoury pepper sauce.", image_url: null, is_optional_extra: true, sort_order: 3, is_active: true },
  { id: "mi-asun", category_id: "mc-small-chops", name: "Asun (Spicy Goat)", description: "Smoky peppered goat meat, a crowd favourite.", image_url: null, is_optional_extra: true, sort_order: 4, is_active: true },
  { id: "mi-chicken-wings", category_id: "mc-small-chops", name: "Chicken Wings", description: "Barbecue and peppered wings, endlessly moreish.", image_url: null, is_optional_extra: true, sort_order: 5, is_active: true },

  // Local Delicacies
  { id: "mi-abacha", category_id: "mc-local", name: "Abacha & Nkwobi", description: "African salad and spicy cow-foot delicacy.", image_url: null, is_optional_extra: false, sort_order: 1, is_active: true },
  { id: "mi-ukwa", category_id: "mc-local", name: "Ukwa (Breadfruit)", description: "Traditional Eastern breadfruit porridge.", image_url: null, is_optional_extra: false, sort_order: 2, is_active: true },
  { id: "mi-moimoi", category_id: "mc-local", name: "Moi Moi", description: "Steamed bean pudding with egg and fish.", image_url: null, is_optional_extra: false, sort_order: 3, is_active: true },
  { id: "mi-akidi", category_id: "mc-local", name: "Achicha & Akidi", description: "Dried cocoyam and beans, a rare treat.", image_url: null, is_optional_extra: false, sort_order: 4, is_active: true },

  // Sides & Swallow
  { id: "mi-semo", category_id: "mc-sides", name: "Semo", description: "Smooth semolina swallow.", image_url: null, is_optional_extra: true, sort_order: 1, is_active: true },
  { id: "mi-pounded", category_id: "mc-sides", name: "Pounded Yam", description: "Classic, stretchy pounded yam.", image_url: null, is_optional_extra: true, sort_order: 2, is_active: true },
  { id: "mi-plantain", category_id: "mc-sides", name: "Fried Plantain (Dodo)", description: "Sweet, caramelised fried plantain.", image_url: null, is_optional_extra: true, sort_order: 3, is_active: true },
  { id: "mi-salad", category_id: "mc-sides", name: "Garden Salad & Coleslaw", description: "Crisp, fresh and colourful.", image_url: null, is_optional_extra: true, sort_order: 4, is_active: true },

  // Desserts
  { id: "mi-chinchin", category_id: "mc-desserts", name: "Chin Chin", description: "Crunchy sweet-fried pastry bites.", image_url: null, is_optional_extra: true, sort_order: 1, is_active: true },
  { id: "mi-cake", category_id: "mc-desserts", name: "Celebration Cake", description: "Bespoke event cakes to your design.", image_url: null, is_optional_extra: true, sort_order: 2, is_active: true },
  { id: "mi-fruit", category_id: "mc-desserts", name: "Fresh Fruit Platter", description: "Seasonal tropical fruit, beautifully arranged.", image_url: null, is_optional_extra: true, sort_order: 3, is_active: true },

  // Drinks
  { id: "mi-zobo", category_id: "mc-drinks", name: "Zobo & Chapman", description: "Chilled hibiscus and the classic Nigerian cocktail.", image_url: null, is_optional_extra: true, sort_order: 1, is_active: true },
  { id: "mi-juice", category_id: "mc-drinks", name: "Fresh Juices", description: "Pineapple, watermelon and orange, freshly pressed.", image_url: null, is_optional_extra: true, sort_order: 2, is_active: true },
  { id: "mi-smoothies", category_id: "mc-drinks", name: "Smoothie Bar", description: "A live station of blended fruit smoothies.", image_url: null, is_optional_extra: true, sort_order: 3, is_active: true },
];

export const seedGalleryEvents: GalleryEvent[] = [
  { id: "ev1", slug: "royal-garden-wedding", title: "Royal Garden Wedding", event_type: "Wedding", location: "Lekki, Lagos", guest_count: 500, event_date: "2025-11-14", description: "A breathtaking outdoor wedding with a five-station live buffet and bespoke cocktail bar.", cover_image_url: null, images: [], is_featured: true, sort_order: 1, is_active: true },
  { id: "ev2", slug: "igbo-traditional-marriage", title: "Igbo Traditional Marriage", event_type: "Traditional Marriage", location: "Owerri, Imo", guest_count: 350, event_date: "2025-09-06", description: "An authentic celebration featuring Abacha, Nkwobi, Ukwa and a full traditional spread.", cover_image_url: null, images: [], is_featured: true, sort_order: 2, is_active: true },
  { id: "ev3", slug: "tech-summit-corporate", title: "Annual Tech Summit", event_type: "Corporate Event", location: "Victoria Island, Lagos", guest_count: 800, event_date: "2025-10-22", description: "Two days of continental breakfasts, plated lunches and canapé receptions for delegates.", cover_image_url: null, images: [], is_featured: true, sort_order: 3, is_active: true },
  { id: "ev4", slug: "golden-birthday-soiree", title: "Golden 50th Birthday", event_type: "Birthday Party", location: "Ikoyi, Lagos", guest_count: 220, event_date: "2025-08-30", description: "An elegant black-and-gold soirée with grazing tables and a live small-chops station.", cover_image_url: null, images: [], is_featured: false, sort_order: 4, is_active: true },
  { id: "ev5", slug: "harvest-thanksgiving", title: "Harvest & Thanksgiving", event_type: "Church Program", location: "Abuja", guest_count: 1200, event_date: "2025-12-07", description: "Large-scale catering delivered flawlessly for a full-day church convention.", cover_image_url: null, images: [], is_featured: false, sort_order: 5, is_active: true },
  { id: "ev6", slug: "lakeside-outdoor-feast", title: "Lakeside Outdoor Feast", event_type: "Outdoor Catering", location: "Epe, Lagos", guest_count: 300, event_date: "2025-07-19", description: "A fully mobile setup bringing hot, fresh Nigerian cuisine to a scenic lakeside venue.", cover_image_url: null, images: [], is_featured: false, sort_order: 6, is_active: true },
  { id: "ev7", slug: "graduation-celebration", title: "Graduation Celebration", event_type: "Graduation Ceremony", location: "Nsukka, Enugu", guest_count: 180, event_date: "2025-06-28", description: "A joyful family feast marking a first-class honours achievement.", cover_image_url: null, images: [], is_featured: false, sort_order: 7, is_active: true },
  { id: "ev8", slug: "naming-ceremony", title: "Naming Ceremony", event_type: "Naming Ceremony", location: "Surulere, Lagos", guest_count: 150, event_date: "2025-05-10", description: "Warm, home-style catering to welcome a new baby with family and friends.", cover_image_url: null, images: [], is_featured: false, sort_order: 8, is_active: true },
  { id: "ev9", slug: "private-chefs-dinner", title: "Private Chef's Dinner", event_type: "Private Party", location: "Banana Island, Lagos", guest_count: 40, event_date: "2025-04-18", description: "An intimate multi-course plated dinner with a dedicated chef and service team.", cover_image_url: null, images: [], is_featured: true, sort_order: 9, is_active: true },
];

export const seedTestimonials: Testimonial[] = [
  { id: "t1", author_name: "Chioma & Emeka", author_role: "Wedding · Lagos", quote: "All Seasons turned our wedding into the talk of the year. The jollof, the service, the presentation — everything was perfect. Our guests are still raving about it.", rating: 5, avatar_url: null, is_featured: true, sort_order: 1, is_active: true },
  { id: "t2", author_name: "Adebayo O.", author_role: "Corporate Event Lead", quote: "We hosted 800 delegates over two days and not a single detail was missed. Professional, punctual and genuinely delicious. They are now our default caterer.", rating: 5, avatar_url: null, is_featured: true, sort_order: 2, is_active: true },
  { id: "t3", author_name: "Mrs. Folake A.", author_role: "50th Birthday", quote: "From the tasting to the last plate, I felt completely taken care of. The grazing table was a work of art and the small chops never stopped coming.", rating: 5, avatar_url: null, is_featured: true, sort_order: 3, is_active: true },
  { id: "t4", author_name: "Pastor Chidi N.", author_role: "Church Convention", quote: "Catering for over a thousand people is no small feat, yet they served everyone hot, fresh food on time. Truly dependable.", rating: 5, avatar_url: null, is_featured: false, sort_order: 4, is_active: true },
  { id: "t5", author_name: "Ngozi & Family", author_role: "Traditional Marriage", quote: "They understood our culture and delivered every traditional dish to perfection. My mother said it tasted just like home.", rating: 5, avatar_url: null, is_featured: false, sort_order: 5, is_active: true },
  { id: "t6", author_name: "Tunde B.", author_role: "Private Dinner", quote: "An intimate dinner for 40 that felt like fine dining. The plating, the flavours, the attentive service — worth every naira.", rating: 5, avatar_url: null, is_featured: false, sort_order: 6, is_active: true },
];

export const seedFaqs: Faq[] = [
  { id: "f1", category: "Booking", question: "How far in advance should I book?", answer: "We recommend booking at least 4–6 weeks ahead for large events, and earlier for peak wedding season. However, we do our best to accommodate shorter timelines — just reach out.", sort_order: 1, is_active: true },
  { id: "f2", category: "Booking", question: "How do I get a quote?", answer: "Simply click 'Request a Quote' and complete our short guided form with your event details and menu preferences. We'll prepare a professional quotation and send it to you by email.", sort_order: 2, is_active: true },
  { id: "f3", category: "Menu", question: "Can I customise the menu?", answer: "Absolutely. Every package is a starting point. You can swap dishes, add small chops, sides and premium options, and tell us about any special requests during the quote process.", sort_order: 3, is_active: true },
  { id: "f4", category: "Menu", question: "Do you cater for dietary requirements?", answer: "Yes. We happily prepare vegetarian, halal and allergy-conscious options. Let us know your requirements and we'll tailor the menu accordingly.", sort_order: 4, is_active: true },
  { id: "f5", category: "Logistics", question: "What areas do you cover?", answer: "We are based in Lagos and cater nationwide across Nigeria. Travel and logistics for events outside Lagos are included in your custom quote.", sort_order: 5, is_active: true },
  { id: "f6", category: "Logistics", question: "Do you provide serving staff and equipment?", answer: "Yes. Chafing dishes, serving stations, uniformed servers and full setup can all be included. Just let us know your needs and venue.", sort_order: 6, is_active: true },
  { id: "f7", category: "Logistics", question: "What is the minimum guest count?", answer: "We cater intimate private dinners from as few as 20 guests, all the way up to large events of several thousand.", sort_order: 7, is_active: true },
  { id: "f8", category: "Payment", question: "How does payment work?", answer: "Once you accept your quotation, a deposit (typically 50%) secures your date. The balance is due before or on the event day, per your agreement. We accept bank transfer.", sort_order: 8, is_active: true },
  { id: "f9", category: "Payment", question: "Is my deposit refundable?", answer: "Deposits secure your date and our team's availability. Our cancellation terms are shared with your quotation — please contact us as early as possible if plans change.", sort_order: 9, is_active: true },
  { id: "f10", category: "Booking", question: "Can I arrange a tasting?", answer: "Yes — for weddings and larger events we offer tastings so you can finalise your menu with confidence. Ask us when you receive your quote.", sort_order: 10, is_active: true },
];
