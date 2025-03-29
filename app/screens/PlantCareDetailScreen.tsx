import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back arrow, chevron icons, and slider arrows

const PlantCareDetailScreen: React.FC = () => {
    // State for expandable sections
    const [isBasicExpanded, setIsBasicExpanded] = useState(false);
    const [isLightExpanded, setIsLightExpanded] = useState(false);
    const [isWaterExpanded, setIsWaterExpanded] = useState(false);

    // State for image slider
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);

    // Sample image array for the slider
    const plantImages = [
        'https://s3-alpha-sig.figma.com/img/8dc1/c3fd/4c79faa42e885c9a92c6e6b29666fdf3?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WZ~AHAuUWatIlQ8mp07V58Mex1ek6L6xilNxkSAMnBikjhLhskyBdsQAqSyE2UrIG4qkJvWuUt5OddJZNYmPU9kYxNzEpWPqoQ0B9CtFgEl7ypXNV4WaZzWG9aw2424vdNu4tmu8Xk9M2kr8YCb7Lc8FCrdg9luvNYMed4BG7IEfsgMhW7qIM75ff1FlSSd24d1DBV2WSAMTldGB1Hg0JlRXkIJGWcUyPePVyHTL8JHc2SnrrdNhsIy1wngJxyIHYBRQ95ZA2BYmZA9Whw29x1dZSqJlfmck1D~Af2Amwmp3HM3pS8GlgO0yLTOOfaDf9IKzkcjqdjhqEdGbmdzLbw__',
        'https://s3-alpha-sig.figma.com/img/06d0/3e56/9c487f49bcd92c5b4b79ff2ef6350a4d?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pVTOMsKBZdevaNstZk6r2FdifF~N4Xo57N7djDbFbG6KwnJAYqSHJngZEIzBWm-x97iuLj2HeYp941MQrxopqyDDf7zCGuARciYx1Z34ciCRlIRA4WH98ldDpQ-hcqIuobd-4vPrCkVYZq9-P9q3kyDgoI1sbl~ssywuHoaB-ZzvbPSD~3rnpCoDvykq9cwgMn5i1k6Uoi1GjE-XJ4b6AIl2dhuSssDYfpZUSdWkaRS4L-AVakFabUnWnqv6xyb3Bgs14xPSk0VTlkEW~qvdfbfGUoPzKgR2TtmWTla98ls~45WANld-vohWWN3r1KtU2CqNBB2c7nxxD~z2DNJTFw__',
        'https://s3-alpha-sig.figma.com/img/8dc1/c3fd/4c79faa42e885c9a92c6e6b29666fdf3?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WZ~AHAuUWatIlQ8mp07V58Mex1ek6L6xilNxkSAMnBikjhLhskyBdsQAqSyE2UrIG4qkJvWuUt5OddJZNYmPU9kYxNzEpWPqoQ0B9CtFgEl7ypXNV4WaZzWG9aw2424vdNu4tmu8Xk9M2kr8YCb7Lc8FCrdg9luvNYMed4BG7IEfsgMhW7qIM75ff1FlSSd24d1DBV2WSAMTldGB1Hg0JlRXkIJGWcUyPePVyHTL8JHc2SnrrdNhsIy1wngJxyIHYBRQ95ZA2BYmZA9Whw29x1dZSqJlfmck1D~Af2Amwmp3HM3pS8GlgO0yLTOOfaDf9IKzkcjqdjhqEdGbmdzLbw__',
    ];

    // Handle slide change
    const onScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveSlide(roundIndex);
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <View style={styles.imageWrapper}>
            <Image
                source={{ uri: item }}
                style={styles.plantImage}
                resizeMode="cover"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header with Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Panse Den</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Plant Image Slider */}
                <View style={styles.imageContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={plantImages}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    />
                    {/* Navigation Arrows */}
                    <TouchableOpacity
                        style={[styles.arrowButton, styles.leftArrow]}
                        onPress={() => {
                            if (activeSlide > 0) {
                                flatListRef.current?.scrollToIndex({ index: activeSlide - 1 });
                            }
                        }}
                    >
                        <Ionicons name="chevron-back" size={16} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.arrowButton, styles.rightArrow]}
                        onPress={() => {
                            if (activeSlide < plantImages.length - 1) {
                                flatListRef.current?.scrollToIndex({ index: activeSlide + 1 });
                            }
                        }}
                    >
                        <Ionicons name="chevron-forward" size={16} color="#000" />
                    </TouchableOpacity>
                    {/* Dots Indicator */}
                    <View style={styles.dots}>
                        {plantImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeSlide === index ? styles.activeDot : null,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Hạt</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Hybrit</Text>
                    </View>
                </View>

                {/* Care Instructions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kiến thức cơ bản</Text>

                    {/* Basic Care Section */}
                    <TouchableOpacity
                        style={styles.expandableHeader}
                        onPress={() => setIsBasicExpanded(!isBasicExpanded)}
                    >
                        <Text style={styles.expandableTitle}>Bước 1: Chuẩn bị vật dụng, chăm trọng</Text>
                        <Ionicons
                            name={isBasicExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                    {isBasicExpanded && (
                        <Text style={styles.expandableContent}>
                            - Nhiệt độ: Tùy loại mà bạn chọn nhiệt độ thích hợp để cây phát triển tốt, tuy nhiên đa phần các loại cây đều thích hợp ở nhiệt độ từ 20-25 độ C thích hợp để cây có thể phát triển tốt. Chú ý để cây không bị héo do nhiệt độ quá cao hoặc quá thấp.
                        </Text>
                    )}

                    {/* Light Care Section */}
                    <TouchableOpacity
                        style={styles.expandableHeader}
                        onPress={() => setIsLightExpanded(!isLightExpanded)}
                    >
                        <Text style={styles.expandableTitle}>Bước 2: Tiến hành gieo hạt</Text>
                        <Ionicons
                            name={isLightExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                    {isLightExpanded && (
                        <Text style={styles.expandableContent}>
                            Bước này cần chú ý đến ánh sáng, cây cần ánh sáng để phát triển tốt. Bạn nên đặt cây ở nơi có ánh sáng tự nhiên, nhưng không nên để cây tiếp xúc trực tiếp với ánh sáng mặt trời quá lâu vì có thể làm cây bị cháy lá.
                        </Text>
                    )}

                    {/* Water Care Section */}
                    <TouchableOpacity
                        style={styles.expandableHeader}
                        onPress={() => setIsWaterExpanded(!isWaterExpanded)}
                    >
                        <Text style={styles.expandableTitle}>Bước 3: Chăm sóc sau gieo hạt</Text>
                        <Ionicons
                            name={isWaterExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                    {isWaterExpanded && (
                        <Text style={styles.expandableContent}>
                            Sau khi gieo hạt, bạn cần tưới nước đều đặn cho cây. Tùy vào loại cây mà bạn chọn, bạn có thể tưới nước 1-2 lần/ngày. Lưu ý không tưới quá nhiều nước vì có thể làm cây bị úng.
                        </Text>
                    )}
                </View>

                {/* Extra padding at the bottom */}
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        paddingTop: 40, // Space for status bar
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        textAlign: 'center',
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative', // To position arrows absolutely within this container
        alignItems: 'center',
    },
    imageWrapper: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    plantImage: {
        width: Dimensions.get('window').width,
        height: 200,
        resizeMode: 'cover',
    },
    arrowButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }], // Center vertically
        backgroundColor:'#fff',
        borderRadius: 20,
        padding: 5,
    },
    leftArrow: {
        left: 16,
    },
    rightArrow: {
        right: 16,
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
    tagsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    tag: {
        backgroundColor: '#28a745',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    expandableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    expandableContent: {
        fontSize: 14,
        color: '#666',
        paddingVertical: 12,
    },
});

export default PlantCareDetailScreen;