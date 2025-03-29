import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

// Cập nhật RootParamList để hỗ trợ tham số cho ProductDetail
type RootParamList = {
    Login: undefined;
    app: undefined;
    Cart: undefined;
    Category: undefined;
    ProductDetail: { productId: string };
};

type NavigationProp = StackNavigationProp<RootParamList, 'Login'>;
const { width } = Dimensions.get('window');

// Định nghĩa kiểu dữ liệu cho Product
interface Product {
    id: string;
    name: string;
    type: string;
    price: string;
    image: string;
    categoryId: string;
}

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // MockAPI URL
    const PRODUCTS_API = 'https://67e5137018194932a584633a.mockapi.io/products';

    // Lấy dữ liệu từ mockAPI
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await fetch(PRODUCTS_API);
                const productsData = await productsResponse.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Hàm render item sản phẩm chung
    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.plantItem}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.plantImage} />
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.plantType}>{item.type}</Text>
            <Text style={styles.plantPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    // Lọc sản phẩm theo type
    const getProductsByType = (type: string) => {
        return products.filter(product => product.type === type);
    };

    // Lấy danh sách các type duy nhất từ products
    const uniqueTypes = Array.from(new Set(products.map(product => product.type)));

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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={{
                            uri: 'https://s3-alpha-sig.figma.com/img/3084/d533/3c5e831f02921d6fe59087cc1e9b8e20?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=aEc5zW3g5TzXFZw-USwgDiRZUTgnRrAWV8DhHjXhkXLYuu4YfNvLO8FKWdKseragS42rUeXmGF3RcjOp6nJ8egCXkYhTC7nUpQXB5cnUgR-E6A09~UG~1oOxlWVA87lr7g5RpyTENmQYSVM2SrqSkMedutMPFA2e54upTA0McVN83Kgod~HjY2N7X7N55tI5JTstPYP8KaQx~SS7ws11JN018jx2BkxddRBYwIoNBX9m90RnwYFliSyXmaJKy7Bfi-E8cupwApd4sYkaCKmJ5O1wxMpDVIKaf9W74xH4HtWlltBGLOFYt4axDZUZmK2qjxrTwKZ1usALkpgcTs0tTg__',
                        }}
                        style={styles.headerImage}
                    >
                        <View style={styles.headerOverlay}>
                            <Text style={styles.headerText}>
                                Planta - tổ sáng không{'\n'}gian nhà bạn
                            </Text>
                            <TouchableOpacity style={styles.newArrivalsButton}>
                                <Text style={styles.newArrivalsText}>Xem hàng mới về</Text>
                                <Icon name="arrow-right" size={16} color="#00A862" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartIcon}>
                        <Icon name="shopping-cart" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Hiển thị danh sách sản phẩm theo type */}
                {uniqueTypes.map(type => (
                    <View key={type} style={styles.plantsContainer}>
                        <Text style={styles.sectionTitle}>{type}</Text>
                        <FlatList
                            data={getProductsByType(type)}
                            renderItem={renderProductItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.plantRow}
                            scrollEnabled={false}
                            nestedScrollEnabled={false}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Category')}
                            style={styles.viewMoreButton}
                        >
                            <Text style={styles.viewMoreText}>Xem thêm {type}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Planta - tổ sáng không gian nhà bạn</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight || 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
    },
    headerOverlay: {
        padding: 15,
        marginBottom: 50,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        width: width * 0.8,
    },
    newArrivalsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newArrivalsText: {
        fontSize: 14,
        color: '#00A862',
        marginRight: 5,
        fontWeight: '500',
    },
    cartIcon: {
        position: 'absolute',
        top: 40,
        right: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    plantsContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
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
    plantType: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
        textAlign: 'center',
    },
    plantPrice: {
        fontSize: 14,
        color: '#00A862',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    viewMoreButton: {
        marginTop: 15,
        alignItems: 'flex-end',
        marginRight: 10,
    },
    viewMoreText: {
        fontSize: 14,
        color: '#00A862',
        fontWeight: '500',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#888',
    },
});

export default HomeScreen;