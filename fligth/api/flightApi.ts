import axios from 'axios';

interface Flight {
  airline: {
    name: string;
  };
  flight: {
    iata: string;
  };
  departure: {
    airport: string;
    iata: string;
  };
  arrival: {
    airport: string;
    iata: string;
  };
  live: {
    is_ground: boolean;
  } | null; // De live-gegevens kunnen null zijn
}

interface FlightResponse {
  data: Flight[];  // Correcte locatie van de vluchten in de API-respons
}

const API_KEY = 'fc4eee647b1dd59e7acf29f95ef5860b';

const fetchFlights = async (page: number): Promise<Flight[]> => {
  try {
    const response = await axios.get<FlightResponse>('https://api.aviationstack.com/v1/flights', {
      params: { access_key: API_KEY },
    });

    console.log('API Response:', response);

    const flights = response.data.data;  // Verkrijg de vluchten uit 'data.data'

    if (!flights || !Array.isArray(flights)) {
      console.error('De vluchtgegevens zijn niet goed ontvangen of zijn geen array');
      return [];
    }

    // Filter vluchten die in de lucht zijn (waar live.is_ground false is, en live niet null is)
    const inAirFlights = flights.filter(flight => flight.live && !flight.live.is_ground);
    console.log('Vluchtgegevens in de lucht:', inAirFlights);  // Log de vluchten die in de lucht zijn
    return inAirFlights;
  } catch (error) {
    console.error('Er is een fout opgetreden bij het ophalen van de vluchten:', error);
    return [];  // Retourneer een lege array in geval van een fout
  }
};

export default fetchFlights;
