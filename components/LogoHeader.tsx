import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function LogoHeader() {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 10,
  },
}); 