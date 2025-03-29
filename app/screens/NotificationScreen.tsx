import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng icon từ Expo

const NotificationScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={styles.title}>THÔNG BÁO</Text>

            {/* Nội dung thông báo */}
            <View style={styles.notificationContainer}>
                <Text style={styles.date}>Thứ tư, 03/09/2021</Text>
                <View style={styles.notificationContent}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/80' }} // Thay bằng URL hình ảnh thực tế
                        style={styles.plantImage}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationTitle}>Đặt hàng thành công</Text>
                        <Text style={styles.notificationSubtitle}>Spider Plant | Lớn</Text>
                        <Text style={styles.notificationDetail}>2 sản phẩm</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    notificationContainer: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    date: {
        fontSize: 14,
        color: '#28a745', // Màu xanh lá giống trong hình
        marginBottom: 10,
    },
    notificationContent: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    plantImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 10,
        justifyContent: 'center',
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

export default NotificationScreen;