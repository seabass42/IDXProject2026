# IDX Exchange — Property Search Application

A full-stack Zillow/Redfin-style property search application built with React, Node.js, Express, and MySQL. Features real California MLS data with 53,000+ listings, an open house calendar, interactive photo galleries, and Google Maps integration.

![Property Listings](screenshot.png)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19.x |
| Routing | React Router DOM | 7.x |
| Calendar | react-big-calendar | 1.x |
| Backend | Node.js + Express | 18.x |
| Database | MySQL 8 | 8.x |
| Container | Docker | latest |
| Testing (Frontend) | Jest + React Testing Library | built-in |
| Testing (Backend) | Jest + Supertest | 29.x |

---

## Local Setup

Follow these steps exactly from a fresh machine.

### Prerequisites

- Node.js (LTS version)
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/IDXProject2026.git
cd IDXProject2026
```

### 2. Start MySQL in Docker

```bash
docker run --name idx-mysql-local \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=rets \
  -p 3306:3306 \
  -d mysql:8
```

### 3. Import the database

```bash
docker exec -i idx-mysql-local mysql -u root -prootpassword rets < rets_property.sql
docker exec -i idx-mysql-local mysql -u root -prootpassword rets < rets_openhouse.sql
```

### 4. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=rets
```

Start the backend:

```bash
npm run dev
```

### 5. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Start the frontend:

```bash
PORT=3001 npm start
```

### 6. Open the app

Visit `http://localhost:3001` in your browser.

---

## API Endpoint Reference

### GET /api/health

Checks database connectivity.

**Response:**
```json
{ "status": "ok", "database": "connected" }
```

---

### GET /api/properties

Returns paginated, filterable property listings.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| city | string | Filter by city name |
| zipcode | string | Filter by ZIP code |
| minPrice | number | Minimum listing price |
| maxPrice | number | Maximum listing price |
| beds | number | Minimum number of bedrooms |
| baths | number | Minimum number of bathrooms |
| limit | number | Results per page (1-100, default 20) |
| offset | number | Number of results to skip (default 0) |

**Example Request:**
```
GET /api/properties?city=Anaheim&minPrice=300000&beds=3&limit=20&offset=0
```

**Example Response:**
```json
{
  "total": 152,
  "limit": 20,
  "offset": 0,
  "results": [
    {
      "id": 1,
      "L_ListingID": "1115119412",
      "L_Address": "1810 W Bushell Street",
      "L_City": "Anaheim",
      "L_State": "CA",
      "L_SystemPrice": 995000,
      "L_Keyword2": 3,
      "LM_Dec_3": 3.5
    }
  ]
}
```

---

### GET /api/properties/:id

Returns a single property by listing ID.

**Example Request:**
```
GET /api/properties/1115119412
```

**Responses:**
- `200` — full property object
- `400` — malformed or oversized ID
- `404` — property not found

---

### GET /api/properties/:id/openhouses

Returns open house events for a specific property, ordered by date and start time.

**Example Request:**
```
GET /api/properties/1115119412/openhouses
```

**Example Response:**
```json
[
  {
    "id": 1,
    "L_ListingID": "1115119412",
    "OpenHouseDate": "2026-08-15",
    "OH_StartTime": "13:00:00",
    "OH_EndTime": "16:00:00",
    "all_data": "{\"OpenHouseRemarks\": \"Come see this beautiful home!\"}"
  }
]
```

**Responses:**
- `200` — array of open houses (empty array if none scheduled)
- `400` — malformed or oversized ID
- `404` — property not found

---

### GET /api/properties/openhouses

Returns all open houses within a date range that have matching properties.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| startDate | string | Start date (YYYY-MM-DD) |
| endDate | string | End date (YYYY-MM-DD) |

**Example Request:**
```
GET /api/properties/openhouses?startDate=2026-08-01&endDate=2026-08-31
```

**Example Response:**
```json
[
  {
    "id": 1,
    "L_ListingID": "1152488184",
    "OpenHouseDate": "2026-08-24",
    "OH_StartTime": "11:00:00",
    "OH_EndTime": "14:00:00"
  }
]
```

---

## Database Schema

### rets_property

Primary table containing MLS property listings.

| Column | Type | Description |
|---|---|---|
| id | int | Auto-increment primary key |
| L_ListingID | varchar(255) | MLS listing ID (used as public identifier) |
| L_Address | varchar(100) | Street address |
| L_City | varchar(50) | City |
| L_State | varchar(50) | State |
| L_Zip | varchar(20) | ZIP code |
| L_SystemPrice | int | Listing price |
| L_Keyword2 | int | Number of bedrooms |
| LM_Dec_3 | decimal(4,1) | Number of bathrooms |
| LM_Int2_3 | int | Square footage |
| L_Photos | longtext | JSON array of photo URLs |
| LMD_MP_Latitude | decimal(18,15) | Latitude coordinate |
| LMD_MP_Longitude | decimal(19,15) | Longitude coordinate |
| L_Remarks | mediumtext | Property description |
| YearBuilt | int | Year the property was built |
| LotSizeAcres | decimal(10,4) | Lot size in acres |

### rets_openhouse

Open house events linked to properties.

| Column | Type | Description |
|---|---|---|
| id | int | Auto-increment primary key |
| L_ListingID | varchar(255) | Foreign key to rets_property |
| OpenHouseDate | date | Date of the open house |
| OH_StartTime | time | Start time |
| OH_EndTime | time | End time |
| all_data | longtext | JSON blob containing OpenHouseRemarks and other fields |

**Relationship:** `rets_openhouse.L_ListingID` → `rets_property.L_ListingID`

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test -- --coverage --watchAll=false
```

**Coverage targets (critical files):**

| File | Coverage |
|---|---|
| client.js | 88%+ |
| PropertyFilters.js | 100% |
| PropertyCard.js | 92%+ |

---

## Known Issues

- **Expired photo URLs** — Some `L_Photos` URLs in the dataset have expired or require authentication tokens that are no longer valid. Fresh SQL files should be requested before any live demo per the project guidelines.
- **Missing lat/lon** — Some properties have null or zero coordinates. The map component handles this gracefully by showing a fallback message instead of rendering a broken iframe.
- **Inconsistent city casing** — City names in the database use inconsistent casing (e.g. "portland", "Portland", "PORTLAND"). The API normalizes this with `LOWER(TRIM())` on both sides of city filter comparisons.
- **Open house data mismatch** — Not all listing IDs in `rets_openhouse` have a corresponding entry in `rets_property`. The calendar endpoint uses an INNER JOIN to only show events with matching properties.

---

## Future Improvements

- Deploy frontend to Vercel and backend to Railway with a cloud MySQL instance
- Add natural language search using the Anthropic Claude API
- Implement saved favorites with localStorage persistence
- Add sorting controls for price, date listed, and square footage
- Add property comparison feature
- Implement server-side caching for frequently filtered queries
