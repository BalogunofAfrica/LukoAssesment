import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

const formatAmount = (num: string | number) => {
  const n = String(num),
    p = n.indexOf(".");
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m
  );
};

export function Card({
  amount,
  title,
  uri,
}: {
  amount: string;
  title: string;
  uri: string;
}) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.head}>{title}</Text>
        <Text style={styles.body}>{formatAmount(amount)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.gray700,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    width: "100%",
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
  },
  container: {
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    width: 158,
    height: 265,
    overflow: "hidden",
    borderRadius: 14,
    marginBottom: 20,
  },
  head: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "500",
    fontFamily: fonts.bold,
    width: "100%",
    paddingHorizontal: 20,
  },
  image: {
    height: 158,
    width: 158,
  },
  textContainer: {
    backgroundColor: colors.pureWhite,
    height: 107,
    width: 158,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
});
