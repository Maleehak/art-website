// Supabase client setup
// Uncomment and configure when Supabase project is created

// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
//
// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// Database schema for reference:
//
// CREATE TABLE orders (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   stripe_session_id TEXT UNIQUE,
//   customer_email TEXT NOT NULL,
//   customer_name TEXT NOT NULL,
//   shipping_address JSONB NOT NULL,
//   total_amount INTEGER NOT NULL,
//   currency TEXT DEFAULT 'usd',
//   payment_method TEXT NOT NULL,
//   payment_status TEXT DEFAULT 'pending',
//   order_status TEXT DEFAULT 'pending',
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE order_items (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
//   artwork_id TEXT NOT NULL,
//   artwork_title TEXT NOT NULL,
//   price INTEGER NOT NULL,
//   quantity INTEGER DEFAULT 1,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE reviews (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   artwork_id TEXT NOT NULL,
//   customer_name TEXT NOT NULL,
//   customer_email TEXT NOT NULL,
//   rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//   comment TEXT,
//   approved BOOLEAN DEFAULT false,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- Row Level Security
// ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
// ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
// ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Service role can manage orders"
//   ON orders FOR ALL USING (auth.role() = 'service_role');
//
// CREATE POLICY "Anyone can create reviews"
//   ON reviews FOR INSERT WITH CHECK (true);
//
// CREATE POLICY "Approved reviews are public"
//   ON reviews FOR SELECT USING (approved = true);

export {};
