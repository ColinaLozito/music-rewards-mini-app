import { View, Text } from 'react-native';
import { styles } from './AchievementBadge.styles';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
}

export const AchievementBadge = ({ icon, title, description }: AchievementBadgeProps) => (
  <View style={styles.badge}>
    <Text style={styles.icon}>{icon}</Text>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);
