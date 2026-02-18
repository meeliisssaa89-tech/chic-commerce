
-- Add payment_method and transfer_number columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cash_on_delivery',
ADD COLUMN IF NOT EXISTS transfer_number text DEFAULT NULL;

-- Add requires_transfer column to payment_methods table  
ALTER TABLE public.payment_methods
ADD COLUMN IF NOT EXISTS requires_transfer boolean DEFAULT false;
