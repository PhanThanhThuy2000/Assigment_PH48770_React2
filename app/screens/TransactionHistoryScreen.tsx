import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootParamList = {
    OrderDetailScreen: { orderId: string };
    TransactionHistoryS: undefined;
};

type AccountScreenNavigationProp = StackNavigationProp<RootParamList, "TransactionHistoryS">;

interface Item {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string; // imageUrl sẽ được thêm từ bảng products
}

interface Transaction {
    id: string;
    date: string;
    status: "pending" | "success" | "canceled";
    items: Item[];
    createdAt: string;
}

interface Product {
    id: string; // Tương ứng với productId trong orders
    name: string;
    image: string; // Trường chứa URL ảnh trong bảng products
    price: number;
}

const TransactionHistoryScreen: React.FC = () => {
    const navigation = useNavigation<AccountScreenNavigationProp>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            // Fetch danh sách orders
            const ordersResponse = await fetch("https://67e5137018194932a584633a.mockapi.io/orders");
            if (!ordersResponse.ok) {
                throw new Error("Failed to fetch orders");
            }
            const ordersData: Transaction[] = await ordersResponse.json();

            // Fetch danh sách products
            const productsResponse = await fetch("https://67e5137018194932a584633a.mockapi.io/products");
            if (!productsResponse.ok) {
                throw new Error("Failed to fetch products");
            }
            const productsData: Product[] = await productsResponse.json();

            // Tạo map từ productId sang image
            const productImageMap = productsData.reduce((map, product) => {
                map[product.id] = product.image;
                return map;
            }, {} as { [key: string]: string });

            // Gắn imageUrl vào items dựa trên productId
            const sortedData = ordersData
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(transaction => ({
                    ...transaction,
                    items: transaction.items.map(item => ({
                        ...item,
                        imageUrl: productImageMap[item.productId] , // Fallback image
                    })),
                }));

            setTransactions(sortedData);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        const day = weekdays[date.getDay()];
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        return `${day}, ${formattedDate}`;
    };

    const getDisplayItem = (items: Item[]) => {
        const firstItem = items[0];
        return {
            productName: firstItem.name,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            imageUrl: firstItem.imageUrl, // Lấy imageUrl từ item đầu tiên
        };
    };

    const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
        const displayItem = getDisplayItem(item.items);
        const formattedDate = formatDate(item.createdAt);

        return (
            <View>
                {(index === 0 || formatDate(transactions[index - 1].createdAt) !== formattedDate) && (
                    <Text style={styles.dateText}>{formattedDate}</Text>
                )}
                <TouchableOpacity onPress={() => navigation.navigate("OrderDetailScreen", { orderId: item.id })}>
                    <View style={styles.card}>
                        <Image
                            source={{ uri: displayItem.imageUrl, cache: "force-cache" }}
                            style={styles.image}
                            // defaultSource={require("../assets/fallback-image.png")} // Đảm bảo có file này trong assets
                            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
                        />
                        <View style={styles.infoContainer}>
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            item.status === "success" ? "green" : item.status === "canceled" ? "red" : "orange",
                                    },
                                ]}
                            >
                                {item.status === "success"
                                    ? "Đặt hàng thành công"
                                    : item.status === "canceled"
                                        ? "Đã hủy đơn hàng"
                                        : "Đang xử lý"}
                            </Text>
                            <Text style={styles.productText}>{displayItem.productName}</Text>
                            <Text style={styles.quantityText}>{`${displayItem.quantity} sản phẩm`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>LỊCH SỬ GIAO DỊCH</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
                    </View>
                }
            />
        </View>
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
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    dateText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        backgroundColor: "#e0e0e0", // Placeholder khi ảnh chưa load
    },
    infoContainer: {
        marginLeft: 10,
        flex: 1,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    productText: {
        fontSize: 14,
        color: "#666",
    },
    quantityText: {
        fontSize: 12,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
});

export default TransactionHistoryScreen;