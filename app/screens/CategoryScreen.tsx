import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Định nghĩa kiểu cho stack navigation
type RootStackParamList = {
    Category: undefined;
    Cart: undefined;
    ProductDetail: { productId: string }; // Thêm route mới cho ProductDetail
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

const { width } = Dimensions.get('window');

interface Plant {
    id: string;
    name: string;
    price: string;
    image: string;
    categoryId?: string;
}

interface Category {
    id: string;
    name: string;
}

const CategoryScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [selectedTab, setSelectedTab] = useState('Tất cả');
    const [products, setProducts] = useState<Plant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const PRODUCTS_API = 'https://67e5137018194932a584633a.mockapi.io/products';
    const CATEGORIES_API = 'https://67e5137018194932a584633a.mockapi.io/categories';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await fetch(PRODUCTS_API);
                const productsData = await productsResponse.json();
                setProducts(productsData);

                const categoriesResponse = await fetch(CATEGORIES_API);
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredPlants = selectedTab === 'Tất cả'
        ? products
        : products.filter((plant) => {
            const category = categories.find((cat) => cat.id === plant.categoryId);
            return category && category.name === selectedTab;
        });

    const tabs = ['Tất cả', ...categories.map((cat) => cat.name)];

    // Sửa đổi hàm renderPlantItem để thêm khả năng điều hướng
    const renderPlantItem = ({ item }: { item: Plant }) => (
        <TouchableOpacity
            style={styles.plantItem}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.plantImage} />
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.plantPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => setSelectedTab(tab)}
        >
            <View style={styles.tabContent}>
                <Text
                    style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {tab}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backIcon}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>CÂY TRỒNG</Text>
                <TouchableOpacity
                    style={styles.cartIcon}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Icon name="shopping-cart" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabBarContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabBarContent}
                >
                    {tabs.map((tab) => renderTab(tab))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredPlants}
                renderItem={renderPlantItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.plantRow}
                contentContainerStyle={styles.plantList}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
            />
        </View>
    );
};

// Styles giữ nguyên như code cũ
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight || 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backIcon: {
        padding: 5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    cartIcon: {
        padding: 5,
    },
    tabBarContainer: {
        height: 60,
        marginVertical: 10,
    },
    tabBarContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    tab: {
        width: 90,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: '#00A862',
    },
    tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tabText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 80,
    },
    selectedTabText: {
        color: '#fff',
    },
    flatList: {
        flex: 1,
    },
    plantList: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    plantRow: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    plantItem: {
        width: (width - 45) / 2,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    plantImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    plantName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    plantPrice: {
        fontSize: 14,
        color: '#00A862',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
    },
});

export default CategoryScreen;