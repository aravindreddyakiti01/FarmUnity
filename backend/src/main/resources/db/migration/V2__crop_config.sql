-- FarmUnity Crop Configuration Seed Data V2

INSERT INTO crop_configs (crop_name, variety, moisture_min, moisture_max, expected_yield_ratio, max_distance_km, harvest_window_days)
VALUES
    ('paddy', 'Sona Masoori', 12.00, 14.00, 0.6500, 100.00, 30),
    ('wheat', 'Sharbati', 12.00, 14.00, 0.7200, 150.00, 30),
    ('pulses', 'Toor Dal', 10.00, 12.00, 0.9000, 100.00, 45),
    ('oilseeds', 'Mustard', 8.00, 10.00, 0.9500, 120.00, 45);

