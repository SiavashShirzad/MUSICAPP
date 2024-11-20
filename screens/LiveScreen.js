import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';

export default function LiveScreen() {
  const [movingAvg, setMovingAvg] = useState([]); // Moving average data
  const [RI, setRI] = useState(0); // Resistive Index
  const [PI, setPI] = useState(0); // Pulsatility Index
  const [PSV, setPSV] = useState(0); // Peak Systolic Velocity
  const [EDV, setEDV] = useState(0); // End Diastolic Velocity
  const [meanVelocity, setMeanVelocity] = useState(0); // Mean Velocity
  const [isConnected, setIsConnected] = useState(false); // Database connection status
  const [windowStart, setWindowStart] = useState(0); // Chart start index
  const [userInteracting, setUserInteracting] = useState(false); // Track user interaction
  const windowSize = 100; // Fixed window size for the chart

  useEffect(() => {
    const dbRef = ref(database, 'waveformData');

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const { moving_avg = [], RI = 0, PI = 0, PSV = 0, EDV = 0, mean_velocity = 0 } = data;

          // Update movingAvg and other state variables
          setMovingAvg((prev) => {
            const updatedData = [...prev, ...moving_avg].slice(-200); // Keep the last 200 points
            if (!userInteracting) {
              // Dynamically update windowStart to center the latest data
              setWindowStart(Math.max(0, updatedData.length - Math.floor(windowSize / 2)));
            }
            return updatedData;
          });

          setRI(RI);
          setPI(PI);
          setPSV(PSV);
          setEDV(EDV);
          setMeanVelocity(mean_velocity);
          setIsConnected(true);
        }
      },
      () => setIsConnected(false) // Handle disconnection
    );

    return () => unsubscribe();
  }, [userInteracting]);

  const chartData = {
    datasets: [
      {
        data: movingAvg.slice(windowStart, windowStart + windowSize),
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange line
        strokeWidth: 2,
      },
      {
        data: Array(windowSize).fill(meanVelocity), // Mean velocity line from backend
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green line
        strokeWidth: 1,
      },
    ],
  };

  // Determine PSV and EDV indices within the current window
  const PSVIndex = movingAvg.findIndex((val) => val === PSV);
  const EDVIndex = movingAvg.findIndex((val) => val === EDV);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
    onPanResponderGrant: () => setUserInteracting(true),
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0 && windowStart > 0) {
        setWindowStart((prev) => Math.max(0, prev - 1));
      } else if (gestureState.dx < 0 && windowStart + windowSize < movingAvg.length) {
        setWindowStart((prev) => Math.min(prev + 1, movingAvg.length - windowSize));
      }
    },
    onPanResponderRelease: () => setUserInteracting(false),
  });

  return (
    <View style={styles.container}>
      {/* Connection Indicator */}
      <View
        style={[
          styles.connectionIndicator,
          { backgroundColor: isConnected ? 'green' : 'red' },
        ]}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>RI: {RI.toFixed(2)}</Text>
        <Text style={styles.infoText}>PI: {PI.toFixed(2)}</Text>
      </View>
      <View {...panResponder.panHandlers} style={styles.chartContainer}>
        {movingAvg.length > 0 ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withInnerLines={false}
            withHorizontalLines={false}
            withVerticalLines={false}
            decorator={() => {
              const circles = [];
              if (PSVIndex >= windowStart && PSVIndex < windowStart + windowSize) {
                const x = ((PSVIndex - windowStart) / windowSize) * (Dimensions.get('window').width - 40);
                const y = 220 - ((PSV - Math.min(...movingAvg.slice(windowStart, windowStart + windowSize))) /
                  (Math.max(...movingAvg.slice(windowStart, windowStart + windowSize)) -
                    Math.min(...movingAvg.slice(windowStart, windowStart + windowSize)))) * 220;
                circles.push(
                  <View
                    key="psv-circle"
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'red',
                    }}
                  />
                );
              }
              if (EDVIndex >= windowStart && EDVIndex < windowStart + windowSize) {
                const x = ((EDVIndex - windowStart) / windowSize) * (Dimensions.get('window').width - 40);
                const y = 220 - ((EDV - Math.min(...movingAvg.slice(windowStart, windowStart + windowSize))) /
                  (Math.max(...movingAvg.slice(windowStart, windowStart + windowSize)) -
                    Math.min(...movingAvg.slice(windowStart, windowStart + windowSize)))) * 220;
                circles.push(
                  <View
                    key="edv-circle"
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'blue',
                    }}
                  />
                );
              }
              return circles;
            }}
            style={styles.chart}
          />
        ) : null}
      </View>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: () => `rgba(255, 165, 0, 1)`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f5fe',
  },
  connectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01579b',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 10,
    position: 'relative',
  },
});
