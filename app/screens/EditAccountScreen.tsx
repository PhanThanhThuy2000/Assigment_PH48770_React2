import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back arrow icon

const EditInfoScreen: React.FC = () => {
    // State for input fields
    const [name, setName] = useState('Trần Minh Trí');
    const [email, setEmail] = useState('tranminhtri@gmail.com');
    const [address, setAddress] = useState('60 Lăng Hà, Bà Điểm, Hóc Môn');
    const [phone, setPhone] = useState('0123456789');

    return (
        <View style={styles.container}>
            {/* Header with Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CHỈNH SỬA THÔNG TIN</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://s3-alpha-sig.figma.com/img/eae3/13a4/8883a46e7a2a60ee806e73a8052191be?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oLnaYogC0ug-teGmWxQ-IewlflZprHgKhJv6dry47FsDGQZ~Srnp-bia~aWijx77Yip2YXB2Kb38I5ponmDtj4mYNqYn6itr2nipVJOanyFNxMVZ~ZoHtBzHxD76fOQDCs1lz7ZKiKOTAQu00yhKWkTQXv4ej569fgUed2SvSbnoFOHzoNuyT7LIQ07riKiNecoZFWTT0Ktmhi8d4ShYoaQvSPuRMzSN~mQ~Pbi2HKbmZyn5dZ18Mx-3om-UDVat2mP9aB5yi1sA9eKzNs4epFO99IcuGQkdZLSjvq3NATuAehGuQ8VTLuV7Rtop6cPKqBAxQN1cE70l61S9t0oS9g__' }} // Placeholder for the checkered avatar
                        style={styles.avatar}
                    />
                </View>

                {/* Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Thông tin sẽ được lưu cho lần mua kế tiếp. Bấm vào thông tin chi tiết để chỉnh sửa.
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Extra padding at the bottom to avoid overlap with the button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button - Fixed at Bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.buttonText}>LƯU THÔNG TIN</Text>
                </TouchableOpacity>
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
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40, // Circular avatar
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditInfoScreen;