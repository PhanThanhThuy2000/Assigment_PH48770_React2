import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setLoginInfo, setAuthenticated } from '../store/authSlice';
import { store } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm AsyncStorage

const API_URL = 'https://67e5137018194932a584633a.mockapi.io/users';

type RootParamList = {
    Login: undefined;
    SignUp: undefined;
    app: undefined;
    AdminDashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const { email, password } = useSelector((state: RootState) => state.auth);

    console.log('Redux state on render:', { email, password });

    const [errors, setErrors] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Load thông tin đã lưu khi component mount
    useEffect(() => {
        const loadSavedCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('savedEmail');
                const savedPassword = await AsyncStorage.getItem('savedPassword');
                const savedRememberMe = await AsyncStorage.getItem('rememberMe');

                if (savedEmail && savedPassword && savedRememberMe === 'true') {
                    dispatch(setLoginInfo({ email: savedEmail, password: savedPassword }));
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Error loading saved credentials:', error);
            }
        };

        loadSavedCredentials();
    }, [dispatch]);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let newErrors = { email: '', password: '' };

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Email không đúng định dạng';
        }

        if (!password.trim()) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleLogin = async () => {
        setIsSubmitted(true);
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            const users = await response.json();
            const user = users.find((u: any) => u.email === email && u.password === password);
            if (!user) {
                setErrors({ email: 'Email hoặc mật khẩu không đúng', password: 'Email hoặc mật khẩu không đúng' });
                setIsLoading(false);
                return;
            }
            // Lưu thông tin vào Redux, bao gồm name
            dispatch(setLoginInfo({ email: user.email, password: user.password, name: user.name }));
            if (rememberMe) {
                await AsyncStorage.setItem('savedEmail', email);
                await AsyncStorage.setItem('savedPassword', password);
                await AsyncStorage.setItem('rememberMe', 'true');
            } else {
                await AsyncStorage.removeItem('savedEmail');
                await AsyncStorage.removeItem('savedPassword');
                await AsyncStorage.setItem('rememberMe', 'false');
            }
            dispatch(setAuthenticated({ isAuthenticated: true, role: user.role }));
            if (user.role === 2) navigation.navigate('AdminDashboard');
            else if (user.role === 1) navigation.navigate('app');
        } catch (error) {
            setErrors({ email: 'Lỗi mạng, vui lòng thử lại', password: '' });
            console.error('Network error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRememberMe = () => {
        setRememberMe((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    uri: 'https://img.freepik.com/premium-photo/tropical-palm-leaves-pattern-background-green-monstera-tree-foliage-decoration-design_960396-611245.jpg',
                }}
                style={styles.backgroundImage}
            >
                <View style={styles.overlayContainer}>
                    <Svg height="200" width="100%" viewBox="0 0 1440 320">
                        <Path fill="white" d="M0,150 C500,50 1000,200 1440,0 L1440,320 L0,320 Z" />
                    </Svg>
                </View>
            </ImageBackground>

            <View style={styles.formContainer}>
                <Text style={styles.greetingText}>Chào mừng bạn</Text>
                <Text style={styles.subText}>Đăng nhập tài khoản</Text>

                <TextInput
                    style={[styles.input, isSubmitted && errors.email ? styles.inputError : null]}
                    placeholder="Nhập email hoặc số điện thoại"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={(text: string) => {
                        dispatch(setLoginInfo({ email: text, password }));
                        console.log('State after email change:', store.getState());
                    }}
                    editable={!isLoading}
                />
                {isSubmitted && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }, isSubmitted && errors.password ? styles.inputError : null]}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text: string) => {
                            dispatch(setLoginInfo({ email, password: text }));
                            console.log('State after password change:', store.getState());
                        }}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                {isSubmitted && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                <View style={styles.optionsContainer}>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity style={styles.checkbox} onPress={toggleRememberMe} disabled={isLoading}>
                            {rememberMe && <View style={styles.checkboxInner} />}
                        </TouchableOpacity>
                        <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    disabled={isLoading}
                >
                    <Text style={styles.loginButtonText}>
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Hoặc</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="facebook" size={24} color="#4267B2" />
                    </TouchableOpacity>
                </View>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Bạn không có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={[styles.registerText, { color: '#00A862' }]}>Tạo tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: height * 0.3,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    subText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 46,
        borderWidth: 1,
        borderColor: '#00A862',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00A862',
    },
    checkboxText: {
        fontSize: 14,
        color: '#888',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#00A862',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#00A862',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    loginButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    loginButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#888',
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#888',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        width: '50%',
        marginBottom: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    registerContainer: {
        flexDirection: 'row',
    },
    registerText: {
        fontSize: 14,
        color: '#888',
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        position: 'absolute',
        top: 0,
    },
    overlayContainer: {
        position: 'absolute',
        bottom: -90,
        width: '100%',
    },
});

export default LoginScreen;