import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back arrow and info icon

const PaymentScreen: React.FC = () => {
    // State for input fields
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    return (
        <View style={styles.container}>
            {/* Header with Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>THANH TOÁN</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Card Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nhập thông tin thẻ</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số thẻ"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tên chủ thẻ"
                        value={cardHolder}
                        onChangeText={setCardHolder}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ngày hết hạn (MM/YY)"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        keyboardType="numeric"
                    />
                    <View style={styles.cvvContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="CVV"
                            value={cvv}
                            onChangeText={setCvv}
                            keyboardType="numeric"
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.infoIcon}>
                            <Ionicons name="information-circle-outline" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Customer Information Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                        <TouchableOpacity>
                            <Text style={styles.editText}>chỉnh sửa</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.infoText}>Trần Minh Trí</Text>
                    <Text style={styles.infoText}>tranminhtri@gmail.com</Text>
                    <Text style={styles.infoText}>60 Lăng Hà, Bà Điểm, Hóc Môn</Text>
                    <Text style={styles.infoText}>0123456789</Text>
                </View>

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
                        <TouchableOpacity>
                            <Text style={styles.editText}>chỉnh sửa</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.infoText}>Giao hàng Nhanh - 15.000đ</Text>
                    <Text style={styles.conditionText}>(Dự kiến giao hàng 5-7/9)</Text>
                </View>

                {/* Payment Summary */}
                <View style={styles.section}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tạm tính</Text>
                        <Text style={styles.summaryValue}>500.000đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                        <Text style={styles.summaryValue}>15.000đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tổng cộng</Text>
                        <Text style={styles.summaryValue}>515.000đ</Text>
                    </View>
                </View>

                {/* Add some extra padding at the bottom */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Continue Button - Fixed at bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.buttonText}>TIẾP TỤC</Text>
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    editText: {
        color: '#007bff',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    cvvContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginLeft: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    conditionText: {
        fontSize: 12,
        color: '#666',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#333',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    continueButton: {
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

export default PaymentScreen;