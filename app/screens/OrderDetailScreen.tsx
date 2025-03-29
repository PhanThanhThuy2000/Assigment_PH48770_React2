import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
    HomeScreen: undefined;
    PlantCareS: undefined;
    OrderDetailScreen: { orderId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "OrderDetailScreen">;

interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    shippingMethod: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: "pending" | "success" | "canceled";
    createdAt: string;
}

const OrderDetailScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<any>();
    const orderId = route.params?.orderId;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://67e5137018194932a584633a.mockapi.io/orders/${orderId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch order details");
            }
            const data: Order = await response.json();
            setOrder(data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        return formattedDate;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>Không tìm thấy thông tin đơn hàng</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>CHI TIẾT ĐƠN HÀNG</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Order Status */}
            <Text style={[styles.statusText, {
                color: order.status === "success" ? "green" : order.status === "canceled" ? "red" : "orange"
            }]}>
                {order.status === "success"
                    ? "Bạn đã đặt hàng thành công"
                    : order.status === "canceled"
                        ? "Đơn hàng đã bị hủy"
                        : "Đơn hàng đang xử lý"}
            </Text>
            <Text style={styles.statusDate}>{formatDate(order.createdAt)}</Text>

            {/* Customer Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                <Text style={styles.sectionText}>{order.customer.name}</Text>
                <Text style={styles.sectionText}>{order.customer.email}</Text>
                <Text style={styles.sectionText}>{order.customer.address}</Text>
                <Text style={styles.sectionText}>{order.customer.phone}</Text>
            </View>

            {/* Shipping Method */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
                <Text style={styles.sectionText}>{order.shippingMethod}</Text>
                <Text style={styles.sectionText}>(Dự kiến giao hàng 5-7 ngày)</Text>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
                <Text style={styles.sectionText}>{order.paymentMethod}</Text>
            </View>

            {/* Order Items */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
                {order.items.map((item) => (
                    <View key={item.productId} style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.name} (x{item.quantity})</Text>
                        <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.section}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tạm tính:</Text>
                    <Text style={styles.totalValue}>{order.subtotal.toLocaleString()}đ</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.totalValue}>{order.shippingCost.toLocaleString()}đ</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalPrice}>{order.total.toLocaleString()}đ</Text>
                </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
                style={styles.guideButton}
                onPress={() => navigation.navigate("PlantCareS")}
            >
                <Text style={styles.guideButtonText}>Xem Cẩm nang trồng cây</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("HomeScreen")}
            >
                <Text style={styles.backButtonText}>Quay về Trang chủ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
    },
    backButtonContainer: {
        padding: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    statusText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    statusDate: {
        textAlign: "center",
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    section: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 10,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    sectionText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    itemText: {
        fontSize: 14,
        color: "#666",
    },
    itemPrice: {
        fontSize: 14,
        color: "#666",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 14,
        color: "#666",
    },
    totalValue: {
        fontSize: 14,
        color: "#666",
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    guideButton: {
        backgroundColor: "green",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    guideButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    backButton: {
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5,
        backgroundColor: "#ddd",
    },
    backButtonText: {
        color: "black",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default OrderDetailScreen;