import React, { useState } from 'react';
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

type RootParamList = {
  Login: undefined;
  SignUp: undefined;
  app: undefined;
  AdminDashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootParamList, 'SignUp'>;

const { width, height } = Dimensions.get('window');

interface SignUpState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string; // Thêm trường confirmPassword
  fullNameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string; // Thêm trường lỗi cho confirmPassword
}

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [state, setState] = useState<SignUpState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullNameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (): Promise<void> => {
    let hasError = false;

    // Validate full name
    if (!state.fullName) {
      setState((prev) => ({ ...prev, fullNameError: 'Vui lòng nhập họ tên' }));
      hasError = true;
    } else {
      setState((prev) => ({ ...prev, fullNameError: '' }));
    }

    // Validate email
    if (!state.email) {
      setState((prev) => ({ ...prev, emailError: 'Vui lòng nhập email' }));
      hasError = true;
    } else if (!validateEmail(state.email)) {
      setState((prev) => ({ ...prev, emailError: 'Email không đúng định dạng' }));
      hasError = true;
    } else {
      setState((prev) => ({ ...prev, emailError: '' }));
    }

    // Validate password
    if (!state.password) {
      setState((prev) => ({ ...prev, passwordError: 'Vui lòng nhập mật khẩu' }));
      hasError = true;
    } else if (state.password.length < 6) {
      setState((prev) => ({ ...prev, passwordError: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      hasError = true;
    } else {
      setState((prev) => ({ ...prev, passwordError: '' }));
    }

    // Validate confirm password
    if (!state.confirmPassword) {
      setState((prev) => ({ ...prev, confirmPasswordError: 'Vui lòng nhập lại mật khẩu' }));
      hasError = true;
    } else if (state.confirmPassword !== state.password) {
      setState((prev) => ({ ...prev, confirmPasswordError: 'Mật khẩu xác nhận không khớp' }));
      hasError = true;
    } else {
      setState((prev) => ({ ...prev, confirmPasswordError: '' }));
    }

    if (!hasError) {
      const newUser = {
        name: state.fullName,
        email: state.email,
        password: state.password,
        role: 1,
      };

      try {
        const response = await fetch('https://67e5137018194932a584633a.mockapi.io/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          const createdUser = await response.json();
          console.log('Sign up successful:', createdUser);
          setState({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullNameError: '',
            emailError: '',
            passwordError: '',
            confirmPasswordError: '',
          });
          alert('Đăng ký thành công!');
          navigation.navigate('Login');
        } else {
          console.error('Sign up failed:', response.status);
          setState((prev) => ({ ...prev, emailError: 'Đăng ký thất bại, thử lại sau' }));
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setState((prev) => ({ ...prev, emailError: 'Lỗi kết nối, thử lại sau' }));
      }
    }
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
        <Text style={styles.titleText}>Đăng ký</Text>
        <Text style={styles.subText}>Tạo tài khoản</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Họ tên"
            placeholderTextColor="#888"
            value={state.fullName}
            onChangeText={(text: string) =>
              setState((prevState) => ({ ...prevState, fullName: text, fullNameError: '' }))
            }
          />
          {state.fullNameError ? <Text style={styles.errorText}>{state.fullNameError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            value={state.email}
            onChangeText={(text: string) =>
              setState((prevState) => ({ ...prevState, email: text, emailError: '' }))
            }
          />
          {state.emailError ? <Text style={styles.errorText}>{state.emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            secureTextEntry
            value={state.password}
            onChangeText={(text: string) =>
              setState((prevState) => ({ ...prevState, password: text, passwordError: '' }))
            }
          />
          {state.passwordError ? <Text style={styles.errorText}>{state.passwordError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#888"
            secureTextEntry
            value={state.confirmPassword}
            onChangeText={(text: string) =>
              setState((prevState) => ({ ...prevState, confirmPassword: text, confirmPasswordError: '' }))
            }
          />
          {state.confirmPasswordError ? (
            <Text style={styles.errorText}>{state.confirmPasswordError}</Text>
          ) : null}
        </View>

        <Text style={styles.termsText}>
          Để đăng ký tài khoản, bạn đồng ý{' '}
          <Text style={styles.termsLink}>Terms & Conditions and Privacy Policy</Text>
        </Text>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Đăng ký</Text>
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

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Tôi đã có tài khoản </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginText, { color: '#00A862' }]}>Đăng nhập</Text>
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
    marginTop: height * 0.16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#00A862',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  termsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  termsLink: {
    color: '#00A862',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00A862',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
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
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 5,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
  },
  loginText: {
    fontSize: 14,
    color: '#888',
  },
  backgroundImage: {
    width: '100%',
    height: 130,
    position: 'absolute',
    top: 0,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: -90,
    width: '100%',
  },
});

export default SignUpScreen;