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
 * rent2: the median 2-bedroom from the same October 2026 report, or null for
 * the cities the report leaves out.
 *
 * fmr: HUD Fair Market Rents, FY2026 (revised file), for 1, 2, 3 and 4
 * bedrooms in the FMR area holding the city's county (in New England, the
 * city's own town row), https://www.huduser.gov/portal/datasets/fmr/fmr2026/
 * FY26_FMRs_revised.xlsx . Used only for how rent grows with each extra
 * bedroom in that area, never as a rent on its own: see householdRent().
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
  { id: "san-francisco-ca", name: "San Francisco", state: "CA", rent: 4430, rentSource: "report", rent2: 6320, fmr: [2977, 3604, 4604, 4772], county: "San Francisco County, California", mit: [5807, 3828, 6691, 1971, 4992] },
  { id: "new-york-ny", name: "New York City", state: "NY", rent: 4610, rentSource: "report", rent2: 5470, fmr: [2655, 2910, 3644, 3959], county: "New York County, New York", mit: [7116, 4695, 4710, 1627, 4715] },
  { id: "boston-ma", name: "Boston", state: "MA", rent: 2980, rentSource: "report", rent2: 3500, fmr: [2476, 2941, 3526, 3894], county: "Suffolk County, Massachusetts", mit: [5141, 4257, 5991, 2359, 4715] },
  { id: "san-jose-ca", name: "San Jose", state: "CA", rent: 2890, rentSource: "report", rent2: 3700, fmr: [2982, 3483, 4602, 5010], county: "Santa Clara County, California", mit: [5036, 3651, 10808, 1882, 4992] },
  { id: "oakland-ca", name: "Oakland", state: "CA", rent: 2120, rentSource: "report", rent2: 2720, fmr: [2385, 2912, 3724, 4413], county: "Alameda County, California", mit: [5083, 3752, 9043, 1924, 4992] },
  { id: "los-angeles-ca", name: "Los Angeles", state: "CA", rent: 2300, rentSource: "report", rent2: 2930, fmr: [2328, 2903, 3681, 4098], county: "Los Angeles County, California", mit: [4463, 3255, 8681, 1517, 4992] },
  { id: "san-diego-ca", name: "San Diego", state: "CA", rent: 2210, rentSource: "report", rent2: 2990, fmr: [2459, 3001, 3998, 4845], county: "San Diego County, California", mit: [4487, 3243, 9308, 1536, 4992] },
  { id: "seattle-wa", name: "Seattle", state: "WA", rent: 1900, rentSource: "report", rent2: 2700, fmr: [2146, 2501, 3272, 3847], county: "King County, Washington", mit: [5234, 3032, 8441, 2397, 4992] },
  { id: "washington-dc", name: "Washington, D.C.", state: "DC", rent: 2240, rentSource: "report", rent2: 2880, fmr: [2015, 2246, 2835, 3332], county: "District of Columbia, District of Columbia", mit: [5503, 3682, 4729, 2224, 4067] },
  { id: "honolulu-hi", name: "Honolulu", state: "HI", rent: 2380, rentSource: "report", rent2: 3030, fmr: [2016, 2642, 3674, 4432], county: "Honolulu County, Hawaii", mit: [5211, 2367, 10091, 1376, 4992] },
  { id: "chicago-il", name: "Chicago", state: "IL", rent: 2180, rentSource: "report", rent2: 2520, fmr: [1581, 1781, 2294, 2653], county: "Cook County, Illinois", mit: [4720, 3594, 7211, 1820, 4549] },
  { id: "miami-fl", name: "Miami", state: "FL", rent: 2490, rentSource: "report", rent2: 3220, fmr: [1995, 2436, 3127, 3613], county: "Miami-Dade County, Florida", mit: [4802, 2801, 7395, 2115, 4067] },
  { id: "denver-co", name: "Denver", state: "CO", rent: 1510, rentSource: "report", rent2: 2080, fmr: [1754, 2089, 2734, 3049], county: "Denver County, Colorado", mit: [4779, 3199, 7116, 2281, 4992] },
  { id: "portland-or", name: "Portland", state: "OR", rent: 1390, rentSource: "report", rent2: 1700, fmr: [1677, 1922, 2619, 3109], county: "Multnomah County, Oregon", mit: [5234, 2695, 7783, 2463, 4992] },
  { id: "philadelphia-pa", name: "Philadelphia", state: "PA", rent: 1450, rentSource: "report", rent2: 1690, fmr: [1520, 1810, 2170, 2423], county: "Philadelphia County, Pennsylvania", mit: [4627, 4053, 5831, 2168, 4715] },
  { id: "atlanta-ga", name: "Atlanta", state: "GA", rent: 1630, rentSource: "report", rent2: 2060, fmr: [1660, 1820, 2182, 2605], county: "Fulton County, Georgia", mit: [5176, 3098, 8253, 1854, 4067] },
  { id: "minneapolis-mn", name: "Minneapolis", state: "MN", rent: 1300, rentSource: "report", rent2: 1790, fmr: [1405, 1709, 2262, 2531], county: "Hennepin County, Minnesota", mit: [5188, 3443, 7954, 1793, 4549] },
  { id: "austin-tx", name: "Austin", state: "TX", rent: 1510, rentSource: "report", rent2: 1970, fmr: [1562, 1852, 2347, 2760], county: "Travis County, Texas", mit: [4159, 3075, 8465, 1479, 4067] },
  { id: "nashville-tn", name: "Nashville", state: "TN", rent: 1470, rentSource: "report", rent2: 1750, fmr: [1578, 1730, 2211, 2696], county: "Davidson County, Tennessee", mit: [4814, 3236, 8507, 1939, 4067] },
  { id: "raleigh-nc", name: "Raleigh", state: "NC", rent: 1260, rentSource: "report", rent2: 1500, fmr: [1596, 1750, 2196, 2936], county: "Wake County, North Carolina", mit: [4744, 3354, 8986, 1650, 4067] },
  { id: "charlotte-nc", name: "Charlotte", state: "NC", rent: 1400, rentSource: "report", rent2: 1690, fmr: [1538, 1686, 2076, 2637], county: "Mecklenburg County, North Carolina", mit: [4779, 3476, 8027, 1461, 4067] },
  { id: "baltimore-md", name: "Baltimore", state: "MD", rent: 1220, rentSource: "report", rent2: 1640, fmr: [1511, 1857, 2358, 2611], county: "Baltimore city, Maryland", mit: [5001, 3536, 6473, 1515, 4067] },
  { id: "providence-ri", name: "Providence", state: "RI", rent: 1850, rentSource: "report", rent2: 2070, fmr: [1402, 1729, 2087, 2480], county: "Providence County, Rhode Island", mit: [4732, 4011, 7786, 1543, 4715] },
  { id: "sacramento-ca", name: "Sacramento", state: "CA", rent: 1490, rentSource: "report", rent2: 1840, fmr: [1832, 2255, 3002, 3460], county: "Sacramento County, California", mit: [4428, 3846, 9065, 1477, 4992] },
  { id: "long-beach-ca", name: "Long Beach", state: "CA", rent: 1800, rentSource: "report", rent2: 2390, fmr: [2328, 2903, 3681, 4098], county: "Los Angeles County, California", mit: [4463, 3255, 8681, 1517, 4992] },
  { id: "anaheim-ca", name: "Anaheim", state: "CA", rent: 2000, rentSource: "report", rent2: 2670, fmr: [2746, 3236, 4393, 5246], county: "Orange County, California", mit: [4627, 3241, 9204, 1501, 4992] },
  { id: "dallas-tx", name: "Dallas", state: "TX", rent: 1470, rentSource: "report", rent2: 2100, fmr: [1648, 1931, 2431, 3091], county: "Dallas County, Texas", mit: [4019, 3032, 8440, 1454, 4067] },
  { id: "houston-tx", name: "Houston", state: "TX", rent: 1210, rentSource: "report", rent2: 1490, fmr: [1323, 1573, 2116, 2639], county: "Harris County, Texas", mit: [3856, 3271, 8454, 1659, 4067] },
  { id: "phoenix-az", name: "Phoenix", state: "AZ", rent: 1210, rentSource: "report", rent2: 1480, fmr: [1583, 1839, 2452, 2720], county: "Maricopa County, Arizona", mit: [4183, 3005, 8503, 1809, 4992] },
  { id: "tampa-fl", name: "Tampa", state: "FL", rent: 1500, rentSource: "report", rent2: 1790, fmr: [1696, 1977, 2527, 3077], county: "Hillsborough County, Florida", mit: [4533, 2994, 7966, 1562, 4067] },
  { id: "orlando-fl", name: "Orlando", state: "FL", rent: 1430, rentSource: "report", rent2: 1690, fmr: [1731, 1972, 2476, 2924], county: "Orange County, Florida", mit: [4557, 2977, 8515, 1630, 4067] },
  { id: "las-vegas-nv", name: "Las Vegas", state: "NV", rent: 1140, rentSource: "report", rent2: 1420, fmr: [1478, 1735, 2413, 2764], county: "Clark County, Nevada", mit: [4241, 2715, 9103, 1806, 4992] },
  { id: "salt-lake-city-ut", name: "Salt Lake City", state: "UT", rent: 1180, rentSource: "report", rent2: 1570, fmr: [1456, 1747, 2333, 2666], county: "Salt Lake County, Utah", mit: [4323, 2924, 9177, 1566, 4992] },
  { id: "richmond-va", name: "Richmond", state: "VA", rent: 1390, rentSource: "report", rent2: 1650, fmr: [1507, 1655, 2072, 2553], county: "Richmond city, Virginia", mit: [5083, 3476, 6909, 1586, 4067] },
  { id: "columbus-oh", name: "Columbus", state: "OH", rent: 1170, rentSource: "report", rent2: 1360, fmr: [1194, 1430, 1715, 1927], county: "Franklin County, Ohio", mit: [4358, 3658, 7912, 1497, 4549] },
  { id: "indianapolis-in", name: "Indianapolis", state: "IN", rent: 1050, rentSource: "report", rent2: 1300, fmr: [1267, 1473, 1907, 2338], county: "Marion County, Indiana", mit: [3949, 3484, 8576, 1443, 4549] },
  { id: "milwaukee-wi", name: "Milwaukee", state: "WI", rent: 1080, rentSource: "report", rent2: 1290, fmr: [1119, 1338, 1648, 1784], county: "Milwaukee County, Wisconsin", mit: [4393, 3760, 7295, 1530, 4549] },
  { id: "kansas-city-mo", name: "Kansas City", state: "MO", rent: 1150, rentSource: "report", rent2: 1400, fmr: [1197, 1358, 1769, 2103], county: "Jackson County, Missouri", mit: [4440, 3496, 8501, 1474, 4549] },
  { id: "pittsburgh-pa", name: "Pittsburgh", state: "PA", rent: 1360, rentSource: "report", rent2: 1500, fmr: [1077, 1299, 1661, 1789], county: "Allegheny County, Pennsylvania", mit: [4767, 3691, 7637, 1868, 4715] },
  { id: "jacksonville-fl", name: "Jacksonville", state: "FL", rent: 1100, rentSource: "report", rent2: 1350, fmr: [1382, 1658, 2043, 2561], county: "Duval County, Florida", mit: [4370, 3136, 8376, 1673, 4067] },
  { id: "new-orleans-la", name: "New Orleans", state: "LA", rent: 1410, rentSource: "report", rent2: 1630, fmr: [1113, 1331, 1701, 1996], county: "Orleans Parish, Louisiana", mit: [4674, 3218, 7508, 1615, 4067] },
  { id: "ann-arbor-mi", name: "Ann Arbor", state: "MI", rent: 1550, rentSource: "cityPage", rent2: null, fmr: [1387, 1656, 1986, 2193], county: "Washtenaw County, Michigan", mit: [4639, 3716, 8683, 1518, 4549] },
  { id: "madison-wi", name: "Madison", state: "WI", rent: 1510, rentSource: "report", rent2: 1930, fmr: [1482, 1694, 2236, 2509], county: "Dane County, Wisconsin", mit: [4697, 3785, 8684, 1460, 4549] },
  { id: "cleveland-oh", name: "Cleveland", state: "OH", rent: 1190, rentSource: "report", rent2: 1240, fmr: [1058, 1279, 1646, 1760], county: "Cuyahoga County, Ohio", mit: [4849, 3635, 7728, 1449, 4549] },
  { id: "cincinnati-oh", name: "Cincinnati", state: "OH", rent: 1050, rentSource: "report", rent2: 1400, fmr: [1051, 1353, 1785, 1976], county: "Hamilton County, Ohio", mit: [4300, 3392, 8266, 1301, 4549] },
  { id: "detroit-mi", name: "Detroit", state: "MI", rent: 920, rentSource: "report", rent2: 1090, fmr: [1122, 1411, 1724, 1868], county: "Wayne County, Michigan", mit: [4183, 3352, 8230, 1778, 4549] },
  { id: "memphis-tn", name: "Memphis", state: "TN", rent: 910, rentSource: "report", rent2: 970, fmr: [1154, 1274, 1683, 1959], county: "Shelby County, Tennessee", mit: [4452, 3068, 8534, 1603, 4067] },
  { id: "louisville-ky", name: "Louisville", state: "KY", rent: 1070, rentSource: "report", rent2: 1240, fmr: [1047, 1272, 1625, 1891], county: "Jefferson County, Kentucky", mit: [4300, 3119, 8721, 1572, 4067] },
  { id: "oklahoma-city-ok", name: "Oklahoma City", state: "OK", rent: 890, rentSource: "report", rent2: 1120, fmr: [1017, 1244, 1675, 1857], county: "Oklahoma County, Oklahoma", mit: [4265, 3668, 8940, 1393, 4067] },
  { id: "st-louis-mo", name: "St. Louis", state: "MO", rent: 990, rentSource: "report", rent2: 1350, fmr: [995, 1218, 1568, 1812], county: "St. Louis city, Missouri", mit: [4954, 3343, 7088, 1433, 4549] },
  { id: "birmingham-al", name: "Birmingham", state: "AL", rent: 1080, rentSource: "cityPage", rent2: null, fmr: [1155, 1266, 1583, 1801], county: "Jefferson County, Alabama", mit: [4580, 3608, 9059, 1592, 4067] },
  { id: "tulsa-ok", name: "Tulsa", state: "OK", rent: 930, rentSource: "report", rent2: 1180, fmr: [987, 1217, 1602, 1858], county: "Tulsa County, Oklahoma", mit: [4323, 3567, 9019, 1443, 4067] },
  { id: "albuquerque-nm", name: "Albuquerque", state: "NM", rent: 1010, rentSource: "report", rent2: 1310, fmr: [1185, 1464, 2036, 2399], county: "Bernalillo County, New Mexico", mit: [4159, 3020, 8125, 2126, 4992] },
  { id: "tucson-az", name: "Tucson", state: "AZ", rent: 860, rentSource: "report", rent2: 1200, fmr: [1081, 1402, 1950, 2245], county: "Pima County, Arizona", mit: [4101, 2715, 8158, 1864, 4992] },
  { id: "des-moines-ia", name: "Des Moines", state: "IA", rent: 820, rentSource: "report", rent2: 1040, fmr: [1109, 1318, 1794, 1841], county: "Polk County, Iowa", mit: [4428, 3494, 8829, 1570, 4549] },
  { id: "omaha-ne", name: "Omaha", state: "NE", rent: 1010, rentSource: "report", rent2: 1370, fmr: [1148, 1368, 1813, 2046], county: "Douglas County, Nebraska", mit: [4428, 3278, 8723, 1632, 4549] },
  { id: "lincoln-ne", name: "Lincoln", state: "NE", rent: 840, rentSource: "report", rent2: 1120, fmr: [926, 1141, 1587, 1712], county: "Lancaster County, Nebraska", mit: [4370, 3298, 8555, 1515, 4549] },
  { id: "buffalo-ny", name: "Buffalo", state: "NY", rent: 1350, rentSource: "report", rent2: 1500, fmr: [1139, 1343, 1640, 1869], county: "Erie County, New York", mit: [4627, 3464, 7823, 1528, 4715] },
  { id: "rochester-ny", name: "Rochester", state: "NY", rent: 1240, rentSource: "report", rent2: 1440, fmr: [1256, 1573, 1895, 2083], county: "Monroe County, New York", mit: [4592, 3690, 8162, 1412, 4715] },
  { id: "wichita-ks", name: "Wichita", state: "KS", rent: 770, rentSource: "report", rent2: 950, fmr: [849, 1099, 1444, 1784], county: "Sedgwick County, Kansas", mit: [4183, 3565, 8994, 1428, 4549] },
  { id: "little-rock-ar", name: "Little Rock", state: "AR", rent: 929, rentSource: "cityPage", rent2: null, fmr: [989, 1147, 1540, 1822], county: "Pulaski County, Arkansas", mit: [4195, 3241, 8802, 1560, 4067] },
  { id: "knoxville-tn", name: "Knoxville", state: "TN", rent: 1180, rentSource: "report", rent2: 1570, fmr: [1184, 1471, 1864, 2172], county: "Knox County, Tennessee", mit: [4662, 3014, 8884, 2102, 4067] },
  { id: "lexington-ky", name: "Lexington", state: "KY", rent: 1000, rentSource: "report", rent2: 1350, fmr: [1079, 1272, 1743, 1940], county: "Fayette County, Kentucky", mit: [4230, 3131, 8377, 1522, 4067] },
  { id: "boulder-co", name: "Boulder", state: "CO", rent: 1700, rentSource: "cityPage", rent2: null, fmr: [1795, 2124, 2820, 3239], county: "Boulder County, Colorado", mit: [5199, 3266, 8114, 2109, 4992] },
  { id: "fort-collins-co", name: "Fort Collins", state: "CO", rent: 1220, rentSource: "cityPage", rent2: null, fmr: [1537, 1732, 2385, 2540], county: "Larimer County, Colorado", mit: [4720, 3500, 8485, 2048, 4992] },
  { id: "burlington-vt", name: "Burlington", state: "VT", rent: 1745, rentSource: "cityPage", rent2: null, fmr: [1651, 2140, 2745, 2833], county: "Chittenden County, Vermont", mit: [5036, 3899, 9157, 1535, 4715] },
  { id: "albany-ny", name: "Albany", state: "NY", rent: 1365, rentSource: "cityPage", rent2: null, fmr: [1417, 1702, 2041, 2253], county: "Albany County, New York", mit: [4615, 3895, 8146, 1517, 4715] },
  { id: "syracuse-ny", name: "Syracuse", state: "NY", rent: 1330, rentSource: "report", rent2: 1460, fmr: [1123, 1392, 1691, 1848], county: "Onondaga County, New York", mit: [4580, 3957, 8402, 1462, 4715] },
  { id: "hartford-ct", name: "Hartford", state: "CT", rent: 1350, rentSource: "cityPage", rent2: null, fmr: [1477, 1865, 2236, 2537], county: "Capitol Planning Region, Connecticut", mit: [4557, 3815, 8762, 1523, 4715] },
  { id: "new-haven-ct", name: "New Haven", state: "CT", rent: 1890, rentSource: "report", rent2: 2040, fmr: [1591, 1969, 2433, 2872], county: "South Central Connecticut Planning Region, Connecticut", mit: [4557, 3908, 8303, 1524, 4715] },
  { id: "wilmington-de", name: "Wilmington", state: "DE", rent: 1652, rentSource: "cityPage", rent2: null, fmr: [1520, 1810, 2170, 2423], county: "New Castle County, Delaware", mit: [4522, 3419, 8642, 2271, 4067] },
  { id: "norfolk-va", name: "Norfolk", state: "VA", rent: 1300, rentSource: "report", rent2: 1600, fmr: [1512, 1713, 2376, 2797], county: "Norfolk city, Virginia", mit: [4276, 3430, 7302, 1586, 4067] },
  { id: "grand-rapids-mi", name: "Grand Rapids", state: "MI", rent: 1490, rentSource: "cityPage", rent2: null, fmr: [1278, 1531, 1980, 2189], county: "Kent County, Michigan", mit: [4300, 3576, 9178, 1548, 4549] },
  { id: "spokane-wa", name: "Spokane", state: "WA", rent: 1050, rentSource: "report", rent2: 1330, fmr: [1193, 1531, 2088, 2506], county: "Spokane County, Washington", mit: [4463, 2971, 8293, 1707, 4992] },
  { id: "boise-id", name: "Boise", state: "ID", rent: 1450, rentSource: "report", rent2: 1690, fmr: [1381, 1655, 2318, 2772], county: "Ada County, Idaho", mit: [5036, 3047, 9265, 1605, 4992] },
];

