import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
    question: string;
    answer: string;
}

const QAScreen: React.FC = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        { question: 'Tội trạng cát định được theo luật nào?', answer: 'A, B, C, D, E, F là bộ luật E Root Igniter...' },
        { question: 'Tội của hệ giữ hộp trong định dinh?', answer: 'Thông tin chi tiết về hệ giữ hộp sẽ được cập nhật sau.' },
        { question: 'Khi nào táo thêm bị điêu chính?', answer: 'Táo sẽ được thêm vào hệ thống khi có thông báo chính thức.' },
        { question: 'Các chất điều chỉnh tính trung cộng được sử dụng trong các sản phẩm Planta không?', answer: 'Hiện tại, Planta không sử dụng các chất điều chỉnh tính trung cộng.' },
        { question: 'Các sản phẩm Planta có phải là hữu cơ không?', answer: 'Một số sản phẩm Planta đạt tiêu chuẩn hữu cơ, vui lòng kiểm tra nhãn sản phẩm.' },
    ];

    const toggleExpand = (index: number): void => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { }}>
                    <Text>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Q&A</Text>
                <Text style={{ width: 24 }}> </Text>
            </View>

            <View style={styles.faqContainer}>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <TouchableOpacity style={styles.questionContainer} onPress={() => toggleExpand(index)}>
                            <Text style={styles.questionText}>{faq.question}</Text>
                            <Ionicons name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
                        </TouchableOpacity>
                        {expandedIndex === index && (
                            <View style={styles.answerContainer}>
                                <Text style={styles.answerText}>{faq.answer}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    faqContainer: { marginTop: 20 },
    faqItem: { marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    questionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    questionText: { fontSize: 16, fontWeight: 'bold', color: '#000', flex: 1 },
    answerContainer: { paddingVertical: 10, paddingHorizontal: 5 },
    answerText: { fontSize: 14, color: '#666' },
});

export default QAScreen;
