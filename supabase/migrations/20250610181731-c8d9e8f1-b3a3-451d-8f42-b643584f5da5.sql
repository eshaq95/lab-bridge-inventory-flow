
-- Fix the format string in the fn_register_tx function
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

  -- Log activity - Fixed format string to use %s for integers instead of %d
  INSERT INTO public.aktivitet_logg(type, item_navn, beskrivelse, timestamp)
  VALUES (
    CASE WHEN p_qty > 0 THEN 'stock_in' ELSE 'stock_out' END,
    v_navn,
    format('Strekkode %s: %s %s enheter via skanning', p_strekkode, CASE WHEN p_qty > 0 THEN 'Inn' ELSE 'Ut' END, abs(p_qty)),
    now()
  );
END;
$$;
