import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Delivery, Orders, Settings, SignIn, SignUp } from "./src/screens";

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

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
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
      )}
    </NavigationContainer>
  );
}

export default App;
