import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setShippingInfo, clearShippingInfo } from '../store/shippingSlice';
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

type RootParamList = {
    app: undefined;
    Payment: { selectedItems: CartItem[] };
};

type NavigationProp = StackNavigationProp<RootParamList, 'Payment'>;

interface CartItem {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
    checked: boolean;
    categoryId: string;
    productId: string;
}

const PaymentScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<any>();
    const selectedItems: CartItem[] = route.params?.selectedItems || [];
    const dispatch = useDispatch();
    const shippingInfo = useSelector((state: RootState) => state.shipping);

    const [name, setName] = useState(shippingInfo.name || "");
    const [email, setEmail] = useState(shippingInfo.email || "");
    const [address, setAddress] = useState(shippingInfo.address || "");
    const [phone, setPhone] = useState(shippingInfo.phone || "");
    const [shippingMethod, setShippingMethod] = useState(shippingInfo.shippingMethod || "Giao hàng Nhanh - 15.000đ");
    const [paymentMethod, setPaymentMethod] = useState(shippingInfo.paymentMethod || "Thẻ VISA/MASTERCARD");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === "Giao hàng Nhanh - 15.000đ" ? 15000 : 20000;
    const total = subtotal + shippingCost;

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPhone = (phone: string) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    const sendOrderNotification = async () => {
        try {
            const orderDetails = selectedItems.map(item =>
                `${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString()}đ`
            ).join("\n");

            const notification = {
                title: "Đặt hàng thành công",
                subtitle: `Đặt hàng ngày ${new Date().toLocaleDateString('vi-VN')}`,
                detail: orderDetails,
                date: new Date().toLocaleString('vi-VN'),
                image: selectedItems[0]?.image || "",
            };

            await addDoc(collection(db, "notifications"), notification);
            console.log("Order notification sent successfully");
        } catch (error) {
            console.error("Error sending notification:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên đầy đủ họ tên");
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ");
            return;
        }
        if (!address.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập địa chỉ");
            return;
        }
        if (!isValidPhone(phone)) {
            Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số)");
            return;
        }

        dispatch(setShippingInfo({
            name,
            email,
            address,
            phone,
            shippingMethod,
            paymentMethod,
        }));

        setIsSubmitting(true);

        const orderData = {
            customer: { name, email, address, phone },
            items: selectedItems.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            shippingMethod,
            paymentMethod,
            subtotal,
            shippingCost,
            total,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch("https://67e5137018194932a584633a.mockapi.io/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            await response.json();
            await sendOrderNotification();
            Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
            navigation.navigate("app");
        } catch (error) {
            console.error("Error processing order:", error);
            Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSubmitting}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold" }}>THANH TOÁN</Text>
            </View>

            <FlatList
                data={selectedItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text>{item.name} (x{item.quantity})</Text>
                        <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
                    </View>
                )}
                style={{ maxHeight: 150 }}
            />

            <Text style={{ fontWeight: "bold", marginBottom: 8, marginTop: 16 }}>Thông tin khách hàng</Text>
            <TextInput
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
                style={{ borderBottomWidth: 1, marginBottom: 8, padding: 8 }}
                editable={!isSubmitting}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderBottomWidth: 1, marginBottom: 8, padding: 8 }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
            />
            <TextInput
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                style={{ borderBottomWidth: 1, marginBottom: 8, padding: 8 }}
                editable={!isSubmitting}
            />
            <TextInput
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
                keyboardType="phone-pad"
                editable={!isSubmitting}
            />

            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Phương thức vận chuyển</Text>
            <TouchableOpacity
                onPress={() => !isSubmitting && setShippingMethod("Giao hàng Nhanh - 15.000đ")}
                style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}
            >
                <Text>Giao hàng Nhanh - 15.000đ</Text>
                {shippingMethod === "Giao hàng Nhanh - 15.000đ" && <Icon name="check" size={20} color="green" />}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => !isSubmitting && setShippingMethod("Giao hàng COD - 20.000đ")}
                style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}
            >
                <Text>Giao hàng COD - 20.000đ</Text>
                {shippingMethod === "Giao hàng COD - 20.000đ" && <Icon name="check" size={20} color="green" />}
            </TouchableOpacity>

            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Hình thức thanh toán</Text>
            <TouchableOpacity
                onPress={() => !isSubmitting && setPaymentMethod("Thẻ VISA/MASTERCARD")}
                style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}
            >
                <Text>Thẻ VISA/MASTERCARD</Text>
                {paymentMethod === "Thẻ VISA/MASTERCARD" && <Icon name="check" size={20} color="green" />}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => !isSubmitting && setPaymentMethod("Thẻ ATM")}
                style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}
            >
                <Text>Thẻ ATM</Text>
                {paymentMethod === "Thẻ ATM" && <Icon name="check" size={20} color="green" />}
            </TouchableOpacity>

            <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "gray" }}>Tạm tính</Text>
                    <Text style={{ fontWeight: "bold" }}>{subtotal.toLocaleString()}đ</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "gray" }}>Phí vận chuyển</Text>
                    <Text style={{ fontWeight: "bold" }}>{shippingCost.toLocaleString()}đ</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontWeight: "bold" }}>Tổng cộng</Text>
                    <Text style={{ fontWeight: "bold", color: "green" }}>{total.toLocaleString()}đ</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    backgroundColor: "green",
                    padding: 14,
                    borderRadius: 8,
                    marginTop: 16,
                    alignItems: "center",
                    opacity: isSubmitting ? 0.7 : 1
                }}
                disabled={isSubmitting}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                    {isSubmitting ? "ĐANG XỬ LÝ..." : "TIẾP TỤC"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaymentScreen;