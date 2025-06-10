
-- Update existing items in varer table to populate their strekkode values
-- This will only update rows that don't already have a strekkode
UPDATE public.varer 
SET strekkode = 'LAB-' || lpad(id::text, 5, '0')
WHERE strekkode IS NULL;
