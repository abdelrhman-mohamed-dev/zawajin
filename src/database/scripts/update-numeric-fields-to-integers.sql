-- Script to update all numeric fields to remove decimal places
-- This script rounds all numeric values to integers in the database

-- ===== INTEGER FIELDS =====
-- These are already integers but we ensure they are rounded in case of any decimal data

-- Update age field
UPDATE users
SET age = ROUND(age::numeric, 0)
WHERE age IS NOT NULL;

-- Update number of children field
UPDATE users
SET number_of_children = ROUND(number_of_children::numeric, 0)
WHERE number_of_children IS NOT NULL;

-- Update preferred age fields
UPDATE users
SET preferred_age_from = ROUND(preferred_age_from::numeric, 0)
WHERE preferred_age_from IS NOT NULL;

UPDATE users
SET preferred_age_to = ROUND(preferred_age_to::numeric, 0)
WHERE preferred_age_to IS NOT NULL;

-- ===== DECIMAL FIELDS =====
-- These need to be rounded from decimal to integer

-- Update weight fields (round to nearest integer)
UPDATE users
SET weight = ROUND(weight::numeric, 0)
WHERE weight IS NOT NULL;

-- Update height fields (round to nearest integer)
UPDATE users
SET height = ROUND(height::numeric, 0)
WHERE height IS NOT NULL;

-- Update preferred weight fields
UPDATE users
SET preferred_min_weight = ROUND(preferred_min_weight::numeric, 0)
WHERE preferred_min_weight IS NOT NULL;

UPDATE users
SET preferred_max_weight = ROUND(preferred_max_weight::numeric, 0)
WHERE preferred_max_weight IS NOT NULL;

-- Update preferred height fields
UPDATE users
SET preferred_min_height = ROUND(preferred_min_height::numeric, 0)
WHERE preferred_min_height IS NOT NULL;

UPDATE users
SET preferred_max_height = ROUND(preferred_max_height::numeric, 0)
WHERE preferred_max_height IS NOT NULL;

-- ===== VERIFY THE UPDATES =====
SELECT
    COUNT(*) as total_users,
    COUNT(age) as users_with_age,
    COUNT(number_of_children) as users_with_children_count,
    COUNT(weight) as users_with_weight,
    COUNT(height) as users_with_height,
    COUNT(preferred_age_from) as users_with_preferred_age_from,
    COUNT(preferred_age_to) as users_with_preferred_age_to,
    MIN(weight) as min_weight,
    MAX(weight) as max_weight,
    MIN(height) as min_height,
    MAX(height) as max_height,
    MIN(age) as min_age,
    MAX(age) as max_age
FROM users;
