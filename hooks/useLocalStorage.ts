import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  age: number;
  diabetesType?: '1' | '2';
}

export const useLocalStorage = () => {
  const saveUserProfile = async (profile: UserProfile) => {
    await AsyncStorage.setItem('@user_profile', JSON.stringify(profile));
  };

  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }
  };

  return {
    saveUserProfile,
    getUserProfile
  };
}; 