import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setLoginInfo } from '../store/authSlice';

// Define TypeScript interfaces
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: number;
}

interface Information {
    id: string;
    userId: string;
    address: string;
    phone: string;
    avatarUri: string;
}

const EditInfoScreen: React.FC = () => {
    const dispatch = useDispatch();

    // State for input fields
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [avatarUri, setAvatarUri] = useState<string>('');

    const userId = '1'; // Hardcoded user ID
    const infoId = '1'; // Hardcoded info ID

    // API endpoints
    const BASE_URL = 'https://67e5137018194932a584633a.mockapi.io';
    const USER_API = `${BASE_URL}/users/${userId}`;
    const INFO_API = `${BASE_URL}/users/${userId}/information/${infoId}`;

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching user data from:', USER_API);
                const userResponse = await axios.get(USER_API);
                const userData: User = userResponse.data;
                setName(userData.name);
                setEmail(userData.email);

                console.log('Fetching information data from:', INFO_API);
                const infoResponse = await axios.get(INFO_API);
                const infoData: Information = infoResponse.data;
                setAddress(infoData.address);
                setPhone(infoData.phone);
                setAvatarUri(infoData.avatarUri);
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
            }
        };

        fetchData();
    }, []);

    // Request permission and pick image
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để chọn ảnh!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            setAvatarUri(selectedImageUri);
            console.log('Selected image URI:', selectedImageUri);
        } else {
            console.log('Image picking canceled');
        }
    };

    // Handle saving updated information
    const handleSave = async () => {
        console.log('handleSave triggered');

        if (!name || !email || !address || !phone) {
            console.log('Validation failed:', { name, email, address, phone });
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const userResponse = await axios.get(USER_API);
            const userData: User = userResponse.data;
            const password = userData.password; // Lấy password hiện tại từ API

            // Update user data
            const updatedUser: User = {
                id: userId,
                name,
                email,
                password, // Giữ nguyên password
                role: 1,
            };
            await axios.put(USER_API, updatedUser);

            // Update information data
            const updatedInfo: Information = {
                id: infoId,
                userId,
                address,
                phone,
                avatarUri,
            };
            await axios.put(INFO_API, updatedInfo);

            // Cập nhật Redux store
            dispatch(setLoginInfo({
                email,
                password,
                name,
            }));

            Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
        } catch (error: any) {
            console.error('Error saving data:', error.message, error.response?.data);
            Alert.alert('Lỗi', `Không thể lưu thông tin: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CHỈNH SỬA THÔNG TIN</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: avatarUri || 'https://via.placeholder.com/80' }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIcon}>
                            <Ionicons name="camera" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
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
                        placeholder="Tên"
                    />
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder="Email"
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Địa chỉ"
                    />
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="Số điện thoại"
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
        paddingTop: 40,
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
        borderRadius: 40,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#28a745',
        borderRadius: 12,
        padding: 4,
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
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#666',
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