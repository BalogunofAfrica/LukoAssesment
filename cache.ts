import AsyncStorage from "@react-native-async-storage/async-storage";

export type TData = {
  id?: number;
  name: string;
  purchasePrice: number;
  type: string;
  description: string;
  photo: string;
};

export const keys = {
  valuables: "valuables",
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    // error reading value
    return (e as Error).message;
  }
};

const removeAllData = async (keys: string) => {
  return AsyncStorage.removeItem(keys);
};

const removeData = async (key: string, value: TData) => {
  let jsonValue: string;
  try {
    const stored = await AsyncStorage.getItem(key);
    if (stored) {
      let data = JSON.parse(stored);
      data = data.filter((item: TData) => item.name !== value.name);
      jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    // error reading value
    return (e as Error).message;
  }
};

const storeData = async (key: string, value: TData) => {
  let jsonValue: string;
  try {
    const stored = await AsyncStorage.getItem(key);
    const warn = "duplicate data";
    if (stored) {
      const parsed = (JSON.parse(stored) ?? []) as TData[];
      const isExisting = parsed.some((item: TData) => item.name === value.name);
      if (!isExisting) {
        jsonValue = JSON.stringify([
          { ...value, id: parsed.length + 1 },
          ...parsed,
        ]);
        await AsyncStorage.setItem(key, jsonValue);
        return;
      } else {
        return warn;
      }
    } else {
      jsonValue = JSON.stringify([value]);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (e) {
    // error reading value
    return (e as Error).message;
  }
};

export { getData, removeAllData, removeData, storeData };
