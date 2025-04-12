import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    HomeScreen: undefined;
    NotificationScreen: { orderId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "NotificationScreen">;

interface Notification {
    id: string;
    title: string;
    subtitle: string;
    detail: string;
    date: string;
    image: string;
}

const NotificationListScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
            const notificationList: Notification[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];
            setNotifications(notificationList);
        });

        return () => unsubscribe();
    }, []);

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={styles.notificationContent}
        >
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.notificationItem}>
                <View style={styles.contentWrapper}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.notificationImage}
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.notificationDetail}>{item.detail}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>THÔNG BÁO</Text>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    listContainer: {
        paddingHorizontal: 15,
    },
    notificationContent: {
        marginVertical: 10,
    },
    date: {
        fontSize: 14,
        color: '#28a745',
        marginBottom: 5,
    },
    notificationItem: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    notificationSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    notificationDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default NotificationListScreen;