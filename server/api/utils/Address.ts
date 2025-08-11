import {callCiviApi} from './civi-api';

export function get_voting_district(postal_code: string | number): string {
  // Se till att postnummer är en sträng och trimma eventuella mellanslag i början/slutet
  let cleaned_postal_code = String(postal_code || '').trim();

  // Ersätt alla mellanslag med tom sträng och konvertera till ett heltal
  // Om cleanedPostnummer är tomt efter trimning, blir det '0' och sedan 0 efter parseInt
  const number = parseInt(cleaned_postal_code.replace(/ /g, ''), 10) || 0;

  const ranges = [
    [11100, 11126, 2],
    [11127, 11132, 15],
    [11132, 11200, 2],
    [11200, 11300, 4],
    [11300, 11400, 2],
    [11400, 11500, 3],
    [11500, 11600, 3],
    [11600, 11700, 1],
    [11700, 11755, 1],
    [11755, 11758, 14],
    [11758, 11770, 8],
    [11770, 11800, 1],
    [11800, 11900, 1],
    [12029, 12035, 1],
    [12035, 12061, 14],
    [12061, 12080, 1],
    [12130, 12138, 14],
    [12138, 12146, 1],
    [12146, 12186, 5],
    [12200, 12231, 5],
    [12231, 12240, 14],
    [12240, 12263, 5],
    [12263, 12265, 14],
    [12266, 12288, 5],
    [12300, 12352, 6],
    [12353, 12399, 6],
    [12400, 12478, 5],
    [12500, 12570, 8],
    [12570, 12575, 8],
    [12575, 12587, 8],
    [12600, 12700, 8],
    [12730, 12788, 9],
    [12830, 12840, 7],
    [12841, 12849, 7],
    [12862, 12870, 6],
    [12930, 12959, 8],
    [13155, 13156, 1], // Nackanummer i Södermalm-Sjöstaden
    [13559, 13560, 6], // #Tyresönummer i Farsta, Östra söderort
    [13570, 13571, 6], // Tyresönummer i Farsta, Östra söderort
    [16200, 16289, 11],
    [16300, 16392, 12],
    [16400, 16500, 13],
    [16500, 16580, 11],
    [16700, 16800, 10],
    [16800, 16900, 10],
  ];

  const stadsdelsDict: { [key: number]: string } = {
    1: 'Södermalm-Sjöstaden',
    2: 'Norrmalm',
    3: 'Östermalm',
    4: 'Kungsholmen',
    5: 'Vantör',
    6: 'Farsta',
    7: 'Skarpnäck',
    8: 'Hägersten-Liljeholmen-Älvsjö',
    9: 'Skärholmen',
    10: 'Bromma',
    11: 'Hässelby-Vällingby',
    12: 'Spånga-Tensta',
    13: 'Rinkeby-Kista',
    14: 'Enskede',
    15: 'Gamla Stan',
  };

  for (const range of ranges) {
    const [start, end, valkrets_id] = range; // Array destructuring för att tilldela variabler
    if (number >= start && number < end) {
      return stadsdelsDict[valkrets_id]; // Numret ligger inom intervallet
    }
  }

  return 'None'; // Numret ligger inte inom något av intervallen
}


// services/addressService.js
export async function getProvince(municipality:string): Promise<string> {
  const url = '/Address/get';
  const params = {
    select: ['state_province_id', 'COUNT(id) AS count'],
    where: [['supplemental_address_3', '=', municipality], ['state_province_id', 'IS NOT NULL']],
    limit: 25,
    groupBy: ['state_province_id'],
  };

  try {
    const response = await callCiviApi(url, params);

    const address = response.values?.flat() || [];
    const province = address.length > 0 ? address[0].state_province_id : '0';
    return province;
  } catch (error) {
    console.error('API error:', error);
    return '0';
  }
}


// Function to get city and municipality from postal code using REST API
export async function getCityAndMunicipality(postal_code: string): Promise<{ city: string; municipality: string; province: string }> {
  // remove all non-digit characters from postal_code
  postal_code = postal_code.replace(/\D/g, '');
  const url = `https://api.papapi.se/lite/?query={postal_code}&format=json&apikey={process.env.PAPAPI_KEY}`.replace('{postal_code}', postal_code).replace('{process.env.PAPAPI_KEY}', process.env.PAPAPI_KEY || '');
  // console.log('Fetching city and municipality for postal code:', postal_code);
  // console.info('API URL:', url);
  try {
    const response = await fetch(url) ;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }   
    // console.info('API response:', response);
    const data = await response.json();
    const result = data.results[0];
    const city = result.city;
    const municipality = result.county;
    const province = result.state;

    console.info('City:', city, 'Municipality:', municipality, 'Province:', province);
    return {city,municipality, province};
      
  } catch (error) {
    console.error('API error:', error);
    return { city: '', municipality: '', province: '' };
  }
}