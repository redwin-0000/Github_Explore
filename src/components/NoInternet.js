import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function NoInternet() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
    textAlign: 'center',
  },
});
