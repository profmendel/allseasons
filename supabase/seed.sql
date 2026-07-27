-- =============================================================================
-- All Seasons Catering — Seed data
-- Run after 0001_initial_schema.sql. Mirrors lib/seed.ts so the live site
-- matches the preview content. Safe to edit / extend from the admin dashboard.
-- =============================================================================

-- ---- Site settings (single row) --------------------------------------------
insert into public.site_settings
  (business_name, tagline, about_short, phone, whatsapp, email, address,
   instagram_url, facebook_url, tiktok_url, bank_name, bank_account_name,
   bank_account_number, default_deposit_percent)
values
  ('All Seasons Catering Company',
   'Exceptional catering for life''s most important seasons.',
   'For over a decade, All Seasons Catering Company has brought elegance, flavour and flawless service to weddings, corporate events and celebrations across Nigeria.',
   '+234 800 000 0000', '+2348000000000', 'hello@allseasonscatering.ng', 'Lagos, Nigeria',
   'https://instagram.com', 'https://facebook.com', 'https://tiktok.com',
   'Your Bank Name', 'All Seasons Catering Company', '0000000000', 50)
on conflict do nothing;

-- ---- Stats ------------------------------------------------------------------
insert into public.stats (label, value, suffix, sort_order) values
  ('Events Catered', '500', '+', 1),
  ('Years of Experience', '12', '+', 2),
  ('Guests Served', '80,000', '+', 3),
  ('Client Rating', '4.9', '/5', 4);

-- ---- Hero slides ------------------------------------------------------------
insert into public.hero_slides (eyebrow, headline, subheadline, cta_label, cta_href, sort_order) values
  ('Premium Event Catering', 'Catering that makes every season unforgettable',
   'From intimate gatherings to grand celebrations, we craft menus and moments your guests will talk about for years.',
   'Request a Quote', '/request-quote', 1),
  ('Weddings & Traditional Marriages', 'A feast worthy of the day you''ll never forget',
   'Signature Nigerian dishes, refined presentation and service that lets you enjoy your own celebration.',
   'See Our Packages', '/packages', 2),
  ('Corporate & Private Events', 'Impeccable food. Effortless experience.',
   'Trusted by families and organisations to deliver flawlessly, whatever the occasion or guest count.',
   'Explore Our Menu', '/menu', 3);

-- ---- Services ---------------------------------------------------------------
insert into public.services (slug, title, description, icon, sort_order) values
  ('weddings', 'Weddings', 'Elegant, unforgettable wedding catering tailored to your love story and guest list.', 'Heart', 1),
  ('traditional-marriages', 'Traditional Marriages', 'Authentic delicacies and rich presentation that honour your culture and family.', 'Crown', 2),
  ('corporate-events', 'Corporate Events', 'Professional, punctual catering for conferences, launches and company celebrations.', 'Briefcase', 3),
  ('birthday-parties', 'Birthday Parties', 'Joyful spreads and small chops that turn any birthday into a proper celebration.', 'Cake', 4),
  ('church-programs', 'Church Programs', 'Reliable large-scale catering for conventions, harvests and church anniversaries.', 'Church', 5),
  ('outdoor-catering', 'Outdoor Catering', 'Fully equipped mobile catering that delivers hot, fresh food anywhere you gather.', 'Tent', 6),
  ('graduation-ceremonies', 'Graduation Ceremonies', 'Celebrate the achievement with a feast as memorable as the milestone.', 'GraduationCap', 7),
  ('naming-ceremonies', 'Naming Ceremonies', 'Warm, family-style catering to welcome your newest blessing in style.', 'Baby', 8),
  ('funeral-receptions', 'Funeral Receptions', 'Dignified, compassionate catering that lets you focus on family and remembrance.', 'Flower2', 9),
  ('private-parties', 'Private Parties', 'Intimate dinners and house parties with a personal, chef-driven touch.', 'PartyPopper', 10),
  ('government-events', 'Government Events', 'Trusted, security-conscious catering for official functions at any scale.', 'Landmark', 11);

