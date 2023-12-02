import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import DismissKeyboardView from "../components/DismissKeyboardView";
import { UnauthenticatedParamList } from "../../AppInner";
import axios, { AxiosError } from "axios";

type SignUpScreenProps = NativeStackScreenProps<
  UnauthenticatedParamList,
  "SignUp"
>;

function SignUp({ navigation }: SignUpScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const signUp = async () => {
    console.log(email, name, password);
    try {
      setLoading(true);
      const response = await axios.post("/user", {
        email,
        name,
        password,
      });
      console.log(response);
      Alert.alert("알림", "회원가입 되었습니다.");
    } catch (error) {
      // 에러의 타입을 알 수 없기 때문에 타입 추론
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response;
        console.error(errorResponse);

        if (errorResponse) {
          Alert.alert("알림", errorResponse.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = useCallback(() => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert("알림", "이메일을 입력해주세요.");
    }
    if (!name || !name.trim()) {
      return Alert.alert("알림", "이름을 입력해주세요.");
    }
    if (!password || !password.trim()) {
      return Alert.alert("알림", "비밀번호를 입력해주세요.");
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert("알림", "올바른 이메일 주소가 아닙니다.");
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        "알림",
        "비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.",
      );
    }

    signUp();
  }, [loading, email, name, password]);

  const canGoNext = email && name && password;

  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          placeholder="이메일을 입력해주세요."
          placeholderTextColor="#666"
          textContentType="emailAddress"
          keyboardType="email-address"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이름을 입력해주세요."
          placeholderTextColor="#666"
          onChangeText={setName}
          value={name}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요. (영문, 숫자, 특수문자)"
          placeholderTextColor="#666"
          onChangeText={setPassword}
          value={password}
          keyboardType={Platform.OS === "android" ? "default" : "ascii-capable"}
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
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
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
    borderRadius: 5,
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

export default SignUp;
