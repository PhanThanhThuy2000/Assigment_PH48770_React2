import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
type RootParamList = {
    EditAccount: undefined;
    Account: undefined;
    QA: undefined;
    PlantCareS: undefined;
    TransactionHistoryS: undefined;
    Login: undefined;
};
type AccountScreenNavigationProp = StackNavigationProp<RootParamList, 'Account'>;
const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<AccountScreenNavigationProp>();
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PROFILE</Text>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
                <View style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Phan Thanh Thủy</Text>
                    <Text style={styles.userEmail}>Thuy@gmail.com</Text>
                </View>
            </View>

            {/* Menu Options */}
            <View style={styles.menuOptions}>
                <TouchableOpacity onPress={() => navigation.navigate("EditAccount")}  style={styles.menuItem}>
                    <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("PlantCareS")}  style={styles.menuItem}>
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
                    <Text onPress={() => navigation.navigate("Login")} style={[styles.menuText, styles.logout]}>Đăng xuất</Text>
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
    headerText: {
        fontSize: 16,
        color: '#333',
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
    userName: {
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
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f8f8f8',
    },
    navItem: {
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 24,
    },
    activeNav: {
        color: '#007bff',
    },
});

export default ProfileScreen;