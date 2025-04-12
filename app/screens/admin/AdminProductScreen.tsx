import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Button,
    StyleSheet,
    Alert,
    Image,
} from "react-native";
import axios, { AxiosError } from "axios";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://67e5137018194932a584633a.mockapi.io/products";
const CATEGORY_API_URL = "https://67e5137018194932a584633a.mockapi.io/categories";

type Product = {
    id?: string;
    name: string;
    type: string;
    price: string;
    image: string;
    categoryId: string;
};

type Category = {
    id: string;
    name: string;
};

const AdminProductScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productData, setProductData] = useState<Product>({
        name: "",
        type: "",
        price: "",
        image: "",
        categoryId: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [isSorted, setIsSorted] = useState(false);
    // Thêm state cho modal chi tiết
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<Product[]>(API_URL);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>(CATEGORY_API_URL);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleSort = () => {
        const sorted = [...filteredProducts].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setFilteredProducts(sorted);
        setIsSorted(true);
    };

    const handleOpenDialog = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setProductData({ ...product });
        } else {
            setEditingProduct(null);
            setProductData({ name: "", price: "", type: "", image: "", categoryId: "" });
        }
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!productData.name || !productData.price || !productData.categoryId) {
            Alert.alert("Error", "Please fill in all required fields!");
            return;
        }

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/${editingProduct.id}`, productData);
            } else {
                await axios.post(API_URL, productData);
            }
            fetchData();
            setModalVisible(false);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDelete = async (product: Product) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    try {
                        await axios.delete(`https://67e5137018194932a584633a.mockapi.io/categories/${product.categoryId}/products/${product.id}`);
                        fetchData();
                    } catch (error) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response?.status === 404) {
                            Alert.alert("Error", "Product not found or already deleted!");
                        } else {
                            console.error("Error deleting product:", error);
                            Alert.alert("Error", "Failed to delete product, please try again.");
                        }
                    }
                },
                style: "destructive",
            },
        ]);
    };

    // Hàm xử lý hiển thị chi tiết sản phẩm
    const  handleShowDetails = (product: Product) => {
        setSelectedProduct(product);
        setDetailModalVisible(true);
    };

    // Hàm lấy tên danh mục dựa trên categoryId
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : "Không xác định";
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý sản phẩm</Text>

            <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Tìm kiếm sản phẩm theo tên..."
            />

            <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
                <Text style={styles.sortButtonText}>Sắp xếp A-Z</Text>
            </TouchableOpacity>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.productItem}
                        onPress={() => handleShowDetails(item)}
                    >
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>{item.price} VNĐ</Text>
                            <Text style={styles.description}>{item.type}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleOpenDialog(item)}
                            >
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item)}
                            >
                                <Text style={styles.buttonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenDialog()}>
                <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
            </TouchableOpacity>

            {/* Modal for Add/Edit Product */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Text>

                        <TextInput
                            style={styles.input}
                            value={productData.name}
                            onChangeText={(text) => setProductData({ ...productData, name: text })}
                            placeholder="Tên sản phẩm"
                        />
                        <TextInput
                            style={styles.input}
                            value={productData.price}
                            onChangeText={(text) => setProductData({ ...productData, price: text })}
                            placeholder="Giá sản phẩm"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={productData.type}
                            onChangeText={(text) => setProductData({ ...productData, type: text })}
                            placeholder="Mô tả sản phẩm"
                        />
                        <TextInput
                            style={styles.input}
                            value={productData.image}
                            onChangeText={(text) => setProductData({ ...productData, image: text })}
                            placeholder="Link ảnh sản phẩm"
                            numberOfLines={1}
                            multiline={false}
                        />
                        <Picker
                            selectedValue={productData.categoryId}
                            onValueChange={(itemValue: string) =>
                                setProductData({ ...productData, categoryId: itemValue })
                            }
                        >
                            <Picker.Item label="Chọn danh mục" value="" />
                            {categories.map((category) => (
                                <Picker.Item key={category.id} label={category.name} value={category.id} />
                            ))}
                        </Picker>

                        <Button title="Lưu" onPress={handleSave} />
                        <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Modal for Product Details */}
            <Modal visible={detailModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
                        {selectedProduct && (
                            <View style={styles.detailContainer}>
                                <Image
                                    source={{ uri: selectedProduct.image }}
                                    style={styles.detailImage}
                                />
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Tên:</Text> {selectedProduct.name}
                                </Text>
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Giá:</Text> {selectedProduct.price} VNĐ
                                </Text>
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Mô tả:</Text> {selectedProduct.type}
                                </Text>
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>Danh mục:</Text> {getCategoryName(selectedProduct.categoryId)}
                                </Text>
                                <Text style={styles.detailText}>
                                    <Text style={styles.detailLabel}>ID:</Text> {selectedProduct.id}
                                </Text>
                            </View>
                        )}
                        <Button
                            title="Đóng"
                            color="red"
                            onPress={() => setDetailModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    sortButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    sortButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    productItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10
    },
    productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
    productInfo: { flex: 6 },
    name: { fontSize: 18, fontWeight: "bold" },
    price: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
    description: { fontSize: 14, color: "#555", marginTop: 5 },
    actions: {
        flex: 2,
        alignItems: "center",
        justifyContent: "space-around",
    },
    editButton: {
        backgroundColor: "#FFA500",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        minWidth: 60,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        minWidth: 60,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    addButton: {
        backgroundColor: "#008000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    addButtonText: { color: "#fff", fontWeight: "bold" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        width: "100%"
    },
    // Thêm styles cho modal chi tiết
    detailContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    detailImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        width: "100%",
    },
    detailLabel: {
        fontWeight: "bold",
        color: "#333",
    },
});

export default AdminProductScreen;