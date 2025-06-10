
-- Insert a new category "Utstyr" if it doesn't exist
INSERT INTO kategorier (navn, beskrivelse) 
VALUES ('Utstyr', 'Laboratorieutstyr og instrumenter')
ON CONFLICT DO NOTHING;

-- Insert a microscope as laboratory equipment
INSERT INTO varer (
  navn, 
  kategori, 
  beskrivelse, 
  beholdning, 
  min_niva, 
  enhet, 
  pris, 
  leverandor
) VALUES (
  'Optisk mikroskop 1000x',
  'Utstyr',
  'Høykvalitets optisk mikroskop med 1000x forstørrelse for celleanalyse',
  3,
  1,
  'stk',
  15000.00,
  'LabTech AS'
);

-- Insert activity log for the new item
INSERT INTO aktivitet_logg (
  type,
  item_navn,
  beskrivelse,
  timestamp
) VALUES (
  'item_added',
  'Optisk mikroskop 1000x',
  'Ny vare "Optisk mikroskop 1000x" ble lagt til i lageret',
  now()
);