-- ---- Packages ---------------------------------------------------------------
insert into public.packages (slug, name, tier, tagline, description, price_from, price_unit, included_items, is_popular, sort_order) values
  ('silver', 'Silver Package', 'Silver',
   'Everything you need for a beautiful, well-fed celebration.',
   'Our essential package delivers crowd-favourite Nigerian classics with the quality and service All Seasons is known for.',
   8500, 'per guest',
   ARRAY['Jollof Rice','Fried Rice','Moi Moi','One Soup of Choice','Semo','Chicken','Coleslaw']::text[],
   false, 1),
  ('gold', 'Gold Package', 'Gold',
   'Our most-loved package — variety, abundance and elegance.',
   'A generous spread of rice dishes, soups and proteins designed to impress larger celebrations and discerning guests.',
   14500, 'per guest',
   ARRAY['Jollof Rice','Fried Rice','Coconut Rice','White Rice with Chicken in Chilli Sauce','Ukwa','Moi Moi','Two Soups of Choice','Abacha & Nkwobi','Semo','Fried Plantain','Peppered Chicken','Peppered Fish','Beef','Salad']::text[],
   true, 2),
  ('platinum', 'Platinum Package', 'Platinum (VVIP)',
   'The ultimate luxury dining experience, without compromise.',
   'An extravagant, chef-curated banquet spanning continental and traditional favourites — reserved for events that deserve the very best.',
   25000, 'per guest',
   ARRAY['Chinese Fried Rice','Jambalaya Rice','Basmati White Rice','Sauce of Choice','Coconut Rice','Noodles','Fried Plantain','Pasta','Ukwa','Moi Moi','Unripe Plantain Porridge','Soups of Choice','Semo / Oats','Goat Meat Pepper Soup','Abacha & Nkwobi','Achicha & Akidi','Ofada Rice with Ofada Sauce','Peppered Chicken','Peppered Fish','Beef','Salad']::text[],
   false, 3);

-- ---- Menu categories --------------------------------------------------------
insert into public.menu_categories (slug, name, description, sort_order) values
  ('rice', 'Rice Dishes', 'Our signature rice, cooked to smoky, flavourful perfection.', 1),
  ('soups', 'Soups', 'Rich, hearty Nigerian soups made from time-honoured recipes.', 2),
  ('proteins', 'Proteins', 'Perfectly seasoned meats, fish and poultry.', 3),
  ('small-chops', 'Small Chops', 'Irresistible bites for cocktails, weddings and parties.', 4),
  ('local-delicacies', 'Local Delicacies', 'Authentic regional specialities that delight every crowd.', 5),
  ('sides-swallow', 'Sides & Swallow', 'The perfect accompaniments to complete any plate.', 6),
  ('desserts', 'Desserts', 'Sweet finishes to round off the celebration.', 7),
  ('drinks', 'Drinks', 'Refreshing beverages, mocktails and fresh juices.', 8);

