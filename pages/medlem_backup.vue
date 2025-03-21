<template>
  <div>
    <v-tabs v-model="tab" color="white" center-active>
      <v-tab :value="1">Stripe</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1" class="d-flex justify-center">
        <v-card flat color="white" width="800">
          <v-card-title> We fucling love u brah! så tung e du</v-card-title>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="firstName" label="Förnamn" required :rules="[(v) => !!v || 'Förnamn krävs']" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="lastName"
                    label="Efternamn"
                    required
                    :rules="[(v) => !!v || 'Efternamn krävs']"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="personalNumber" label="Personnummer (för ungdomsrabatt)" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-if="country === 'SE'"
                    v-model="municipality"
                    :items="swedishMunicipalities"
                    label="Kommun"
                    required
                    :rules="[(v) => !!v || 'Kommun krävs i Sverige']"
                    autocomplete
                  />
                </v-col>
              </v-row>

              <v-autocomplete
                v-model="country"
                :items="countries"
                item-title="name"
                item-value="code"
                label="Land"
                required
                :rules="[(v) => !!v || 'Land krävs']"
              />

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="cardNumber"
                    label="Kortnummer"
                    required
                    :rules="[(v) => !!v || 'Kortnummer krävs']"
                  />
                </v-col>

                <v-col cols="6" sm="4">
                  <v-text-field
                    v-model="expirationDate"
                    label="Utgångsdatum"
                    :rules="[(v) => !!v || 'Utgångsdatum krävs']"
                    required
                  />
                </v-col>

                <v-col cols="6" sm="2">
                  <v-text-field v-model="cvc" label="cvc" :rules="[(v) => !!v || 'CVC krävs']" required />
                </v-col>
              </v-row>

              <v-checkbox
                v-model="acceptPrivacy"
                label="Jag accepterar integritetspolicyn"
                required
                :rules="[(v) => !!v || 'Du måste acceptera integritetspolicyn']"
              />

              <v-checkbox v-model="subscribe" label="Årlig debitering?" />

              <v-btn type="submit" color="primary" :disabled="!valid || isLoading" block>
                {{ isLoading ? 'Laddar...' : 'Bli medlem' }}
              </v-btn>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
            </v-container>
          </v-form>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>

    <!-- <form id="payment-form" @submit.prevent="handleSubmit">
      <div id="payment-element" />
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button id="submit" :disabled="isLoading">
        {{ isLoading ? 'Processing...' : 'Subscribe $20/month (Test Mode)' }}
      </button>
      <div class="test-info">
        <p>Test with: 4242 4242 4242 4242, any future date, any CVC</p>
      </div>
    </form> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const tab = ref(null);
const valid = ref(false);
const firstName = ref('');
const lastName = ref('');
const address = ref('');
const country = ref('SE');
const municipality = ref('');
const personalNumber = ref('');
const cardNumber = ref('');
const expirationDate = ref('');
const cvc = ref('');
const acceptPrivacy = ref(false);
const subscribe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const clientSecret = ref('');
let stripe;
let elements;

async function mountStripe() {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      body: {
        price: 300,
        interval: 'year',
      },
    });

    const data = await response.json();
    clientSecret.value = data.clientSecret;

    const { public: { stripe: { key } = {} } = {} } = useRuntimeConfig();

    stripe = await loadStripe(key);
    const appearance = { theme: 'flat' };

    elements = stripe.elements({ appearance, clientSecret: clientSecret.value });
    const paymentElement = elements.create('payment', {
      fields: {
        billingDetails: {
          name: 'auto',
          email: 'auto',
        },
      },
    });

    console.log({ paymentElement });
    // paymentElement.mount("#payment-element")
  } catch (error) {
    errorMessage.value = 'Failed to initialize subscription form: ' + error.message;
  }
}

onMounted(async () => await mountStripe());

async function handleSubmit() {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const billingDetails = {
      name: `${firstName.value} ${lastName.value}`,
      address: {
        line1: address.value,
        country: country.value,
      },
    };

    if (country.value === 'SE' && municipality.value) {
      billingDetails.address.city = municipality.value;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: 'Test Subscriber',
            email: 'test@example.com',
          },
        },
      },
    });

    if (error) errorMessage.value = error.message;
    else errorMessage.value = 'Subscription setup successful!';
  } catch (error) {
    errorMessage.value = 'Subscription setup failed: ' + error.message;
  } finally {
    isLoading.value = false;
  }
}

