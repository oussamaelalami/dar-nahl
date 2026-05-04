-- ============================================================
--  Dar Nahl – Moroccan Honey Store  |  Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr        TEXT        NOT NULL,
  name_ar        TEXT        NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  price          NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image_url      TEXT,
  category       TEXT        NOT NULL DEFAULT 'wildflower',
  weight         TEXT,
  origin         TEXT,
  stock          INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active         BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number   SERIAL      NOT NULL,
  customer_name  TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  city           TEXT        NOT NULL,
  address        TEXT,
  items          JSONB       NOT NULL DEFAULT '[]',
  subtotal       NUMERIC(10, 2) NOT NULL,
  total          NUMERIC(10, 2) NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders   ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read active products; only authenticated can write
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (active = true);

CREATE POLICY "Admin can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (true);

-- Orders: anyone can create; only authenticated can read/update/delete
CREATE POLICY "Public can create orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (true);

-- ─── Seed Data ────────────────────────────────────────────────
INSERT INTO public.products (name_fr, name_ar, description_fr, description_ar, price, category, weight, origin, stock, active)
VALUES
  (
    'Miel de Thym',
    'عسل الزعتر',
    'Un miel rare et aromatique, récolté dans les champs de thym sauvage du Rif. Notes florales et herbacées.',
    'عسل نادر وعطري، يُجمع من حقول الزعتر البري في الريف. له نكهة زهرية وعشبية.',
    120, 'thyme', '500g – 1kg', 'Rif, Maroc', 50, true
  ),
  (
    'Miel de Sidr',
    'عسل السدر',
    'Le roi des miels marocains. Récolté une seule fois par an dans les forêts de jujubier du Souss.',
    'ملك الأعسال المغربية. يُجمع مرة واحدة في السنة من غابات السدر بسوس.',
    250, 'sidr', '250g – 500g', 'Souss-Massa, Maroc', 20, true
  ),
  (
    'Miel de Montagne',
    'عسل الجبل',
    'Récolté à plus de 2000m dans le Haut Atlas. Riche en polyphénols, idéal pour renforcer l''immunité.',
    'يُجمع على ارتفاع يزيد عن 2000 متر في الأطلس الكبير. غني بالبوليفينول.',
    150, 'mountain', '500g – 1kg – 2kg', 'Haut Atlas, Maroc', 60, true
  ),
  (
    'Miel de Fleurs Sauvages',
    'عسل الأزهار البرية',
    'Un bouquet de saveurs issu de la biodiversité marocaine. Multifloral, léger et parfumé.',
    'باقة من النكهات مستوحاة من التنوع البيولوجي المغربي. خفيف وعطري.',
    90, 'wildflower', '500g – 1kg', 'Moyen Atlas, Maroc', 80, true
  ),
  (
    'Miel d''Argan',
    'عسل الأركان',
    'Une rareté absolue. Les abeilles butinent les fleurs d''arganier endémique du Maroc.',
    'ندرة مطلقة. النحل يتغذى على أزهار الأركان، وهي شجرة مستوطنة في المغرب.',
    300, 'argan', '250g – 500g', 'Sous-Massa, Maroc', 15, true
  ),
  (
    'Miel d''Euphorbe',
    'عسل الدافلة',
    'Extrait des fleurs d''euphorbe du désert marocain. Réputé pour ses propriétés respiratoires.',
    'مستخرج من أزهار الدافلة في الصحراء المغربية. مشهور بخصائصه للجهاز التنفسي.',
    200, 'euphorbe', '500g', 'Sahara, Maroc', 25, true
  )
ON CONFLICT DO NOTHING;
