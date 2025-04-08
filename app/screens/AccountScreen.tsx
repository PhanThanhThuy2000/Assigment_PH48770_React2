import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import axios from 'axios';
import { setLoginInfo } from '../store/authSlice';

type RootParamList = {
    EditAccount: undefined;
    Account: undefined;
    QA: undefined;
    PlantCareS: undefined;
    TransactionHistoryS: undefined;
    Login: undefined;
};
type AccountScreenNavigationProp = StackNavigationProp<RootParamList, 'Account'>;

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

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<AccountScreenNavigationProp>();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    // Lấy thông tin từ Redux store
    const { name, email, password } = useSelector((state: RootState) => ({
        name: state.auth.name || 'Phan Thanh Thủy',
        email: state.auth.email || 'Thuy@gmail.com',
        password: state.auth.password || '123456',
    }));

    // State để quản lý thông tin người dùng và ảnh
    const [editablename, setEditablename] = useState(name);
    const [editableEmail, setEditableEmail] = useState(email);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    const userId = '1'; // Hardcoded user ID
    const infoId = '1'; // Hardcoded info ID

    // API endpoints
    const BASE_URL = 'https://67e5137018194932a584633a.mockapi.io';
    const USER_API = `${BASE_URL}/users/${userId}`;
    const INFO_API = `${BASE_URL}/users/${userId}/information/${infoId}`;

    // Làm mới dữ liệu khi màn hình được focus
    useEffect(() => {
        if (isFocused) {
            const fetchData = async () => {
                try {
                    // Fetch user data
                    const userResponse = await axios.get(USER_API);
                    const userData: User = userResponse.data;
                    setEditablename(userData.name);
                    setEditableEmail(userData.email);

                    // Fetch information data
                    const infoResponse = await axios.get(INFO_API);
                    const infoData: Information = infoResponse.data;
                    setAvatarUri(infoData.avatarUri);

                    // Cập nhật Redux store
                    dispatch(setLoginInfo({
                        email: userData.email,
                        password: userData.password || password,
                        name: userData.name,
                    }));
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [isFocused, dispatch, password]);

    // Đồng bộ state với Redux khi thông tin trong store thay đổi
    useEffect(() => {
        setEditablename(name);
        setEditableEmail(email);
    }, [name, email]);

    // Hàm chọn ảnh từ camera hoặc thư viện
    const pickImage = async (fromCamera: boolean) => {
        const permissionResult = fromCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Quyền truy cập bị từ chối!');
            return;
        }

        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newAvatarUri = result.assets[0].uri;
            setAvatarUri(newAvatarUri);

            // Cập nhật avatarUri vào API
            try {
                const updatedInfo: Information = {
                    id: infoId,
                    userId,
                    address: '',
                    phone: '',
                    avatarUri: newAvatarUri,
                };
                await axios.put(INFO_API, updatedInfo);
            } catch (error) {
                console.error('Error updating avatar:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PROFILE</Text>
            </View>
            <View style={styles.profileInfo}>
                <TouchableOpacity onPress={() => pickImage(false)}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatar} />
                    )}
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{editablename}</Text>
                    <Text style={styles.userEmail}>{editableEmail}</Text>
                </View>
            </View>
            <View style={styles.menuOptions}>
                <TouchableOpacity onPress={() => navigation.navigate("EditAccount")} style={styles.menuItem}>
                    <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("PlantCareS")} style={styles.menuItem}>
                    <Text style={styles.menuText}>Câu hỏi thường gặp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("TransactionHistoryS")} style={styles.menuItem}>
                    <Text style={styles.menuText}>Lịch sử giao dịch</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("QA")} style={styles.menuItem}>
                    <Text style={styles.menuText}>Q & A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Bộ mật và Điều khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Điều khoản và điều kiện</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Chính sách quyền riêng tư</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text onPress={() => navigation.navigate("Login")} style={[styles.menuText, styles.logout]}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f8f8f8',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
        borderRadius: 25,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    menuOptions: {
        flex: 1,
        paddingHorizontal: 20,
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    menuText: {
        fontSize: 16,
    },
    logout: {
        color: 'red',
    },
});

export default ProfileScreen;