
-- Drop the overly permissive insert policies and replace with more specific ones
DROP POLICY "Anyone can create orders" ON public.orders;
DROP POLICY "Anyone can create order items" ON public.order_items;

-- Re-create with anon role explicitly (guests can place orders)
CREATE POLICY "Guests can create orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    customer_phone IS NOT NULL AND
    customer_address IS NOT NULL AND
    customer_city IS NOT NULL
  );

CREATE POLICY "Guests can create order items" ON public.order_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    order_id IS NOT NULL AND
    product_name IS NOT NULL AND
    quantity > 0
  );