-- ---- Menu items (category linked via slug subselect) ------------------------
insert into public.menu_items (category_id, name, description, is_optional_extra, sort_order)
select c.id, v.name, v.description, v.is_optional_extra, v.sort_order
from (values
  ('rice', 'Party Jollof Rice', 'Smoky, tomato-rich jollof — the star of every Nigerian party.', false, 1),
  ('rice', 'Fried Rice', 'Colourful vegetable fried rice with liver and shrimp.', false, 2),
  ('rice', 'Coconut Rice', 'Fragrant rice simmered in fresh coconut milk.', false, 3),
  ('rice', 'Ofada Rice & Ayamase', 'Local ofada rice with spicy designer stew.', false, 4),
  ('rice', 'Chinese Fried Rice', 'Wok-tossed rice with a continental twist.', false, 5),
  ('soups', 'Egusi Soup', 'Melon-seed soup loaded with assorted meat and fish.', false, 1),
  ('soups', 'Oha Soup', 'Delicate Eastern soup with tender oha leaves.', false, 2),
  ('soups', 'Afang Soup', 'Nutritious vegetable soup, a coastal favourite.', false, 3),
  ('soups', 'Ofe Nsala (White Soup)', 'Aromatic white soup with catfish and utazi.', false, 4),
  ('soups', 'Banga Soup', 'Rich palm-fruit soup bursting with flavour.', false, 5),
  ('proteins', 'Peppered Chicken', 'Grilled chicken tossed in spicy pepper sauce.', false, 1),
  ('proteins', 'Peppered Fish', 'Whole croaker fish, spiced and grilled.', false, 2),
  ('proteins', 'Goat Meat Pepper Soup', 'Warming pepper soup with tender goat meat.', false, 3),
  ('proteins', 'Assorted Beef', 'Slow-cooked, richly seasoned beef cuts.', false, 4),
  ('proteins', 'Peppered Turkey', 'Succulent turkey in a smoky pepper glaze.', false, 5),
  ('small-chops', 'Samosa & Spring Rolls', 'Crispy, golden and perfect for cocktails.', true, 1),
  ('small-chops', 'Puff Puff', 'Fluffy, sweet Nigerian doughnut bites.', true, 2),
  ('small-chops', 'Gizdodo', 'Gizzard and plantain in savoury pepper sauce.', true, 3),
  ('small-chops', 'Asun (Spicy Goat)', 'Smoky peppered goat meat, a crowd favourite.', true, 4),
  ('small-chops', 'Chicken Wings', 'Barbecue and peppered wings, endlessly moreish.', true, 5),
  ('local-delicacies', 'Abacha & Nkwobi', 'African salad and spicy cow-foot delicacy.', false, 1),
  ('local-delicacies', 'Ukwa (Breadfruit)', 'Traditional Eastern breadfruit porridge.', false, 2),
  ('local-delicacies', 'Moi Moi', 'Steamed bean pudding with egg and fish.', false, 3),
  ('local-delicacies', 'Achicha & Akidi', 'Dried cocoyam and beans, a rare treat.', false, 4),
  ('sides-swallow', 'Semo', 'Smooth semolina swallow.', true, 1),
  ('sides-swallow', 'Pounded Yam', 'Classic, stretchy pounded yam.', true, 2),
  ('sides-swallow', 'Fried Plantain (Dodo)', 'Sweet, caramelised fried plantain.', true, 3),
  ('sides-swallow', 'Garden Salad & Coleslaw', 'Crisp, fresh and colourful.', true, 4),
  ('desserts', 'Chin Chin', 'Crunchy sweet-fried pastry bites.', true, 1),
  ('desserts', 'Celebration Cake', 'Bespoke event cakes to your design.', true, 2),
  ('desserts', 'Fresh Fruit Platter', 'Seasonal tropical fruit, beautifully arranged.', true, 3),
  ('drinks', 'Zobo & Chapman', 'Chilled hibiscus and the classic Nigerian cocktail.', true, 1),
  ('drinks', 'Fresh Juices', 'Pineapple, watermelon and orange, freshly pressed.', true, 2),
  ('drinks', 'Smoothie Bar', 'A live station of blended fruit smoothies.', true, 3)
) as v(cat_slug, name, description, is_optional_extra, sort_order)
join public.menu_categories c on c.slug = v.cat_slug;

-- ---- Gallery events ---------------------------------------------------------
insert into public.gallery_events (slug, title, event_type, location, guest_count, event_date, description, is_featured, sort_order) values
  ('royal-garden-wedding', 'Royal Garden Wedding', 'Wedding', 'Lekki, Lagos', 500, '2025-11-14', 'A breathtaking outdoor wedding with a five-station live buffet and bespoke cocktail bar.', true, 1),
  ('igbo-traditional-marriage', 'Igbo Traditional Marriage', 'Traditional Marriage', 'Owerri, Imo', 350, '2025-09-06', 'An authentic celebration featuring Abacha, Nkwobi, Ukwa and a full traditional spread.', true, 2),
  ('tech-summit-corporate', 'Annual Tech Summit', 'Corporate Event', 'Victoria Island, Lagos', 800, '2025-10-22', 'Two days of continental breakfasts, plated lunches and canapé receptions for delegates.', true, 3),
  ('golden-birthday-soiree', 'Golden 50th Birthday', 'Birthday Party', 'Ikoyi, Lagos', 220, '2025-08-30', 'An elegant black-and-gold soirée with grazing tables and a live small-chops station.', false, 4),
  ('harvest-thanksgiving', 'Harvest & Thanksgiving', 'Church Program', 'Abuja', 1200, '2025-12-07', 'Large-scale catering delivered flawlessly for a full-day church convention.', false, 5),
  ('lakeside-outdoor-feast', 'Lakeside Outdoor Feast', 'Outdoor Catering', 'Epe, Lagos', 300, '2025-07-19', 'A fully mobile setup bringing hot, fresh Nigerian cuisine to a scenic lakeside venue.', false, 6),
  ('graduation-celebration', 'Graduation Celebration', 'Graduation Ceremony', 'Nsukka, Enugu', 180, '2025-06-28', 'A joyful family feast marking a first-class honours achievement.', false, 7),
  ('naming-ceremony', 'Naming Ceremony', 'Naming Ceremony', 'Surulere, Lagos', 150, '2025-05-10', 'Warm, home-style catering to welcome a new baby with family and friends.', false, 8),
  ('private-chefs-dinner', 'Private Chef''s Dinner', 'Private Party', 'Banana Island, Lagos', 40, '2025-04-18', 'An intimate multi-course plated dinner with a dedicated chef and service team.', true, 9);

