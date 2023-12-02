import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

// 키보드 상단 부분을 클릭했을 때 키보드를 닫기 위한 컴포넌트
function DismissKeyboardView({ children }: { children: React.ReactNode }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "position" : "padding"}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboardView;
