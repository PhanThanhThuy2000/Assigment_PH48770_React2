import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng icon từ Expo

// Định nghĩa kiểu dữ liệu cho Product
interface Product {
    id: string;
    name: string;
    type: string;
    price: string;
    image: string;
    categoryId: string;
}

const SearchScreen: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // MockAPI URL
    const PRODUCTS_API = 'https://67e5137018194932a584633a.mockapi.io/products';

    // Lấy dữ liệu sản phẩm từ mockAPI
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCTS_API);
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data); // Ban đầu hiển thị tất cả sản phẩm
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Lọc sản phẩm dựa trên searchText
    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    // Hàm render từng sản phẩm trong kết quả tìm kiếm
    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.resultContainer}>
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/80' }} // Dùng placeholder nếu không có ảnh
                style={styles.plantImage}
            />
            <View style={styles.resultTextContainer}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantScientific}>{item.type}</Text>
                <Text style={styles.plantPrice}>{item.price}</Text>
                <Text style={styles.plantStock}>Còn hàng</Text> {/* Giả định còn hàng, có thể thêm field trong API */}
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Thanh trạng thái */}
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header với thời gian và biểu tượng */}
            <View style={styles.header}>
                <Text style={styles.time}>9:41</Text>
                <View style={styles.icons}>
                    <Ionicons name="wifi" size={20} color="black" />
                    <Ionicons name="battery-full" size={20} color="black" />
                </View>
            </View>

            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Tìm kiếm sản phẩm"
                />
                <TouchableOpacity style={styles.searchIcon}>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Danh sách kết quả tìm kiếm */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.noResults}>Không tìm thấy sản phẩm</Text>} // Fixed here
                contentContainerStyle={styles.resultsList}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    icons: {
        flexDirection: 'row',
        gap: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    searchIcon: {
        padding: 5,
    },
    resultsList: {
        paddingHorizontal: 15,
    },
    resultContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    plantImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    resultTextContainer: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    plantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    plantScientific: {
        fontSize: 14,
        color: '#666',
    },
    plantPrice: {
        fontSize: 16,
        color: '#000',
        marginTop: 5,
    },
    plantStock: {
        fontSize: 14,
        color: '#666',
    },
    noResults: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SearchScreen;