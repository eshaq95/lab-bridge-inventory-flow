
-- 1) Add barcode field to varer table (skip if already exists)
ALTER TABLE public.varer ADD COLUMN IF NOT EXISTS strekkode text UNIQUE;

-- 2) Create function to auto-generate barcodes like LAB-00023, LAB-00024...
CREATE OR REPLACE FUNCTION fn_auto_strekkode()
RETURNS trigger AS $$
BEGIN
  IF NEW.strekkode IS NULL THEN
    NEW.strekkode := 'LAB-' || lpad(NEW.id::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS trg_auto_strekkode ON public.varer;
CREATE TRIGGER trg_auto_strekkode
  BEFORE INSERT ON public.varer
  FOR EACH ROW EXECUTE PROCEDURE fn_auto_strekkode();

-- 3) Create RPC function for registering transactions via barcode
CREATE OR REPLACE FUNCTION fn_register_tx(
  p_strekkode text,
  p_qty int,
  p_comment text DEFAULT ''
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_id int;
  v_navn text;
BEGIN
  SELECT id, navn INTO v_id, v_navn FROM public.varer WHERE strekkode = p_strekkode;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vare med kode % finnes ikke', p_strekkode;
  END IF;

  -- Update stock level
  UPDATE public.varer
    SET beholdning = beholdning + p_qty,
        sist_endret = now()
  WHERE id = v_id;

  -- Insert transaction record
  INSERT INTO public.transaksjoner(vare_id, type, antall, kommentar, timestamp)
  VALUES (v_id, CASE WHEN p_qty > 0 THEN 'inn' ELSE 'ut' END, abs(p_qty), p_comment, now());

  -- Log activity
  INSERT INTO public.aktivitet_logg(type, item_navn, beskrivelse, timestamp)
  VALUES (
    CASE WHEN p_qty > 0 THEN 'stock_in' ELSE 'stock_out' END,
    v_navn,
    format('Strekkode %s: %s %d enheter via skanning', p_strekkode, CASE WHEN p_qty > 0 THEN 'Inn' ELSE 'Ut' END, abs(p_qty)),
    now()
  );
END;
$$;
