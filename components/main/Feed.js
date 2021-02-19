import React from 'react'
import { StyleSheet, View, Text, StatusBar, Platform } from 'react-native'

export default function Feed() {
    return (
        <View style={styles.container}>
            <Text>Feed</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})