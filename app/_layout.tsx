import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Cargando fuentes...</Text>;
  }

  if (error) {
    console.error('Error al cargar fuentes:', error);
    return <Text>Error al cargar la aplicación</Text>;
  }

  return (
    <PaperProvider theme={MD3LightTheme}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'No encontrado' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </PaperProvider>
  );
}
