import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function RepositoryDetails({ route }) {
  if (!route || !route.params || !route.params.repo) {
    return (
      <View style={styles.container}>
        <Text>Error: No repository data provided</Text>
      </View>
    );
  }
  const { repo, isDarkMode } = route.params;
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{repo.name}</Text>
      <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
        {repo.description || 'No description available'}
      </Text>
      <Text style={[styles.stats, isDarkMode && styles.statsDark]}>🌟 Stars: {repo.stargazers_count}</Text>
      <Text style={[styles.stats, isDarkMode && styles.statsDark]}>🍴 Forks: {repo.forks_count}</Text>
      <Text style={[styles.stats, isDarkMode && styles.statsDark]}>📦 Language: {repo.language || 'Not specified'}</Text>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    top: 30,
    // backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  avatar: { 
    width: 80,
    height: 80, 
    borderRadius: 40, 
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionDark: {
    color: '#aaa',
  },
  stats: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 4,
  },
  statsDark: {
    color: '#ccc',
  },
});
