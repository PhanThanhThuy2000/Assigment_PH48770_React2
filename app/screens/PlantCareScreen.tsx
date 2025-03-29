import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back arrow icon
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
type RootParamList = {
    PlantCareS: undefined;
    PlantCareDetail: undefined;
};
type NavigationProp = StackNavigationProp<RootParamList, 'PlantCareS'>;
const PlantCareScreen: React.FC = () => {
            const navigation = useNavigation<NavigationProp>();
    return (
        <View style={styles.container}>
            {/* Header with Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CẮM NĂNG TRỌNG CÂY</Text>
            </View>

            {/* Plant Care Section */}
            <View style={styles.section}>
                <Image
                    source={{ uri: 'https://s3-alpha-sig.figma.com/img/e465/544b/dbf880e99d90cd13caf7e74bfcd1cf13?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=r6PvD5m-w89o5AMFj7AqMQUAcu-vZqFHeXEfZsYC~IFyC7a0ND4VbU-uac45TskC-MattQndprlpwu~egCtT7u9j2AxZX0lCumY3bafhXIM1bLsbKPwYenv5lQkq7JyteDQYK~6DC~W3n0OBt4faoWYjqSf4jTJLKvyVKIHG0fY7EncUa5-wb04nyrRUxITVTyzyfQCxdSesrRvZQfOc1fVZPwqbLo6goikSbstlE7vn8NOkrfU1~tiTBZ8IbGW2yGABWvma6PxvsaUbCHyLdB0XIAychWt8rt5QGrR3XCg1ocjmXv3ZG9bYQVDnw7GQeG0uf-yJrTQOnWVPKJ2Yrw__' }} // Placeholder for the plant image
                    style={styles.plantImage}
                />
                <View style={styles.textContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("PlantCareDetail")}>
                        <Text style={styles.plantName}>Panse Den | Hybrid Dk hồng </Text>
                        <Text >Độ khó: 3/5 </Text>
                    </TouchableOpacity>
                   
                </View>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        paddingTop: 40, // Space for status bar
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        textAlign: 'center',
        flex: 1,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
    },
    plantImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    textContainer: {
        marginLeft: 16,
        flex: 1,
    },
    plantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default PlantCareScreen;