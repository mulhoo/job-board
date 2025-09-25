export const API_BASE_URL = "http://localhost:8000";

export const APP_NAME = "JobBoard";
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_TITLE_LENGTH = 200;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_COMPANY_NAME_LENGTH: 100,
  URL_PATTERN: /^https?:\/\/.+/,
};

export const US_CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
  "Mesa, AZ", "Kansas City, MO", "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO",
  "Raleigh, NC", "Miami, FL", "Oakland, CA", "Minneapolis, MN", "Tulsa, OK",
  "Cleveland, OH", "Wichita, KS", "Arlington, TX", "Tampa, FL", "New Orleans, LA",
  "Honolulu, HI", "Anaheim, CA", "Santa Ana, CA", "St. Louis, MO", "Riverside, CA",
  "Corpus Christi, TX", "Pittsburgh, PA", "Lexington, KY", "Anchorage, AK", "Stockton, CA",
  "Cincinnati, OH", "St. Paul, MN", "Toledo, OH", "Greensboro, NC", "Newark, NJ",
  "Plano, TX", "Henderson, NV", "Lincoln, NE", "Buffalo, NY", "Jersey City, NJ",
  "Chula Vista, CA", "Fort Wayne, IN", "Orlando, FL", "St. Petersburg, FL", "Chandler, AZ",
  "Laredo, TX", "Norfolk, VA", "Durham, NC", "Madison, WI", "Lubbock, TX",
  "Irvine, CA", "Winston-Salem, NC", "Glendale, AZ", "Garland, TX", "Hialeah, FL",
  "Reno, NV", "Chesapeake, VA", "Gilbert, AZ", "Baton Rouge, LA", "Irving, TX",
  "Scottsdale, AZ", "North Las Vegas, NV", "Fremont, CA", "Boise, ID", "Richmond, VA",
  "San Bernardino, CA", "Birmingham, AL", "Spokane, WA", "Rochester, NY", "Des Moines, IA",
  "Modesto, CA", "Fayetteville, NC", "Tacoma, WA", "Oxnard, CA", "Fontana, CA",
  "Columbus, GA", "Montgomery, AL", "Moreno Valley, CA", "Shreveport, LA", "Aurora, IL",
  "Yonkers, NY", "Akron, OH", "Huntington Beach, CA", "Little Rock, AR", "Augusta, GA",
  "Amarillo, TX", "Glendale, CA", "Mobile, AL", "Grand Rapids, MI", "Salt Lake City, UT",
  "Tallahassee, FL", "Huntsville, AL", "Grand Prairie, TX", "Knoxville, TN", "Worcester, MA",
  "Newport News, VA", "Brownsville, TX", "Overland Park, KS", "Santa Clarita, CA", "Providence, RI",
  "Garden Grove, CA", "Chattanooga, TN", "Oceanside, CA", "Jackson, MS", "Fort Lauderdale, FL",
  "Santa Rosa, CA", "Rancho Cucamonga, CA", "Port St. Lucie, FL", "Tempe, AZ", "Ontario, CA",
  "Vancouver, WA", "Cape Coral, FL", "Sioux Falls, SD", "Springfield, MO", "Peoria, AZ",
  "Pembroke Pines, FL", "Elk Grove, CA", "Salem, OR", "Lancaster, CA", "Corona, CA",
  "Eugene, OR", "Palmdale, CA", "Salinas, CA", "Springfield, MA", "Pasadena, CA",
  "Fort Collins, CO", "Hayward, CA", "Pomona, CA", "Cary, NC", "Rockford, IL",
  "Alexandria, VA", "Escondido, CA", "McKinney, TX", "Kansas City, KS", "Hartford, CT",
  "Torrance, CA", "Bridgeport, CT", "Lakewood, CO", "Hollywood, FL", "Paterson, NJ",
  "Syracuse, NY", "Savannah, GA", "Thornton, CO", "Fullerton, CA", "McAllen, TX",
  "Naperville, IL", "Mesquite, TX", "Roseville, CA", "Sterling Heights, MI", "Carrollton, TX",
  "Coral Springs, FL", "Stamford, CT", "Concord, CA", "Daly City, CA", "Kent, WA",
  "Topeka, KS", "Norman, OK", "Simi Valley, CA", "Fargo, ND", "Meridian, ID",
  "Pearland, TX", "Murfreesboro, TN", "Temecula, CA", "Westminster, CO", "Elgin, IL",
  "Waterbury, CT", "Billings, MT", "Lowell, MA", "San Buenaventura, CA", "Pueblo, CO",
  "High Point, NC", "West Valley City, UT", "Richmond, CA", "Murrieta, CA", "Cambridge, MA",
  "Antioch, CA", "Temecula, CA", "Norwalk, CA", "Centennial, CO", "Everett, WA",
  "Palm Bay, FL", "Wichita Falls, TX", "Green Bay, WI", "Dearborn, MI", "Richardson, TX",
  "Clearwater, FL", "Inglewood, CA", "Miami Gardens, FL", "Albany, NY", "League City, TX",
  "Sterling Heights, MI", "Ann Arbor, MI", "Beaumont, TX", "Evansville, IN", "Odessa, TX",
  "Independence, MO", "Provo, UT", "Tyler, TX", "Peoria, IL", "Cedar Rapids, IA",
  "Charleston, SC", "Carlsbad, CA", "Thousand Oaks, CA", "Round Rock, TX", "Denton, TX",
  "Visalia, CA", "Sparks, NV", "New Haven, CT", "Lewisville, TX", "South Bend, IN",
  "Lakewood, CA", "Erie, PA", "Davenport, IA", "Santa Maria, CA", "Carmel, IN",
  "Pompano Beach, FL", "West Palm Beach, FL", "Antioch, CA", "Broken Arrow, OK", "Westminster, CA",
  "Abilene, TX", "Murrieta, CA", "Racine, WI", "Flint, MI", "Rialto, CA",

  "Remote", "Hybrid", "Remote (US)", "Remote (USA)"
].sort();


export const SALARY_RANGES = [
  "Under $50,000",
  "$50,000 - $75,000",
  "$75,000 - $100,000",
  "$100,000 - $150,000",
  "$150,000 - $200,000",
  "Over $200,000"
];

export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Associate",
  "Mid-Level",
  "Senior",
  "Lead",
  "Principal",
  "Executive"
];

export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+"
];

export default {
  API_BASE_URL,
  APP_NAME,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  VALIDATION,
  US_CITIES,
  SALARY_RANGES,
  EXPERIENCE_LEVELS,
  COMPANY_SIZES
};
