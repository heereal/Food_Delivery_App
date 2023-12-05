import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Delivery, Orders, Settings, SignIn, SignUp } from "./src/screens";
import { useSelector } from "react-redux";
import { RootState } from "./src/store/reducer";
import useSocket from "./src/hooks/useSocket";
import { useEffect } from "react";
import { useAppDispatch } from "./src/store";
import orderSlice from "./src/slices/order";
import EncryptedStorage from "react-native-encrypted-storage";
import axios from "axios";
import Config from "react-native-config";
import userSlice from "./src/slices/user";
import { Alert } from "react-native";
import usePermissions from "./src/hooks/usePermissions";

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
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const [socket, disconnect] = useSocket();

  usePermissions(); // 위치, 카메라 등 권한 요청

  // 로그인 한 경우 웹소켓 연결
  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };

    if (socket && isLoggedIn) {
      socket.emit("acceptOrder", "hello"); // 서버에 데이터 전송
      socket.on("order", callback); // 서버로부터 데이터 수신
    }

    // cleanup
    return () => {
      if (socket) {
        socket.off("order", callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  // 로그인 안한 경우 웹소켓 연결 끊기
  useEffect(() => {
    if (!isLoggedIn) {
      console.log("!isLoggedIn", !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  // 앱 실행 시 refreshToken 있으면 로그인
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem("refreshToken");
        if (!token) {
          return;
        }

        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        // refreshToken이 만료되었을 경우
        if (
          axios.isAxiosError(error) &&
          error.response?.data.code === "expired"
        ) {
          Alert.alert("알림", "다시 로그인 해주세요.");
        }
      } finally {
        // 잠깐 로그인 화면이 보이는 것은 SplashScreen으로 숨길 예정
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  // accessToken 만료 시 재발급
  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const {
          config,
          response: { status },
        } = error;

        if (status === 419 && error.response.data.code === "expired") {
          const originalRequest = config;
          const refreshToken = await EncryptedStorage.getItem("refreshToken");

          // token refresh 요청
          const { data } = await axios.post(
            `${Config.API_URL}/refreshToken`,
            {},
            { headers: { authorization: `Bearer ${refreshToken}` } },
          );

          // 새로운 토큰 저장
          dispatch(userSlice.actions.setAccessToken(data.data.accessToken));

          // originalRequest에 accessToken 갱신
          originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;

          // originalRequest 새로운 accessToken으로 재요청
          return axios(originalRequest);
        }

        // 419 제외한 에러는 원래 request 함수의 catch문으로 이동
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

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
