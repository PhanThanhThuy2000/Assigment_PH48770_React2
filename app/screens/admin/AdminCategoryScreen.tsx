import React, { useEffect, useState } from "react"; //React và các Hook như useEffect, useState để quản lý trạng thái.
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Modal, Button, TextInput, Alert, } from "react-native"; //giúp xây dựng UI.
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios"; //Dùng để gọi API lấy dữ liệu
type RootStackParamList = {
    Category: undefined;
    Product: undefined;
};
//  Khai báo kiểu dữ liệu 
type Categories = {
    id: number;
    name: string;
}
const AdminCategoryScreen = () => {
    //const [Biến state chứa danh sách, Hàm dùng để cập nhật giá trị] = mảng rỗng<kiểu dữ liệu[]>([]);
    const [categories, setcategories] = useState<Categories[]>([]); 
    // const [dữ liệu của danh chỉnh sửa, Hàm cập nhật giá trị ] = useState<Categories | null>(null);
    const [editingCategories, setEditingCategories] = useState<Categories | null>(null); 
    const [loading, setLoading] = useState(true); // tải dữ liệu api
    const [modalVisible, setModalVisible] = useState(false); // hiện model .mặc định đang ẩn

    // Lưu thông tin nhập vào
    const [nameCategories, setNameCategories] = useState("");

    // Khi khi component được render lần đầu tiên sẽ gọi fetchData();
    useEffect(() => {
        fetchData();
    }, []);

    // HÀM HIỂN THỊ
    const fetchData = async () => { //gọi API mà không làm ứng dụng bị đơ
        try {
            //Sử dụng Axios để gửi một request GET đến API MockAPI.
            // await đảm bảo rằng React đợi cho đến khi API phản hồi trước khi tiếp tục thực thi code.
            const response = await axios.get<Categories[]>( //Categories[] kiểu dữ liệu đã khai báo ở trên
                "https://67e5137018194932a584633a.mockapi.io/categories"
            );
            setcategories(response.data); //Sau khi nhận được dữ liệu từ API, ta cập nhật state categories bằng dữ liệu từ API.
        } catch (error) {
            console.error("API Error:", error); // thông báo lỗi
        } finally {
            setLoading(false); // luôn load lại dữ liệu cho dù api trả về thành công hay thất bại
        }
    };
    // HÀM LƯU DƯ LIỆU
    const handleSave = async () => {
        if (!nameCategories) return;

        try {
            if (editingCategories) {
                // Gửi yêu cầu cập nhật danh mục
                await axios.put(`https://67e5137018194932a584633a.mockapi.io/categories/${editingCategories.id}`, {
                    name: nameCategories,
                });

            } else {
                // Gửi yêu cầu tạo danh mục mới
                await axios.post("https://67e5137018194932a584633a.mockapi.io/categories", {
                    name: nameCategories,
                });
            }

            fetchData(); // Gọi lại API để cập nhật danh sách
            setModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
        }
    };

    // HÀM XÓA
    const handleDelete = async (id: number) => {
        Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa danh mục này không?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                onPress: async () => {
                    try {
                        await axios.delete(`https://67e5137018194932a584633a.mockapi.io/categories/${id}`);
                        fetchData(); // Cập nhật danh sách sau khi xóa
                    } catch (error) {
                        console.error("Lỗi khi xóa danh mục:", error);
                    }
                },
                style: "destructive",
            },
        ]);
    };
    // HÀM HIỆN THỊ MODEL
    const openDialog = (categories?: Categories) => { // tham số tùy chọn categories có kiểu Categories
        if (categories) { // có giá trị thì hiểu là sửa 
            setEditingCategories(categories);//Gán đối tượng vào state
            setNameCategories(categories.name); //Lưu thông tin đang được chỉnh sửa
        } else { // không có giá trị hiểu là xóa
            setEditingCategories(null);
            setNameCategories("");
        }
        setModalVisible(true);
    };
    // UI
    return (
        <View style={styles.container}>
            <FlatList
                data={categories} //Lấy dữ liệu danh mục từ state categories.
            keyExtractor={(item) => item.id.toString()} //huyển id thành chuỗi để React có thể nhận diện từng mục duy nhất.
            renderItem={({ item }) => (
                <View style={styles.userItem}>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => openDialog(item)}
                            >
                                <Text style={styles.buttonText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.buttonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => openDialog()}>
                <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {/* Nếu editingCategories là true, tiêu đề sẽ là "Sửa" (nghĩa là sửa đổi). */}
                            {editingCategories ? "Sửa" : "Thêm"} 
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={nameCategories}
                            onChangeText={setNameCategories}
                            placeholder="Tên"
                        />
                        <Button title="Lưu" onPress={handleSave} />
                        <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: "#008000",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfo: {
        flex: 6,
    },
    actionButtons: {
        flex: 4,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    email: {
        fontSize: 16,
        color: "gray",
    },
    editButton: {
        backgroundColor: "#FFD700",
        padding: 8,
        borderRadius: 5,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default AdminCategoryScreen;