/** Zumper National Rent Report, October 2026: national median 1-bedroom. */
export const NATIONAL_MEDIAN_RENT_1BR = 1519;
export const RENT_AS_OF = "October 2026";
export const COSTS_AS_OF = "February 2026";

/** Roommates the app offers: none to three, so up to a 4-bedroom. */
export const MAX_ROOMMATES = 3;

/**
 * Typical monthly rent for a whole place with one bedroom per person.
 * - 1 person: Zumper's median 1-bedroom.
 * - 2 people: Zumper's median 2-bedroom, from the same report.
 * - 3 or 4 people, or 2 in a city the report leaves out: Zumper has no
 *   figure, so the largest Zumper median the city has is scaled by HUD's
 *   ratio between the two sizes in that area. For example a 3-bedroom in
 *   Boston is 3,500 x 3,526 / 2,941.
 */
export function householdRent(city: CityRecord, people: number): number {
  const n = Math.min(Math.max(1, Math.round(people)), MAX_ROOMMATES + 1);
  if (n === 1) return city.rent;
  const [anchor, beds] = city.rent2 ? [city.rent2, 2] : [city.rent, 1];
  return (anchor * city.fmr[n - 1]) / city.fmr[beds - 1];
}

/** Your even share of that rent, whole dollars a month. */
export function rentShare(city: CityRecord, roommates: number): number {
  const people = Math.min(Math.max(0, Math.round(roommates)), MAX_ROOMMATES) + 1;
  return Math.round(householdRent(city, people) / people);
}

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