-- ---- Testimonials -----------------------------------------------------------
insert into public.testimonials (author_name, author_role, quote, rating, is_featured, sort_order) values
  ('Chioma & Emeka', 'Wedding · Lagos', 'All Seasons turned our wedding into the talk of the year. The jollof, the service, the presentation — everything was perfect. Our guests are still raving about it.', 5, true, 1),
  ('Adebayo O.', 'Corporate Event Lead', 'We hosted 800 delegates over two days and not a single detail was missed. Professional, punctual and genuinely delicious. They are now our default caterer.', 5, true, 2),
  ('Mrs. Folake A.', '50th Birthday', 'From the tasting to the last plate, I felt completely taken care of. The grazing table was a work of art and the small chops never stopped coming.', 5, true, 3),
  ('Pastor Chidi N.', 'Church Convention', 'Catering for over a thousand people is no small feat, yet they served everyone hot, fresh food on time. Truly dependable.', 5, false, 4),
  ('Ngozi & Family', 'Traditional Marriage', 'They understood our culture and delivered every traditional dish to perfection. My mother said it tasted just like home.', 5, false, 5),
  ('Tunde B.', 'Private Dinner', 'An intimate dinner for 40 that felt like fine dining. The plating, the flavours, the attentive service — worth every naira.', 5, false, 6);

-- ---- FAQs -------------------------------------------------------------------
insert into public.faqs (category, question, answer, sort_order) values
  ('Booking', 'How far in advance should I book?', 'We recommend booking at least 4–6 weeks ahead for large events, and earlier for peak wedding season. However, we do our best to accommodate shorter timelines — just reach out.', 1),
  ('Booking', 'How do I get a quote?', 'Simply click ''Request a Quote'' and complete our short guided form with your event details and menu preferences. We''ll prepare a professional quotation and send it to you by email.', 2),
  ('Menu', 'Can I customise the menu?', 'Absolutely. Every package is a starting point. You can swap dishes, add small chops, sides and premium options, and tell us about any special requests during the quote process.', 3),
  ('Menu', 'Do you cater for dietary requirements?', 'Yes. We happily prepare vegetarian, halal and allergy-conscious options. Let us know your requirements and we''ll tailor the menu accordingly.', 4),
  ('Logistics', 'What areas do you cover?', 'We are based in Lagos and cater nationwide across Nigeria. Travel and logistics for events outside Lagos are included in your custom quote.', 5),
  ('Logistics', 'Do you provide serving staff and equipment?', 'Yes. Chafing dishes, serving stations, uniformed servers and full setup can all be included. Just let us know your needs and venue.', 6),
  ('Logistics', 'What is the minimum guest count?', 'We cater intimate private dinners from as few as 20 guests, all the way up to large events of several thousand.', 7),
  ('Payment', 'How does payment work?', 'Once you accept your quotation, a deposit (typically 50%) secures your date. The balance is due before or on the event day, per your agreement. We accept bank transfer.', 8),
  ('Payment', 'Is my deposit refundable?', 'Deposits secure your date and our team''s availability. Our cancellation terms are shared with your quotation — please contact us as early as possible if plans change.', 9),
  ('Booking', 'Can I arrange a tasting?', 'Yes — for weddings and larger events we offer tastings so you can finalise your menu with confidence. Ask us when you receive your quote.', 10);
