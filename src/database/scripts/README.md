# Database Update Scripts

This directory contains database maintenance and update scripts.

## Update All Numeric Fields to Integers

### Purpose
This script updates all numeric fields in the database to remove decimal places (.00) and convert them to integers.

### Files
- `update-numeric-fields-to-integers.sql` - Raw SQL statements
- `run-weight-height-update.ts` - TypeScript runner script

### What It Does
The script updates the following numeric fields in the `users` table:

**Integer Fields:**
- `age` - User's age
- `number_of_children` - Number of children
- `preferred_age_from` - Minimum preferred age
- `preferred_age_to` - Maximum preferred age

**Decimal Fields (converted to integers):**
- `weight` - User's weight
- `height` - User's height
- `preferred_min_weight` - Minimum preferred weight
- `preferred_max_weight` - Maximum preferred weight
- `preferred_min_height` - Minimum preferred height
- `preferred_max_height` - Maximum preferred height

All decimal values (e.g., `56.00`, `140.00`, `25.00`) are rounded to the nearest integer (e.g., `56`, `140`, `25`).

### How to Run

#### Option 1: Using npm script (Recommended)
```bash
npm run update:weight-height
```

#### Option 2: Directly with ts-node
```bash
ts-node -r tsconfig-paths/register src/database/scripts/run-weight-height-update.ts
```

#### Option 3: Using psql (Manual)
```bash
psql -U your_username -d zawajin -f src/database/scripts/update-numeric-fields-to-integers.sql
```

### Prerequisites
- Database connection details in `.env` file
- Database must be running and accessible

### Output
The script will:
1. Connect to the database
2. Update all weight/height fields
3. Show the number of rows affected
4. Display verification statistics

### Safety
- The script uses `ROUND()` function to safely convert decimals to integers
- Only affects non-null values
- Includes verification query at the end

### After Running
After running this script, all API responses will return numeric values as integers:
```json
{
  "age": 25,
  "weight": 56,
  "height": 140,
  "numberOfChildren": 2,
  "preferredAgeFrom": 23,
  "preferredAgeTo": 30,
  "preferredMinWeight": 50,
  "preferredMaxWeight": 70,
  "preferredMinHeight": 150,
  "preferredMaxHeight": 170
}
```

Instead of:
```json
{
  "age": "25.00",
  "weight": "56.00",
  "height": "140.00",
  "numberOfChildren": "2.00",
  "preferredAgeFrom": "23.00",
  "preferredAgeTo": "30.00",
  "preferredMinWeight": "50.00",
  "preferredMaxWeight": "70.00",
  "preferredMinHeight": "150.00",
  "preferredMaxHeight": "170.00"
}
```
