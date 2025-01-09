import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Toast from 'react-native-simple-toast';

export default function FavoritesScreen({ route }) {
  const [favorites, setFavorites] = useState([]);
    console.log(favorites)
  // get favorites data from AsyncStorage
  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem('favorites');
      setFavorites(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  };

  // Use effect to load favorites when screen is mounted
  useEffect(() => {
    loadFavorites();
  }, []);

  // Function to delete a favorite
  const deleteFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter((item) => item.id !== id);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites); 
      Toast.show('Delete from Favorites!');
    } catch (error) {
      console.error('Error deleting favorite', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description || 'No description'}</Text>
       <Text style={styles.date}>
                Created: {formatDistanceToNow(parseISO(item.created_at))} ago
              </Text>
              <Text style={styles.date}>
                Updated: {formatDistanceToNow(parseISO(item.updated_at))} ago
              </Text>
      <TouchableOpacity onPress={() => deleteFavorite(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    position: 'relative', // To position delete button
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
});
