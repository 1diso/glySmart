import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface ParallaxScrollViewProps extends ScrollViewProps {
  headerImage?: any;
  title?: string;
}

export function ParallaxScrollView({ headerImage, title, children, ...props }: ParallaxScrollViewProps) {
  return (
    <ScrollView {...props}>
      {headerImage && (
        <View style={styles.headerContainer}>
          {headerImage}
        </View>
      )}
      {title && (
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 200,
    overflow: 'hidden',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#181818',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    backgroundColor: '#181818',
  },
});
