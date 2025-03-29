import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RootParamList = {
    Login: undefined;
    app: undefined;
    ProductDetail: { productId: string };
    OrderDetail: undefined;
    Cart: undefined;
};

type ProductDetailNavigationProp = StackNavigationProp<RootParamList, 'ProductDetail'>;
type ProductDetailRouteProp = RouteProp<RootParamList, 'ProductDetail'>;

interface Product {
    id: string;
    name: string;
    type: string;
    price: string;
    image: string;
    categoryId: string;
    
}

const ProductDetailScreen: React.FC = () => {
    const [quantity, setQuantity] = useState<number>(1);
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const [product, setProduct] = useState<Product | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const route = useRoute<ProductDetailRouteProp>();
    const navigation = useNavigation<ProductDetailNavigationProp>();

    const { productId } = route.params;

    const PRODUCT_API = `https://67e5137018194932a584633a.mockapi.io/products/${productId}`;
    const CART_API = 'https://67e5137018194932a584633a.mockapi.io/carts';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(PRODUCT_API);
                const data = await response.json();
                console.log('Product data:', data);
                setProduct(data);
            } catch (error) {
                // Ép kiểu error thành Error
                const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                console.error('Error fetching product:', errorMessage);
                Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
            }
        };
        fetchProduct();
    }, [productId]);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const formatPrice = (price: string): string => {
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    };

    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveSlide(roundIndex);
    };

    const handleAddToCart = async () => {
        if (!product) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin sản phẩm');
            return;
        }

        console.log('Bắt đầu thêm vào giỏ hàng');

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            total: (parseInt(product.price.replace('.', '')) * quantity).toString(),
        };

        try {
            console.log('Sending request to:', CART_API);
            console.log('Cart item:', cartItem);

            const response = await fetch(CART_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                Alert.alert(
                    'Thành công',
                    'Đã thêm sản phẩm vào giỏ hàng',
                    [
                        {
                            text: 'OK',
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                Alert.alert('Lỗi', `Không thể thêm vào giỏ hàng: ${errorText}`);
            }
        } catch (error) {
            // Ép kiểu error thành Error
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            console.error('Error adding to cart:', errorMessage);
            Alert.alert('Lỗi', `Đã xảy ra lỗi: ${errorMessage}`);
        }
    };

    const onAddToCartPress = () => {
        console.log('Nút CHỌN MUA đã được nhấn');
        handleAddToCart();
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.productImage} resizeMode="contain" />
        </View>
    );

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{product.name}</Text>
                    <TouchableOpacity onPress={() => console.log('Go to cart')}>
                        <Ionicons name="cart-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={[product.image]}
                        renderItem={renderImageItem}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    />
                    <View style={styles.dots}>
                        {[product.image].map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, activeSlide === index ? styles.activeDot : null]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
                    <View style={styles.tags}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{product.type}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Xuất xứ</Text>
                        <Text style={styles.detailValue}>Châu Phi</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Kích cỡ</Text>
                        <Text style={styles.detailValue}>Nhỏ</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tình trạng</Text>
                        <Text style={styles.detailValue}>Còn 156 sp</Text>
                    </View>
                </View>

                <View style={styles.quantityContainer}>
                    <Text style={styles.sectionTitle}>Độ dài chọn 1 sản phẩm</Text>
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity onPress={handleDecrease}>
                            <Ionicons name="remove" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={handleIncrease}>
                            <Ionicons name="add" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.totalPrice}>
                        Tạm tính: {formatPrice((parseInt(product.price.replace('.', '')) * quantity).toString())}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={onAddToCartPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addToCartText}>CHỌN MUA</Text>
                </TouchableOpacity>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginVertical: 10,
    },
    imageWrapper: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    productImage: {
        width: Dimensions.get('window').width,
        height: 250,
    },
    dots: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#000',
    },
    priceContainer: {
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    tags: {
        flexDirection: 'row',
        marginTop: 5,
    },
    tag: {
        backgroundColor: '#28a745',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
    },
    detailsContainer: {
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#000',
    },
    quantityContainer: {
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        width: 100,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    quantityText: {
        fontSize: 16,
        color: '#000',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    addToCartButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        marginHorizontal: 16,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;