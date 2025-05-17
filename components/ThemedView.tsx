import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView(props: ThemedViewProps) {
  return (
    <View 
      {...props} 
      style={[
        { backgroundColor: '#181818' },
        props.style
      ]} 
    />
  );
}
