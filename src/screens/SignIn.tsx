import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UnauthenticatedParamList } from "../../App";

type SignInScreenProps = NativeStackScreenProps<
  UnauthenticatedParamList,
  "SignIn"
>;

function SignIn({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && password;

  const onSubmit = () => {
    if (!email || !email.trim()) {
      return Alert.alert("알림", "이메일을 입력해주세요.");
    }

    if (!password || !password.trim()) {
      return Alert.alert("알림", "비밀번호를 입력해주세요.");
    }

    Keyboard.dismiss();
    Alert.alert("알림", "로그인 되었습니다.");
  };

  const toSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일을 입력해주세요."
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
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
          disabled={!canGoNext}
          onPress={onSubmit}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </>
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
