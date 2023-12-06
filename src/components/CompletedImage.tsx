import { Dimensions } from "react-native";
import { Order } from "../slices/order";
import FastImage from "react-native-fast-image";
import Config from "react-native-config";

interface Props {
  item: Order;
}

function CompletedImage({ item }: Props) {
  return (
    <FastImage
      source={{ uri: `${Config.API_URL}/${item.image}` }}
      resizeMode="cover"
      style={{
        height: Dimensions.get("window").width / 3 - 10,
        width: Dimensions.get("window").width / 3 - 10,
        margin: 5,
      }}
    />
  );
}

export default CompletedImage;
