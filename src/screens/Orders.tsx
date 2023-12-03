import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { Order } from "../slices/order";
import EachOrder from "../components/EachOrder";
import { useCallback } from "react";

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);

  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={itme => itme.orderId}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: "row",
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

export default Orders;
