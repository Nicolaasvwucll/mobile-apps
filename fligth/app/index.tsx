import React, { useEffect, useState } from 'react';
import { Stack, Link } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';  // We gebruiken deze iconen voor visuele feedback
import { Container } from '~/components/Container';
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

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFlights = async () => {
    try {
      setLoading(true);
      const fetchedFlights = await fetchFlights();  // Verkrijg de vluchten van de API
      if (fetchedFlights.length === 0) {
        setError('Geen vluchten beschikbaar.');
      } else {
        setFlights(fetchedFlights);
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het ophalen van de vluchten.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlights();
  }, []); 

  return (
    <>
      <Stack.Screen options={{ title: 'Vliegtuigen van Zaventem' }} />
      <Container>
        <View style={styles.header}>
          <Text style={styles.title}>Vliegtuigen van Zaventem</Text>
          <Text style={styles.subtitle}>
            Bekijk de laatste vluchtinformatie en blijf op de hoogte van updates!
          </Text>
        </View>

        <View style={styles.content}>
          {/* Laadindicator toevoegen */}
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={40} color="red" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {/* Horizontale scrollable lijst */}
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {flights.length > 0 ? (
                  flights.map((flight, index) => (
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
                      <Text style={styles.statusText}>
                        Status: {flight.live?.is_ground ? 'Grounded' : 'In the air'}
                      </Text>
                      <MaterialCommunityIcons
                        name={flight.live?.is_ground ? 'airplane-takeoff' : 'airplane-landing'}
                        size={40}
                        color={flight.live?.is_ground ? 'red' : 'green'}
                        style={styles.icon}
                      />
                    </View>
                  ))
                ) : (
                  <Text style={styles.noFlightsText}>No flights in the air at the moment.</Text>
                )}
              </ScrollView>
            </ScrollView>
          )}

          <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Bekijk Details</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  scrollContainer: {
    paddingBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginRight: 20,  // Zorg ervoor dat de kaarten naast elkaar staan
    width: 320,  // Zorg ervoor dat de kaarten breed genoeg zijn
    borderRadius: 15,
    elevation: 8,  // Meer schaduw voor diepte
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    color: '#1E90FF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
  noFlightsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  icon: {
    marginTop: 15,
    alignSelf: 'center',
  },
});
