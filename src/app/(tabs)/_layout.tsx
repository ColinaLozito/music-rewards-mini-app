// Tab layout for main navigation
import { Tabs } from 'expo-router';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { THEME } from '../../theme/theme';
import icons from '../../constants/icons';

const TabIcon = ({ icon }: { icon: number }) => (
  <Image 
    source={icon} 
    style={{ width: 24, height: 24, tintColor: '#FFFFFF' } as StyleProp<ImageStyle>}
  />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.textInverse,
        tabBarInactiveTintColor: THEME.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: THEME.colors.background,
          borderTopColor: THEME.colors.border,
        },
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTintColor: THEME.colors.text.primary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Challenges',
          tabBarIcon: () => <TabIcon icon={icons.home} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <TabIcon icon={icons.profile} />,
          headerShown: false
        }}
      />
    </Tabs>
  );
}