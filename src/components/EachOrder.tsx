import { Pressable, StyleSheet, Text, View } from "react-native";
import { Order } from "../slices/order";

function EachOrder({ item }: { item: Order }) {
  const toggleDetail = () => {};

  return (
    <View key={item.orderId} style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
        </Text>
      </Pressable>
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
});

export default EachOrder;
