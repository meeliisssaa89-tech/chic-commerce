

# 🐂 E-Commerce Store — Testatoro-Inspired (Arabic RTL)

A luxury men's leather accessories store (shoes, belts, wallets) with a full admin dashboard, built with Supabase backend.

---

## 🏠 Customer Storefront (Arabic, RTL)

### Homepage
- **Announcement bar** at the top (e.g., shipping offers) — admin-controlled
- **Header** with logo, hamburger menu, search icon, and cart icon with item count
- **Hero banner slider** with auto-play, pause, and navigation dots — images & text managed from admin
- **Category sections** (أحذية، أحزمة، محافظ) with animated product grids
- **Featured products** section with sale badges and discount labels
- **Bottom navigation bar** (mobile) with icons: Home, Wallets, Belts, Shoes, Cart

### Product Listing Page
- Filter by category, price range, size, color
- Sort by price, newest, popularity
- Animated product cards with hover effects (scale + shadow)
- Sale/discount badges

### Product Detail Page
- Animated image gallery with thumbnails
- Color & size selectors with visual feedback
- Price display with discount/original price
- Add to cart button with animation
- Related products section

### Cart & Checkout
- Slide-in cart drawer with smooth transitions
- Quantity adjustment, item removal
- Promo code input field
- Order summary with shipping calculation
- Checkout form (name, phone, address, city)
- Order confirmation page

### Additional Pages
- Search page with live results
- About / Contact page
- Order tracking (by order number)

---

## 🔐 Admin Dashboard (Separate Route: `/admin`)

### Authentication
- Secure admin login page with email/password
- Role-based access using Supabase auth + `user_roles` table
- Protected admin routes

### Dashboard Home
- Analytics overview: total orders, revenue, pending orders
- Recent orders list
- Quick stats cards with icons

### Product Management
- Full CRUD for products (name, description, price, discount, sizes, colors)
- Multiple image upload per product using Supabase Storage
- Category assignment
- Stock/availability toggle
- Bulk actions

### Category Management
- Create, edit, delete categories
- Category icon/image upload
- Reorder categories

### Order Management
- View all orders with status filters (pending, confirmed, shipped, delivered, cancelled)
- Order detail view with customer info and items
- Update order status
- Print order / invoice

### Content Management
- Banner slider management (upload images, set text, link, order)
- Announcement bar text editor
- Promo codes (create, set discount %, expiry, usage limits)

### Settings
- Shipping rates configuration
- Store info (name, contact, social links)
- Toggle animations on/off site-wide

---

## ✨ Animations (Framer Motion)
- Page transitions with fade + slide
- Product card hover: scale up + shadow
- Add-to-cart: fly-to-cart or pulse effect
- Button hover ripple effects
- Banner slider smooth transitions
- Staggered product grid loading animation
- Cart drawer slide-in/out
- Admin toggle to enable/disable all animations

---

## 🗄️ Backend (Supabase)

### Database Tables
- `products` — name, description, price, discount, category, sizes, colors, images, active
- `categories` — name, icon, sort order
- `orders` — customer info, items, total, status, promo code used
- `order_items` — product reference, quantity, size, color, price
- `banners` — image URL, text, link, sort order, active
- `promo_codes` — code, discount %, expiry, usage limit, active
- `site_settings` — key/value pairs for announcement text, shipping rates, animations toggle
- `user_roles` — admin role management (security definer pattern)

### Storage
- `product-images` bucket for product photos
- `banner-images` bucket for slider banners
- `category-images` bucket for category icons

### Security
- RLS policies on all tables
- Admin-only write access via `has_role()` function
- Public read access for products, categories, banners
- Orders readable only by admin

---

## 📱 Responsive Design
- Mobile-first approach matching Testatoro's mobile layout
- Bottom navigation bar on mobile
- Collapsible sidebar on admin (mobile-friendly)
- Touch-friendly product cards and controls

