import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const shimmerAnim = useRef(new Animated.Value(0)).current
  const dot1Anim = useRef(new Animated.Value(0)).current
  const dot2Anim = useRef(new Animated.Value(0)).current
  const dot3Anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(dot1Anim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2Anim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3Anim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      ),
    ]).start()
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  })

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.cartContainer,
            {
              transform: [{ rotate }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.cart}>
            <View style={styles.cartBody}>
              <View style={styles.cartStripe1} />
              <View style={styles.cartStripe2} />
              <View style={styles.cartStripe3} />
            </View>
            <View style={styles.cartWheels}>
              <View style={[styles.wheel, styles.wheelLeft]} />
              <View style={[styles.wheel, styles.wheelRight]} />
            </View>
            <View style={styles.cartHandle} />
          </View>
          
          <Animated.View
            style={[
              styles.microphoneIcon,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.micTop} />
            <View style={styles.micBottom} />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.title}>BuyVoice</Text>
          <Text style={styles.tagline}>🎙️ Shop with your voice</Text>
        </Animated.View>

        <View style={styles.loadingDotsContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              styles.dot1,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              styles.dot2,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              styles.dot3,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
            opacity: 0.3,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  cart: {
    position: 'relative',
    width: 80,
    height: 60,
  },
  cartBody: {
    width: 80,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cartStripe1: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: '#FFA500',
    top: 10,
  },
  cartStripe2: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: '#FFA500',
    top: 25,
  },
  cartStripe3: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: '#FFA500',
    top: 40,
  },
  cartWheels: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  wheel: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  wheelLeft: {
    marginLeft: 5,
  },
  wheelRight: {
    marginRight: 5,
  },
  cartHandle: {
    position: 'absolute',
    top: 10,
    right: -15,
    width: 30,
    height: 3,
    backgroundColor: '#666',
    transform: [{ rotate: '-30deg' }],
  },
  microphoneIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 24,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#9B59B6',
    overflow: 'hidden',
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  micTop: {
    width: '100%',
    height: '60%',
    backgroundColor: '#8E44AD',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  micBottom: {
    width: '100%',
    height: '40%',
    backgroundColor: '#9B59B6',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498DB',
    marginHorizontal: 6,
  },
  dot1: {
    backgroundColor: '#FFD700',
  },
  dot2: {
    backgroundColor: '#9B59B6',
  },
  dot3: {
    backgroundColor: '#3498DB',
  },
  shimmer: {
    position: 'absolute',
    width: width * 0.3,
    height: height,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
})

export default LoadingScreen