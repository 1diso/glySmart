import { Text, TextProps } from 'react-native-paper';

export function ThemedText(props: TextProps<any>) {
  return <Text {...props} style={[{ color: '#fff' }, props.style]} />;
}
