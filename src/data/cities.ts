import { City } from "@/types";

/**
 * City dataset for Offer Lab, checked 2026-11-15.
 *
 * rent: median asking rent for a 1-bedroom listing.
 * - rentSource "report": Zumper National Rent Report, October 2026 (published
 *   2026-10-27), https://www.zumper.com/blog/rental-price-data/
 * - rentSource "cityPage": the city is not in that report, so Zumper's city
 *   page, average 1-bedroom rent over the 30 days to 2026-11-15,
 *   https://www.zumper.com/rent-research/<city-state>
 * These are listings for the city itself, which run above what existing
 * tenants pay, and they do not include utilities.
 *
 * mit: MIT Living Wage Calculator (data updated 2026-02-15), one adult, no
 * children, the county page for the city (https://livingwage.mit.edu/counties/
 * <FIPS>), annual dollars in this order: food, medical (premiums and
 * out-of-pocket), transportation, internet and mobile, other (clothing,
 * personal care, household supplies). Housing, child care and "civic" are left
 * out: rent is its own line, and civic spending is discretionary.
 *
 * State and local income taxes: see src/data/taxes.ts.
 */
export type CityRecord = City;

export const CITIES: CityRecord[] = [
  { id: "san-francisco-ca", name: "San Francisco", state: "CA", rent: 4430, rentSource: "report", county: "San Francisco County, California", mit: [5807, 3828, 6691, 1971, 4992] },
  { id: "new-york-ny", name: "New York City", state: "NY", rent: 4610, rentSource: "report", county: "New York County, New York", mit: [7116, 4695, 4710, 1627, 4715] },
  { id: "boston-ma", name: "Boston", state: "MA", rent: 2980, rentSource: "report", county: "Suffolk County, Massachusetts", mit: [5141, 4257, 5991, 2359, 4715] },
  { id: "san-jose-ca", name: "San Jose", state: "CA", rent: 2890, rentSource: "report", county: "Santa Clara County, California", mit: [5036, 3651, 10808, 1882, 4992] },
  { id: "oakland-ca", name: "Oakland", state: "CA", rent: 2120, rentSource: "report", county: "Alameda County, California", mit: [5083, 3752, 9043, 1924, 4992] },
  { id: "los-angeles-ca", name: "Los Angeles", state: "CA", rent: 2300, rentSource: "report", county: "Los Angeles County, California", mit: [4463, 3255, 8681, 1517, 4992] },
  { id: "san-diego-ca", name: "San Diego", state: "CA", rent: 2210, rentSource: "report", county: "San Diego County, California", mit: [4487, 3243, 9308, 1536, 4992] },
  { id: "seattle-wa", name: "Seattle", state: "WA", rent: 1900, rentSource: "report", county: "King County, Washington", mit: [5234, 3032, 8441, 2397, 4992] },
  { id: "washington-dc", name: "Washington, D.C.", state: "DC", rent: 2240, rentSource: "report", county: "District of Columbia, District of Columbia", mit: [5503, 3682, 4729, 2224, 4067] },
  { id: "honolulu-hi", name: "Honolulu", state: "HI", rent: 2380, rentSource: "report", county: "Honolulu County, Hawaii", mit: [5211, 2367, 10091, 1376, 4992] },
  { id: "chicago-il", name: "Chicago", state: "IL", rent: 2180, rentSource: "report", county: "Cook County, Illinois", mit: [4720, 3594, 7211, 1820, 4549] },
  { id: "miami-fl", name: "Miami", state: "FL", rent: 2490, rentSource: "report", county: "Miami-Dade County, Florida", mit: [4802, 2801, 7395, 2115, 4067] },
  { id: "denver-co", name: "Denver", state: "CO", rent: 1510, rentSource: "report", county: "Denver County, Colorado", mit: [4779, 3199, 7116, 2281, 4992] },
  { id: "portland-or", name: "Portland", state: "OR", rent: 1390, rentSource: "report", county: "Multnomah County, Oregon", mit: [5234, 2695, 7783, 2463, 4992] },
  { id: "philadelphia-pa", name: "Philadelphia", state: "PA", rent: 1450, rentSource: "report", county: "Philadelphia County, Pennsylvania", mit: [4627, 4053, 5831, 2168, 4715] },
  { id: "atlanta-ga", name: "Atlanta", state: "GA", rent: 1630, rentSource: "report", county: "Fulton County, Georgia", mit: [5176, 3098, 8253, 1854, 4067] },
  { id: "minneapolis-mn", name: "Minneapolis", state: "MN", rent: 1300, rentSource: "report", county: "Hennepin County, Minnesota", mit: [5188, 3443, 7954, 1793, 4549] },
  { id: "austin-tx", name: "Austin", state: "TX", rent: 1510, rentSource: "report", county: "Travis County, Texas", mit: [4159, 3075, 8465, 1479, 4067] },
  { id: "nashville-tn", name: "Nashville", state: "TN", rent: 1470, rentSource: "report", county: "Davidson County, Tennessee", mit: [4814, 3236, 8507, 1939, 4067] },
  { id: "raleigh-nc", name: "Raleigh", state: "NC", rent: 1260, rentSource: "report", county: "Wake County, North Carolina", mit: [4744, 3354, 8986, 1650, 4067] },
  { id: "charlotte-nc", name: "Charlotte", state: "NC", rent: 1400, rentSource: "report", county: "Mecklenburg County, North Carolina", mit: [4779, 3476, 8027, 1461, 4067] },
  { id: "baltimore-md", name: "Baltimore", state: "MD", rent: 1220, rentSource: "report", county: "Baltimore city, Maryland", mit: [5001, 3536, 6473, 1515, 4067] },
  { id: "providence-ri", name: "Providence", state: "RI", rent: 1850, rentSource: "report", county: "Providence County, Rhode Island", mit: [4732, 4011, 7786, 1543, 4715] },
  { id: "sacramento-ca", name: "Sacramento", state: "CA", rent: 1490, rentSource: "report", county: "Sacramento County, California", mit: [4428, 3846, 9065, 1477, 4992] },
  { id: "long-beach-ca", name: "Long Beach", state: "CA", rent: 1800, rentSource: "report", county: "Los Angeles County, California", mit: [4463, 3255, 8681, 1517, 4992] },
  { id: "anaheim-ca", name: "Anaheim", state: "CA", rent: 2000, rentSource: "report", county: "Orange County, California", mit: [4627, 3241, 9204, 1501, 4992] },
  { id: "dallas-tx", name: "Dallas", state: "TX", rent: 1470, rentSource: "report", county: "Dallas County, Texas", mit: [4019, 3032, 8440, 1454, 4067] },
  { id: "houston-tx", name: "Houston", state: "TX", rent: 1210, rentSource: "report", county: "Harris County, Texas", mit: [3856, 3271, 8454, 1659, 4067] },
  { id: "phoenix-az", name: "Phoenix", state: "AZ", rent: 1210, rentSource: "report", county: "Maricopa County, Arizona", mit: [4183, 3005, 8503, 1809, 4992] },
  { id: "tampa-fl", name: "Tampa", state: "FL", rent: 1500, rentSource: "report", county: "Hillsborough County, Florida", mit: [4533, 2994, 7966, 1562, 4067] },
  { id: "orlando-fl", name: "Orlando", state: "FL", rent: 1430, rentSource: "report", county: "Orange County, Florida", mit: [4557, 2977, 8515, 1630, 4067] },
  { id: "las-vegas-nv", name: "Las Vegas", state: "NV", rent: 1140, rentSource: "report", county: "Clark County, Nevada", mit: [4241, 2715, 9103, 1806, 4992] },
  { id: "salt-lake-city-ut", name: "Salt Lake City", state: "UT", rent: 1180, rentSource: "report", county: "Salt Lake County, Utah", mit: [4323, 2924, 9177, 1566, 4992] },
  { id: "richmond-va", name: "Richmond", state: "VA", rent: 1390, rentSource: "report", county: "Richmond city, Virginia", mit: [5083, 3476, 6909, 1586, 4067] },
  { id: "columbus-oh", name: "Columbus", state: "OH", rent: 1170, rentSource: "report", county: "Franklin County, Ohio", mit: [4358, 3658, 7912, 1497, 4549] },
  { id: "indianapolis-in", name: "Indianapolis", state: "IN", rent: 1050, rentSource: "report", county: "Marion County, Indiana", mit: [3949, 3484, 8576, 1443, 4549] },
  { id: "milwaukee-wi", name: "Milwaukee", state: "WI", rent: 1080, rentSource: "report", county: "Milwaukee County, Wisconsin", mit: [4393, 3760, 7295, 1530, 4549] },
  { id: "kansas-city-mo", name: "Kansas City", state: "MO", rent: 1150, rentSource: "report", county: "Jackson County, Missouri", mit: [4440, 3496, 8501, 1474, 4549] },
  { id: "pittsburgh-pa", name: "Pittsburgh", state: "PA", rent: 1360, rentSource: "report", county: "Allegheny County, Pennsylvania", mit: [4767, 3691, 7637, 1868, 4715] },
  { id: "jacksonville-fl", name: "Jacksonville", state: "FL", rent: 1100, rentSource: "report", county: "Duval County, Florida", mit: [4370, 3136, 8376, 1673, 4067] },
  { id: "new-orleans-la", name: "New Orleans", state: "LA", rent: 1410, rentSource: "report", county: "Orleans Parish, Louisiana", mit: [4674, 3218, 7508, 1615, 4067] },
  { id: "ann-arbor-mi", name: "Ann Arbor", state: "MI", rent: 1550, rentSource: "cityPage", county: "Washtenaw County, Michigan", mit: [4639, 3716, 8683, 1518, 4549] },
  { id: "madison-wi", name: "Madison", state: "WI", rent: 1510, rentSource: "report", county: "Dane County, Wisconsin", mit: [4697, 3785, 8684, 1460, 4549] },
  { id: "cleveland-oh", name: "Cleveland", state: "OH", rent: 1190, rentSource: "report", county: "Cuyahoga County, Ohio", mit: [4849, 3635, 7728, 1449, 4549] },
  { id: "cincinnati-oh", name: "Cincinnati", state: "OH", rent: 1050, rentSource: "report", county: "Hamilton County, Ohio", mit: [4300, 3392, 8266, 1301, 4549] },
  { id: "detroit-mi", name: "Detroit", state: "MI", rent: 920, rentSource: "report", county: "Wayne County, Michigan", mit: [4183, 3352, 8230, 1778, 4549] },
  { id: "memphis-tn", name: "Memphis", state: "TN", rent: 910, rentSource: "report", county: "Shelby County, Tennessee", mit: [4452, 3068, 8534, 1603, 4067] },
  { id: "louisville-ky", name: "Louisville", state: "KY", rent: 1070, rentSource: "report", county: "Jefferson County, Kentucky", mit: [4300, 3119, 8721, 1572, 4067] },
  { id: "oklahoma-city-ok", name: "Oklahoma City", state: "OK", rent: 890, rentSource: "report", county: "Oklahoma County, Oklahoma", mit: [4265, 3668, 8940, 1393, 4067] },
  { id: "st-louis-mo", name: "St. Louis", state: "MO", rent: 990, rentSource: "report", county: "St. Louis city, Missouri", mit: [4954, 3343, 7088, 1433, 4549] },
  { id: "birmingham-al", name: "Birmingham", state: "AL", rent: 1080, rentSource: "cityPage", county: "Jefferson County, Alabama", mit: [4580, 3608, 9059, 1592, 4067] },
  { id: "tulsa-ok", name: "Tulsa", state: "OK", rent: 930, rentSource: "report", county: "Tulsa County, Oklahoma", mit: [4323, 3567, 9019, 1443, 4067] },
  { id: "albuquerque-nm", name: "Albuquerque", state: "NM", rent: 1010, rentSource: "report", county: "Bernalillo County, New Mexico", mit: [4159, 3020, 8125, 2126, 4992] },
  { id: "tucson-az", name: "Tucson", state: "AZ", rent: 860, rentSource: "report", county: "Pima County, Arizona", mit: [4101, 2715, 8158, 1864, 4992] },
  { id: "des-moines-ia", name: "Des Moines", state: "IA", rent: 820, rentSource: "report", county: "Polk County, Iowa", mit: [4428, 3494, 8829, 1570, 4549] },
  { id: "omaha-ne", name: "Omaha", state: "NE", rent: 1010, rentSource: "report", county: "Douglas County, Nebraska", mit: [4428, 3278, 8723, 1632, 4549] },
  { id: "lincoln-ne", name: "Lincoln", state: "NE", rent: 840, rentSource: "report", county: "Lancaster County, Nebraska", mit: [4370, 3298, 8555, 1515, 4549] },
  { id: "buffalo-ny", name: "Buffalo", state: "NY", rent: 1350, rentSource: "report", county: "Erie County, New York", mit: [4627, 3464, 7823, 1528, 4715] },
  { id: "rochester-ny", name: "Rochester", state: "NY", rent: 1240, rentSource: "report", county: "Monroe County, New York", mit: [4592, 3690, 8162, 1412, 4715] },
  { id: "wichita-ks", name: "Wichita", state: "KS", rent: 770, rentSource: "report", county: "Sedgwick County, Kansas", mit: [4183, 3565, 8994, 1428, 4549] },
  { id: "little-rock-ar", name: "Little Rock", state: "AR", rent: 929, rentSource: "cityPage", county: "Pulaski County, Arkansas", mit: [4195, 3241, 8802, 1560, 4067] },
  { id: "knoxville-tn", name: "Knoxville", state: "TN", rent: 1180, rentSource: "report", county: "Knox County, Tennessee", mit: [4662, 3014, 8884, 2102, 4067] },
  { id: "lexington-ky", name: "Lexington", state: "KY", rent: 1000, rentSource: "report", county: "Fayette County, Kentucky", mit: [4230, 3131, 8377, 1522, 4067] },
  { id: "boulder-co", name: "Boulder", state: "CO", rent: 1700, rentSource: "cityPage", county: "Boulder County, Colorado", mit: [5199, 3266, 8114, 2109, 4992] },
  { id: "fort-collins-co", name: "Fort Collins", state: "CO", rent: 1220, rentSource: "cityPage", county: "Larimer County, Colorado", mit: [4720, 3500, 8485, 2048, 4992] },
  { id: "burlington-vt", name: "Burlington", state: "VT", rent: 1745, rentSource: "cityPage", county: "Chittenden County, Vermont", mit: [5036, 3899, 9157, 1535, 4715] },
  { id: "albany-ny", name: "Albany", state: "NY", rent: 1365, rentSource: "cityPage", county: "Albany County, New York", mit: [4615, 3895, 8146, 1517, 4715] },
  { id: "syracuse-ny", name: "Syracuse", state: "NY", rent: 1330, rentSource: "report", county: "Onondaga County, New York", mit: [4580, 3957, 8402, 1462, 4715] },
  { id: "hartford-ct", name: "Hartford", state: "CT", rent: 1350, rentSource: "cityPage", county: "Capitol Planning Region, Connecticut", mit: [4557, 3815, 8762, 1523, 4715] },
  { id: "new-haven-ct", name: "New Haven", state: "CT", rent: 1890, rentSource: "report", county: "South Central Connecticut Planning Region, Connecticut", mit: [4557, 3908, 8303, 1524, 4715] },
  { id: "wilmington-de", name: "Wilmington", state: "DE", rent: 1652, rentSource: "cityPage", county: "New Castle County, Delaware", mit: [4522, 3419, 8642, 2271, 4067] },
  { id: "norfolk-va", name: "Norfolk", state: "VA", rent: 1300, rentSource: "report", county: "Norfolk city, Virginia", mit: [4276, 3430, 7302, 1586, 4067] },
  { id: "grand-rapids-mi", name: "Grand Rapids", state: "MI", rent: 1490, rentSource: "cityPage", county: "Kent County, Michigan", mit: [4300, 3576, 9178, 1548, 4549] },
  { id: "spokane-wa", name: "Spokane", state: "WA", rent: 1050, rentSource: "report", county: "Spokane County, Washington", mit: [4463, 2971, 8293, 1707, 4992] },
  { id: "boise-id", name: "Boise", state: "ID", rent: 1450, rentSource: "report", county: "Ada County, Idaho", mit: [5036, 3047, 9265, 1605, 4992] },
];

/** Zumper National Rent Report, October 2026: national median 1-bedroom. */
export const NATIONAL_MEDIAN_RENT_1BR = 1519;
export const RENT_AS_OF = "October 2026";
export const COSTS_AS_OF = "February 2026";

/** Monthly essentials for a city: the five MIT categories, summed and divided by 12. */
export function essentialsFor(city: CityRecord): number {
  return Math.round(city.mit.reduce((a, b) => a + b, 0) / 12);
}

export const ESSENTIAL_PARTS = [
  "Food",
  "Health care",
  "Getting around",
  "Phone and internet",
  "Clothing and personal items",
] as const;

// Reverse lookup
export function getCityById(id: string): CityRecord | undefined {
  return CITIES.find((c) => c.id === id);
}

export function searchCities(query: string): CityRecord[] {
  if (!query) return CITIES.slice(0, 12);
  const q = query.toLowerCase().trim();
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase() === q ||
      `${c.name}, ${c.state}`.toLowerCase().includes(q)
  ).slice(0, 12);
}
