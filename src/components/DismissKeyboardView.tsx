import { PropsWithChildren } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

// 키보드 상단 부분을 클릭했을 때 키보드를 내리기 위한 컴포넌트
function DismissKeyboardView({ children }: PropsWithChildren) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboardView;
