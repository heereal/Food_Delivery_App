import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import orderSlice, { Order } from "../slices/order";
import { useAppDispatch } from "../store";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import Config from "react-native-config";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthenticatedParamList } from "../../AppInner";
import getDistanceFromLatLonInKm from "../utils/getDistanceFromLatLonInKm";
import NaverMapView, { Marker, Path } from "react-native-nmap";

interface Props {
  item: Order;
}

function EachOrder({ item }: Props) {
  const navigation = useNavigation<NavigationProp<AuthenticatedParamList>>();
  const dispatch = useAppDispatch();

  const { start, end } = item;
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [detail, showDetail] = useState(false);

  // 수락 버튼 클릭 시 작동
  const onAccept = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      await axios.post(
        `${Config.API_URL}/accept`,
        { orderId: item.orderId },
        { headers: { authorization: `Bearer ${accessToken}` } },
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      navigation.navigate("Delivery");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response;

        // 타인이 이미 수락한 경우
        if (errorResponse?.status === 400) {
          Alert.alert("알림", errorResponse.data.message);
          dispatch(orderSlice.actions.rejectOrder(item.orderId));
        }
      }
    }
  }, [navigation, dispatch, item, accessToken]);

  // 거절 버튼 클릭 시 작동
  const onReject = () => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  };

  const toggleDetail = () => {
    showDetail(prevState => !prevState);
  };

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>
      {detail && (
        <View>
          <View>
            <View
              style={{
                width: Dimensions.get("window").width - 30,
                height: 200,
                marginTop: 10,
              }}>
              <NaverMapView
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
                center={{
                  zoom: 10,
                  tilt: 100,
                  latitude: (start.latitude + end.latitude) / 2,
                  longitude: (start.longitude + end.longitude) / 2,
                }}>
                {/* 출발지 */}
                <Marker
                  coordinate={{
                    latitude: start.latitude,
                    longitude: start.longitude,
                  }}
                  pinColor="blue"
                />
                <Path
                  coordinates={[
                    {
                      latitude: start.latitude,
                      longitude: start.longitude,
                    },
                    { latitude: end.latitude, longitude: end.longitude },
                  ]}
                />
                {/* 도착지 */}
                <Marker
                  coordinate={{
                    latitude: end.latitude,
                    longitude: end.longitude,
                  }}
                />
              </NaverMapView>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: "lightgray",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eachInfo: {},
  buttonWrapper: {
    flexDirection: "row",
    paddingTop: 10,
  },
  acceptButton: {
    backgroundColor: "blue",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: "red",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EachOrder;
