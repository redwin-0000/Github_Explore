import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const InitialScreens = ({navigation}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            // navigation.navigate('FavoritesScreen');
            navigation.navigate('SearchScreen');
        }, 5000);

        return () => clearTimeout(timer);
    }, [fadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" translucent={true} />
            <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
               <View style={styles.image}>
                <Animated.Text style={styles.text}>GitHub Explore App</Animated.Text>
               </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor:'#000',
    },
    animatedView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#c1c1c1',
        borderRadius:200,
        width:width - 80,
        height:height - 400,
    },
    logo: {
        width: 200,
        height: 200,
    },
    text:{
        fontSize:30,
        marginTop:40,
    },
    image:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-70,
    },
});

export default InitialScreens;
