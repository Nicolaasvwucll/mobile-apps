import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import fetchFlights from '~/api/flightApi';

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
  } | null;
}

const FlightCard: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]); // State voor het opslaan van vluchtgegevens
  const [loading, setLoading] = useState<boolean>(true); // State voor het volgen van de laadstatus
  const [error, setError] = useState<string | null>(null); // State voor foutmeldingen

  // Gebruik useEffect om de fetchFlights functie aan te roepen wanneer de component wordt geladen
  useEffect(() => {
    const getFlights = async () => {
      try {
        setLoading(true); // Zet loading op true bij het starten van de API-aanroep
        const fetchedFlights = await fetchFlights();
        setFlights(fetchedFlights); // Sla de opgehaalde vluchten op in de state
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van de vluchten.'); // Zet foutmelding als er iets misgaat
      } finally {
        setLoading(false); // Zet loading op false nadat de API-aanroep is voltooid
      }
    };

    getFlights();
  }, []); // Lege afhankelijkheden array betekent dat deze effect alleen bij de eerste render wordt uitgevoerd

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {flights.length > 0 ? (
        flights.map((flight, index) => (
          // Controleer eerst of live niet null is en of de vlucht niet op de grond is
          flight.live && !flight.live.is_ground && (
            <View key={index} style={styles.card}>
              <Text style={styles.text}>
                {flight.airline.name} flight {flight.flight.iata}
              </Text>
              <Text style={styles.text}>
                From: {flight.departure.airport} ({flight.departure.iata})
              </Text>
              <Text style={styles.text}>
                To: {flight.arrival.airport} ({flight.arrival.iata})
              </Text>
            </View>
          )
        ))
      ) : (
        <Text>No flights in the air at the moment.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default FlightCard;
