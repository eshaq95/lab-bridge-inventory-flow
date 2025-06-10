
-- First, let's drop the existing check constraint that's causing the issue
ALTER TABLE public.aktivitet_logg DROP CONSTRAINT IF EXISTS aktivitet_logg_type_check;

-- Now add a new check constraint that allows the values our system uses
ALTER TABLE public.aktivitet_logg ADD CONSTRAINT aktivitet_logg_type_check 
CHECK (type IN ('stock_in', 'stock_out', 'item_added', 'item_deleted', 'item_updated'));
