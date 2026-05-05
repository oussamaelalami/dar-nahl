-- ============================================================
--  Missing GRANTs – run this in Supabase SQL Editor
--  Project Settings → SQL Editor → New query → paste & run
-- ============================================================

-- Allow authenticated (admin) users to fully manage orders
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;

-- Allow authenticated (admin) users to fully manage products
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- Allow orders sequence to be used (needed for order_number SERIAL)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
