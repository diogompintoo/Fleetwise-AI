-- Only runs if tables are empty
INSERT INTO companies (name, tax_number, created_at)
SELECT 'FleetWise Demo Ltd', 'PT500123456', NOW()
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE tax_number = 'PT500123456');

INSERT INTO vehicles (license_plate, brand, model, manufacturerYear, fuel_type, initial_mileage, active, company_id)
SELECT 'AA-00-FW', 'Mercedes-Benz', 'Sprinter 314', 2022, 'DIESEL', 15000, true, 1
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE license_plate = 'AA-00-FW');

INSERT INTO vehicles (license_plate, brand, model, manufacturerYear, fuel_type, initial_mileage, active, company_id)
SELECT 'BB-11-FW', 'Volkswagen', 'Crafter 35', 2021, 'DIESEL', 28000, true, 1
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE license_plate = 'BB-11-FW');

INSERT INTO vehicles (license_plate, brand, model, manufacturerYear, fuel_type, initial_mileage, active, company_id)
SELECT 'CC-22-FW', 'Ford', 'Transit Custom', 2023, 'DIESEL', 8000, true, 1
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE license_plate = 'CC-22-FW');