import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WeekNavigator = ({ weekRange, onPrevWeek, onNextWeek, isCurrentWeek }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevWeek} style={styles.arrowButton}>
        <Ionicons name="chevron-back" size={24} color="#8B5CF6" />
      </TouchableOpacity>

      <View style={styles.weekInfo}>
        <Text style={styles.weekText}>{weekRange}</Text>
        {isCurrentWeek && (
          <Text style={styles.currentWeekBadge}>Semana actual</Text>
        )}
      </View>

      <TouchableOpacity onPress={onNextWeek} style={styles.arrowButton}>
        <Ionicons name="chevron-forward" size={24} color="#8B5CF6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  arrowButton: {
    padding: 4,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  currentWeekBadge: {
    fontSize: 11,
    color: '#8B5CF6',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default WeekNavigator;