const countries = ref([
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albanien', code: 'AL' },
  { name: 'Algeriet', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua och Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenien', code: 'AM' },
  { name: 'Australien', code: 'AU' },
  { name: 'Österrike', code: 'AT' },
  { name: 'Azerbajdzjan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgien', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnien och Hercegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brasilien', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgarien', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Kambodja', code: 'KH' },
  { name: 'Kamerun', code: 'CM' },
  { name: 'Kanada', code: 'CA' },
  { name: 'Kap Verde', code: 'CV' },
  { name: 'Centralafrikanska republiken', code: 'CF' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'Kina', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Komorerna', code: 'KM' },
  { name: 'Kongo-Brazzaville', code: 'CG' },
  { name: 'Kongo-Kinshasa', code: 'CD' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Kroatien', code: 'HR' },
  { name: 'Kuba', code: 'CU' },
  { name: 'Cypern', code: 'CY' },
  { name: 'Tjeckien', code: 'CZ' },
  { name: 'Danmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominikanska republiken', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypten', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Ekvatorialguinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estland', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Etiopien', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'Frankrike', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgien', code: 'GE' },
  { name: 'Tyskland', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Grekland', code: 'GR' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Ungern', code: 'HU' },
  { name: 'Island', code: 'IS' },
  { name: 'Indien', code: 'IN' },
  { name: 'Indonesien', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Irak', code: 'IQ' },
  { name: 'Irland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italien', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordanien', code: 'JO' },
  { name: 'Kazakstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Nordkorea', code: 'KP' },
  { name: 'Sydkorea', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kirgisistan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Lettland', code: 'LV' },
  { name: 'Libanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyen', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Litauen', code: 'LT' },
  { name: 'Luxemburg', code: 'LU' },
  { name: 'Madagaskar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldiverna', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshallöarna', code: 'MH' },
  { name: 'Mauretanien', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexiko', code: 'MX' },
  { name: 'Mikronesien', code: 'FM' },
  { name: 'Moldavien', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongoliet', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Marocko', code: 'MA' },
  { name: 'Moçambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Nederländerna', code: 'NL' },
  { name: 'Nya Zeeland', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Nordmakedonien', code: 'MK' },
  { name: 'Norge', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestina', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua Nya Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Filippinerna', code: 'PH' },
  { name: 'Polen', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Rumänien', code: 'RO' },
  { name: 'Ryssland', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint Kitts och Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent och Grenadinerna', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'São Tomé och Príncipe', code: 'ST' },
  { name: 'Saudiarabien', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbien', code: 'RS' },
  { name: 'Seychellerna', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakien', code: 'SK' },
  { name: 'Slovenien', code: 'SI' },
  { name: 'Salomonöarna', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'Sydafrika', code: 'ZA' },
  { name: 'Sydsudan', code: 'SS' },
  { name: 'Spanien', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Surinam', code: 'SR' },
  { name: 'Sverige', code: 'SE' },
  { name: 'Schweiz', code: 'CH' },
  { name: 'Syrien', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tadzjikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Östtimor', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad och Tobago', code: 'TT' },
  { name: 'Tunisien', code: 'TN' },
  { name: 'Turkiet', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraina', code: 'UA' },
  { name: 'Förenade Arabemiraten', code: 'AE' },
  { name: 'Storbritannien', code: 'GB' },
  { name: 'USA', code: 'US' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatikanstaten', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Jemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
]);

const swedishMunicipalities = ref([
  'Ale',
  'Alingsås',
  'Alvesta',
  'Aneby',
  'Arboga',
  'Arjeplog',
  'Arvidsjaur',
  'Arvika',
  'Askersund',
  'Avesta',
  'Bengtsfors',
  'Berg',
  'Bjurholm',
  'Bjuv',
  'Boden',
  'Bollebygd',
  'Bollnäs',
  'Borgholm',
  'Borlänge',
  'Borås',
  'Botkyrka',
  'Boxholm',
  'Bromölla',
  'Bräcke',
  'Båstad',
  'Dals-Ed',
  'Danderyd',
  'Degerfors',
  'Dorotea',
  'Eda',
  'Ekerö',
  'Eksjö',
  'Emmaboda',
  'Enköping',
  'Eskilstuna',
  'Eslöv',
  'Fagersta',
  'Falkenberg',
  'Falköping',
  'Falun',
  'Filipstad',
  'Finspång',
  'Flen',
  'Forshaga',
  'Färgelanda',
  'Gagnef',
  'Gislaved',
  'Gnesta',
  'Gnosjö',
  'Gotland',
  'Grums',
  'Grästorp',
  'Gullspång',
  'Gällivare',
  'Gävle',
  'Göteborg',
  'Götene',
  'Habo',
  'Hagfors',
  'Hallsberg',
  'Hallstahammar',
  'Halmstad',
  'Hammarö',
  'Haninge',
  'Haparanda',
  'Heby',
  'Hedemora',
  'Helsingborg',
  'Herrljunga',
  'Hjo',
  'Hofors',
  'Huddinge',
  'Hudiksvall',
  'Hultsfred',
  'Hylte',
  'Håbo',
  'Hällefors',
  'Härjedalen',
  'Härkneholm',
  'Härnösand',
  'Härryda',
  'Hässleholm',
  'Höganäs',
  'Högsby',
  'Hörby',
  'Höör',
  'Jokkmokk',
  'Järfälla',
  'Jönköping',
  'Kalix',
  'Kalmar',
  'Karlsborg',
  'Karlshamn',
  'Karlskoga',
  'Karlskrona',
  'Karlstad',
  'Katrineholm',
  'Kil',
  'Kinda',
  'Kiruna',
  'Klippan',
  'Knivsta',
  'Kramfors',
  'Kristianstad',
  'Kristinehamn',
  'Krokom',
  'Kumla',
  'Kungsbacka',
  'Kungsör',
  'Kungälv',
  'Kävlinge',
  'Köping',
  'Laholm',
  'Landskrona',
  'Laxå',
  'Lekeberg',
  'Leksand',
  'Lerum',
  'Lessebo',
  'Lidingö',
  'Lidköping',
  'Lilla Edet',
  'Lindesberg',
  'Linköping',
  'Ljungby',
  'Ljungsbro',
  'Ljusdal',
  'Ljusnarsberg',
  'Lomma',
  'Ludvika',
  'Luleå',
  'Lund',
  'Lycksele',
  'Lysekil',
  'Malmö',
  'Malung-Sälen',
  'Malå',
  'Mariestad',
  'Mark',
  'Markaryd',
  'Mellerud',
  'Mjölby',
  'Mora',
  'Motala',
  'Mullsjön',
  'Munkedal',
  'Munkfors',
  'Mölndal',
  'Mönsterås',
  'Mörbylånga',
  'Nacka',
  'Nora',
  'Norberg',
  'Nordanstig',
  'Nordmaling',
  'Norrköping',
  'Norrtälje',
  'Norsjö',
  'Nybro',
  'Nykvarn',
  'Nyköping',
  'Nynäshamn',
  'Nässjö',
  'Ockelbo',
  'Olofström',
  'Orsa',
  'Orust',
  'Osby',
  'Oskarshamn',
  'Oxelösund',
  'Pajala',
  'Partille',
  'Perstorp',
  'Piteå',
  'Ragunda',
  'Robertsfors',
  'Ronneby',
  'Rättvik',
  'Sala',
  'Salem',
  'Sandviken',
  'Sigtuna',
  'Simrishamn',
  'Sjöbo',
  'Skara',
  'Skellefteå',
  'Skinnskatteberg',
  'Skurup',
  'Skövde',
  'Smedjebacken',
  'Sollefteå',
  'Sollentuna',
  'Solna',
  'Sorsele',
  'Sotenäs',
  'Staffanstorp',
  'Stenungsund',
  'Stockholm',
  'Storfors',
  'Storuman',
  'Strängnäs',
  'Strömstad',
  'Strömsund',
  'Sundbyberg',
  'Sundsvall',
  'Sunne',
  'Surahammar',
  'Svalöv',
  'Svedala',
  'Svenljunga',
  'Säffle',
  'Säter',
  'Sävsjö',
  'Söderhamn',
  'Söderköping',
  'Södertälje',
  'Sölvesborg',
  'Tanum',
  'Tibro',
  'Tidaholm',
  'Tierp',
  'Timrå',
  'Tingsryd',
  'Tjörn',
  'Tomelilla',
  'Torsby',
  'Torsås',
  'Tranemo',
  'Tranås',
  'Trelleborg',
  'Trollhättan',
  'Trosa',
  'Tyresö',
  'Täby',
  'Töreboda',
  'Uddevalla',
  'Ulricehamn',
  'Umeå',
  'Upplands Väsby',
  'Upplands-Bro',
  'Uppsala',
  'Vadstena',
  'Vaggeryd',
  'Valdemarsvik',
  'Vallentuna',
  'Vansbro',
  'Vara',
  'Varberg',
  'Vaxholm',
  'Vellinge',
  'Vetlanda',
  'Vimmerby',
  'Vindeln',
  'Vingåker',
  'Vårgårda',
  'Vänersborg',
  'Värmdö',
  'Värnamo',
  'Västervik',
  'Västerås',
  'Växjö',
  'Ydre',
  'Ystad',
  'Åmål',
  'Ånge',
  'Åre',
  'Årjäng',
  'Åsele',
  'Åstorp',
  'Åtvidaberg',
  'Älmhult',
  'Älvdalen',
  'Älvkarleby',
  'Älvsbyn',
  'Ängelholm',
  'Öckerö',
  'Ödeshög',
  'Örebro',
  'Örkelljunga',
  'Örnsköldsvik',
  'Östersund',
  'Österåker',
  'Östhammar',
  'Östra Göinge',
  'Överkalix',
  'Övertorneå',
]);
</script>
