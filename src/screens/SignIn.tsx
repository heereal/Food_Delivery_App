import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { UnauthenticatedParamList } from "../../AppInner";
import { useAppDispatch } from "../store";
import axios from "axios";
import Config from "react-native-config";
import userSlice from "../slices/user";
import EncryptedStorage from "react-native-encrypted-storage";

type SignInScreenProps = NativeStackScreenProps<
  UnauthenticatedParamList,
  "SignIn"
>;

function SignIn({ navigation }: SignInScreenProps) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && password;

  const signIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      });
      console.log(response.data);
      Alert.alert("알림", "로그인 되었습니다.");

      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response;
        console.error(errorResponse);

        if (errorResponse) {
          Alert.alert("알림", errorResponse.data.message);
        }
      }
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const onSubmit = useCallback(() => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert("알림", "이메일을 입력해주세요.");
    }
    if (!password || !password.trim()) {
      return Alert.alert("알림", "비밀번호를 입력해주세요.");
    }

    signIn();
  }, [loading, dispatch, email, password]);

  const toSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일을 입력해주세요."
          placeholderTextColor="#666"
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()} // 이메일 입력 후 바로 비밀번호 input에 포커스
          blurOnSubmit={false} // 이메일에서 비밀번호 input으로 이동 시 키보드 자판 내려가지 않도록
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요."
          placeholderTextColor="#666"
          onChangeText={setPassword}
          value={password}
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "gray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: "slateblue",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SignIn;
