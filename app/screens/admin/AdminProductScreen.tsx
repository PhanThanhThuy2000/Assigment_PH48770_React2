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

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    // Lấy danh sách sản phẩm từ API
    const fetchData = async () => {
        try {
            const response = await axios.get<Product[]>(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi API:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh mục sản phẩm từ API
    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>(CATEGORY_API_URL);
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    // Mở modal (chỉnh sửa hoặc thêm mới)
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

    // Lưu sản phẩm (Thêm mới hoặc chỉnh sửa)
    const handleSave = async () => {
        if (!productData.name || !productData.price || !productData.categoryId) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/${editingProduct.id}`, productData);
            } else {
                await axios.post(API_URL, productData);
            }
            fetchData(); // Cập nhật danh sách sau khi lưu
            setModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
        }
    };


    // HÀM XÓA
    const handleDelete = async (product: Product) => {
        Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa sản phẩm này không?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                onPress: async () => {
                    try {
                        console.log("Đang xóa sản phẩm có ID:", product.id);
                        console.log("Đường dẫn API:", `https://67e5137018194932a584633a.mockapi.io/categories/${product.categoryId}/products/${product.id}`);

                        await axios.delete(`https://67e5137018194932a584633a.mockapi.io/categories/${product.categoryId}/products/${product.id}`);

                        fetchData(); // Cập nhật danh sách sau khi lưu

                    } catch (error) {
                        const axiosError = error as AxiosError;
                        if (axiosError.response?.status === 404) {
                            Alert.alert("Lỗi", "Sản phẩm không tồn tại hoặc đã bị xóa!");
                        } else {
                            console.error("Lỗi khi xóa sản phẩm:", error);
                            Alert.alert("Lỗi", "Không thể xóa sản phẩm, vui lòng thử lại sau.");
                        }
                    }
                },
                style: "destructive",
            },
        ]);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý sản phẩm</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>{item.price} VNĐ</Text>
                            <Text style={styles.description}>{item.type}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleOpenDialog(item)}>
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                                <Text style={styles.buttonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenDialog()}>
                <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
            </TouchableOpacity>

            {/* Modal Thêm/Sửa Sản phẩm */}
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
                        />
                        {/* Dropdown chọn danh mục */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    productItem: { flexDirection: "row", backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 10 },
    productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
    productInfo: { flex: 6 },
    name: { fontSize: 18, fontWeight: "bold" },
    price: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
    description: { fontSize: 14, color: "#555", marginTop: 5 },
    actions: {
        flex: 2,
        alignItems: "center", // Căn giữa nút trong hàng
        justifyContent:"space-around"
    },
    editButton: {
        backgroundColor: "#FFA500",
        paddingVertical: 6,  // Giảm chiều cao
        paddingHorizontal: 10, // Giảm chiều rộng
        borderRadius: 5,
        minWidth: 60, // Đặt kích thước tối thiểu
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
        fontSize: 14, // Giảm font chữ
    },
    addButton: { backgroundColor: "#008000", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
    addButtonText: { color: "#fff", fontWeight: "bold" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10, width: "100%" },
});

export default AdminProductScreen;
