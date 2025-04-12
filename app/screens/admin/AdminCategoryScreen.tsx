import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Button, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";

type RootStackParamList = {
    Category: undefined;
    Product: undefined;
};

type Categories = {
    id: number;
    name: string;
};

const AdminCategoryScreen = () => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Categories[]>([]);
    const [editingCategories, setEditingCategories] = useState<Categories | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [nameCategories, setNameCategories] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<Categories[]>(
                "https://67e5137018194932a584633a.mockapi.io/categories"
            );
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter((category) =>
                category.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    };

    const handleSort = () => {
        const sortedCategories = [...filteredCategories].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setFilteredCategories(sortedCategories);
    };

    const validateCategoryName = (name: string): { isValid: boolean; errorMessage: string } => {
        // Check if name is empty
        if (!name.trim()) {
            return { isValid: false, errorMessage: "Tên danh mục không được để trống." };
        }

        // Check length (minimum 2 characters, maximum 50 characters)
        if (name.length < 2) {
            return { isValid: false, errorMessage: "Tên danh mục phải có ít nhất 2 ký tự." };
        }
        if (name.length > 50) {
            return { isValid: false, errorMessage: "Tên danh mục không được vượt quá 50 ký tự." };
        }

        // Check for valid characters (letters, numbers, spaces, and basic punctuation)
        const validNameRegex = /^[a-zA-Z0-9\sÀ-ỹ]*$/;
        if (!validNameRegex.test(name)) {
            return { isValid: false, errorMessage: "Tên danh mục chỉ được chứa chữ cái, số và khoảng trắng." };
        }

        return { isValid: true, errorMessage: "" };
    };

    const handleSave = async () => {
        // Validate the category name
        const validation = validateCategoryName(nameCategories);
        if (!validation.isValid) {
            Alert.alert("Lỗi nhập liệu", validation.errorMessage);
            return;
        }

        try {
            if (editingCategories) {
                await axios.put(`https://67e5137018194932a584633a.mockapi.io/categories/${editingCategories.id}`, {
                    name: nameCategories.trim(), // Trim to remove extra spaces
                });
            } else {
                await axios.post("https://67e5137018194932a584633a.mockapi.io/categories", {
                    name: nameCategories.trim(),
                });
            }
            fetchData();
            setModalVisible(false);
            setNameCategories(""); // Reset input after saving
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
            Alert.alert("Lỗi", "Không thể lưu danh mục. Vui lòng thử lại.");
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa danh mục này không?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                onPress: async () => {
                    try {
                        await axios.delete(`https://67e5137018194932a584633a.mockapi.io/categories/${id}`);
                        fetchData();
                    } catch (error) {
                        console.error("Lỗi khi xóa danh mục:", error);
                        Alert.alert("Lỗi", "Không thể xóa danh mục. Vui lòng thử lại.");
                    }
                },
                style: "destructive",
            },
        ]);
    };

    const openDialog = (categories?: Categories) => {
        if (categories) {
            setEditingCategories(categories);
            setNameCategories(categories.name);
        } else {
            setEditingCategories(null);
            setNameCategories("");
        }
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý danh mục</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm danh mục..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
                    <Text style={styles.sortButtonText}>Sắp xếp A-Z</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id.toString()}
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
                            {editingCategories ? "Sửa" : "Thêm"}
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={nameCategories}
                            onChangeText={setNameCategories}
                            placeholder="Tên danh mục"
                            autoCapitalize="words" // Capitalize first letter of each word
                        />
                        <Button title="Lưu" onPress={handleSave} />
                        <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#333",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 10,
    },
    sortButton: {
        backgroundColor: "#4682b4",
        padding: 10,
        borderRadius: 5,
    },
    sortButtonText: {
        color: "#fff",
        fontWeight: "bold",
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