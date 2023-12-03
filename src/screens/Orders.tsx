import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import { Order } from "../slices/order";

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);
  const toggleDetail = () => {};

  const renderItem = ({ item }: { item: Order }) => {
    return (
      <View key={item.orderId} style={styles.orderContainer}>
        <Pressable onPress={toggleDetail} style={styles.info}>
          <Text style={styles.eachInfo}>
            {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
          </Text>
        </Pressable>
      </View>
    );
  };

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
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: "lightgray",
  },
  info: {
    flexDirection: "row",
  },
  eachInfo: {
    flex: 1,
  },
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
