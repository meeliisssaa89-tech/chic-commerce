
-- Add unique constraint on site_settings.key for upsert
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_key_unique UNIQUE (key);

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('announcement_text', 'شحن مجاني للطلبات فوق 200 ريال 🚚'),
  ('shipping_cost', '25'),
  ('free_shipping_threshold', '200'),
  ('whatsapp_number', '966500000000'),
  ('store_name', 'TESTATORO'),
  ('store_email', 'info@testatoro.com'),
  ('store_phone', '+966 50 000 0000')
ON CONFLICT (key) DO NOTHING;
