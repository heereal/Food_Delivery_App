import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Delivery, Orders, Settings, SignIn, SignUp } from "./src/screens";
import { useSelector } from "react-redux";
import { RootState } from "./src/store/reducer";
import useSocket from "./src/hooks/useSocket";
import { useEffect } from "react";

// 로그인 여부에 따라 스크린을 제한하기 위해 type을 두 개로 나눔
export type AuthenticatedParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};

export type UnauthenticatedParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<UnauthenticatedParamList>();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const [socket, disconnect] = useSocket();

  useEffect(() => {
    const helloCallback = (data: any) => {
      console.log(data);
    };

    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit("login", "hello"); // 서버에 데이터 전송
      socket.on("hello", helloCallback); // 서버로부터 데이터 수신
    }

    // cleanup
    return () => {
      if (socket) {
        socket.off("hello", helloCallback);
      }
    };
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("!isLoggedIn", !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{ title: "오더 목록" }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ title: "내 정보" }}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: "로그인" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: "회원가입" }}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
