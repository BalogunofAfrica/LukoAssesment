import { FlatList, StyleSheet, View, Text } from "react-native";
import { Title } from "../components/Title";
import { Card } from "../components/Card";
import { RootTabScreenProps } from "../navigation/types";
import { colors } from "../theme/colors";
import { getData, keys, TData, removeData, removeAllData } from "../../cache";
import { useCallback, useEffect, useState } from "react";
import { fonts } from "../theme/fonts";
import { useFocusEffect } from "@react-navigation/native";

const ListEmpty = () => (
  <Text style={styles.listEmpty}>
    You currently do not have any valuables saved {"\n"}Tap the plus icon to add
    a valuable
  </Text>
);

export default function InventoryScreen({
  navigation,
  route,
}: RootTabScreenProps<"Inventory">) {
  const [data, setData] = useState<TData[] | undefined>();
  const total =
    data
      ?.map((d) => d.purchasePrice)
      .reduce((acc, amount) => {
        return acc + amount;
      }, 0) ?? 0;

  const handleAddButtonPress = () =>
    navigation.navigate("AddItem", {
      total,
    });

  useFocusEffect(
    useCallback(() => {
      getData(keys.valuables).then((_data) => {
        if (_data) {
          setData(_data);
        }
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Title onButtonPress={handleAddButtonPress}>{route.name}</Title>
      <FlatList
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.list}
        data={data}
        ListEmptyComponent={ListEmpty}
        numColumns={2}
        style={styles.listContainer}
        keyExtractor={(i) => `${i.id}-${i.name?.toString()}`}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            amount={`€${item.purchasePrice}`}
            uri={item.photo}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  list: {
    justifyContent: "space-between",
    fontFamily: fonts.regular,
  },
  listEmpty: {
    textAlign: "left",
  },
  listContainer: {
    marginTop: 15,
  },
});
