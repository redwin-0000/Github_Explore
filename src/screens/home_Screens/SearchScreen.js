import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fetchRepositories } from '../../services/githubAPI';
import { useTheme } from '../../context/ThemeContext';
import { useNetworkStatus } from '../../services/NetInfo';
import NoInternet from '../../components/NoInternet';

let debounceTimer;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();
  const isConnected = useNetworkStatus();

  // Load favorites from AsyncStorage on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      } catch (error) {
        console.error('Error loading favorites', error);
      }
    };
    loadFavorites();
  }, []);

  // Handle search with debouncing
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setRepositories([]); // Clear results when query is empty
      return;
    }

    setLoading(true);

    try {
      const data = await fetchRepositories(searchQuery);
      setRepositories(data.items || []); // Update repositories
    } catch (error) {
      console.error('Error fetching repositories', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearchInputChange = (text) => {
    setQuery(text);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer
    debounceTimer = setTimeout(() => {
      handleSearch(text); // Trigger the search after delay
    }, 500); // Adjust the delay as needed (500ms is common)
  };

  // Add or remove repository from favorites
  const toggleFavorite = async (repo) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === repo.id)) {
      // Remove from favorites
      updatedFavorites = favorites.filter((fav) => fav.id !== repo.id);
      Toast.show('Removed from Favorites!');
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, repo];
      Toast.show('Added to Favorites!');
    }
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error updating favorites', error);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);

    return (
      <TouchableOpacity onPress={() => navigation.navigate('Details', { repo: item, isDarkMode })}>
        <View style={[styles.repoCard, isDarkMode && styles.repoCardDark]}>
          <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
          <View>
            <Text style={[styles.repoName, isDarkMode && styles.repoNameDark]}>{item.name}</Text>
            <Text style={[styles.repoDescription, isDarkMode && styles.repoDescriptionDark]}>
              {item.description || 'No description'}
            </Text>
            <Text style={[styles.date, isDarkMode && styles.dateDark]}>
              Created: {formatDistanceToNow(parseISO(item.created_at))} ago
            </Text>
            <Text style={[styles.date, isDarkMode && styles.dateDark]}>
              Updated: {formatDistanceToNow(parseISO(item.updated_at))} ago
            </Text>
            <View style={styles.favourites}>
              <Text>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Image
                  source={
                    isFavorite
                      ? require('../../assests/star.png')
                      : require('../../assests/starOne.png')
                  }
                  style={styles.favImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.textInputDiv}>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          placeholder="Search Repositories"
          placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
          value={query}
          onChangeText={onSearchInputChange} // Listen for input changes
        />
        <TouchableOpacity onPress={() => navigation.navigate('FavoritesScreen')}>
          <Image
            source={require('../../assests/favorite.png')}
            style={styles.favImg1}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, isDarkMode && styles.toggleTextDark]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={styles.loader} />
      ) : (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      {!isConnected && <NoInternet />}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    width: '90%',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
  },
  toggleTextDark: {
    color: '#ccc',
  },
  repoCard: {
    flexDirection: 'column',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  repoCardDark: {
    backgroundColor: '#1e1e1e',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
  repoName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  repoNameDark: {
    color: '#fff',
  },
  repoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
  repoDescriptionDark: {
    color: '#aaa',
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    textAlign: 'left',
  },
  dateDark: {
    color: '#ccc',
  },
  loader: {
    marginTop: 20,
  },
  saveButton: {
    padding: 10,
  },
  saveButtonDark: {
    backgroundColor: '#444',
  },
  favourites: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  favImg: {
    width: 20,
    height: 20,
    left:100,
  },
  textInputDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favImg1: {
    width: 30,
    height: 30,
    top: -7,
    left: 5,
  },
});
