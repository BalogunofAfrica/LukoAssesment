import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView as AvoidingView,
} from "react-native";

import Button from "../components/Button";
import { RootTabScreenProps, RootStackScreenProps } from "../navigation/types";
import { colors } from "../theme/colors";
import { Input } from "../components/Input";
import { ImagePicker, ImagePickerResult } from "../sdk/ImagePicker";

import cameraIcon from "../../assets/camera.png";
import trashIcon from "../../assets/trash.png";

import { ReactNode, useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { storeData, TData, keys } from "../../cache";
import { fonts } from "../theme/fonts";
import { useRoute } from "@react-navigation/native";

const formatAmount = (num: string | number) => {
  const n = String(num),
    p = n.indexOf(".");
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m
  );
};

const ViewContainer = Platform.OS === "android" ? SafeAreaView : View;
const KeyBoardView = ({ children }: { children: ReactNode }) => {
  // @ts-expect-error classh with @types/react and expo start
  if (Platform.OS === "android") return <ScrollView>{children}</ScrollView>;

  // @ts-expect-error classh with @types/react and expo start
  return <AvoidingView behavior="position">{children}</AvoidingView>;
};

const validateName = (name: string) => {
  if (name.length === 0)
    return { isValid: false, errorMessage: "Name is required" };
  return { isValid: true, errorMessage: "" };
};

const validateValue = (value: string, total: number) => {
  if (value.length === 0)
    return { isValid: false, errorMessage: "Value is required" };
  if (Number(value) > 40000)
    return { isValid: false, errorMessage: "Your limit is €40,000" };
  if (Number(value) + total > 40000)
    return {
      isValid: false,
      errorMessage: `Your limit is €40,000, you already have €${formatAmount(
        total
      )} worth of valuables`,
    };
  return { isValid: true, errorMessage: "" };
};

const validatePhoto = (photo: ImagePickerResult & { cancelled: false }) => {
  if (!photo?.uri) return { isValid: false, errorMessage: "Photo is required" };
  return { isValid: true, errorMessage: "" };
};

type FormValues = "photo" | "name" | "value";
type FormError = Partial<{
  [key in FormValues]: {
    isValid: boolean;
    errorMessage: string;
  };
}>;

export default function AddItemScreen({
  navigation,
}: RootTabScreenProps<"AddItemScreen">) {
  const [image, setImage] = useState<string>();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormError>({});

  const route = useRoute<RootStackScreenProps<"AddItem">["route"]>();

  const handleClick = useCallback(async () => {
    const result = await ImagePicker.pickImage();
    if (!result || result?.cancelled) return;
    const validation = validatePhoto(result);
    setErrors((error) => ({ ...error, photo: validation }));
    setImage(result?.uri);
  }, [image]);

  const onNameChange = useCallback((name: string) => {
    const validation = validateName(name);
    setErrors((error) => ({ ...error, name: validation }));
    setName(name);
  }, []);

  const onValueChange = useCallback((value: string) => {
    const validation = validateValue(value, route?.params?.total as number);
    setErrors((error) => ({ ...error, value: validation }));
    setValue(value);
  }, []);

  const handleDelete = useCallback(() => {
    setImage(undefined);
  }, [image]);

  const handleSubmit = async () => {
    const formData: TData = {
      name,
      photo: image ?? "",
      description,
      purchasePrice: Number(value),
      type: "",
    };
    await storeData(keys.valuables, formData);
    navigation.reset({ routes: [{ name: "Root" }] });
  };

  return (
    <ViewContainer style={styles.container}>
      <KeyBoardView>
        <View style={styles.buttonsContainer}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />
          <Button
            title="Add"
            disabled={
              !errors.photo?.isValid ||
              !errors.name?.isValid ||
              !errors.value?.isValid
            }
            onPress={handleSubmit}
          />
        </View>
        {!image ? (
          <Pressable
            onPress={handleClick}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.iconContainer,
            ]}
          >
            <Image source={cameraIcon} />
            <Text style={styles.addPhoto}>Add photo</Text>
            {errors.photo ? (
              <Text style={styles.error}>{errors.photo.errorMessage}</Text>
            ) : null}
          </Pressable>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.trashContainer,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Image source={trashIcon} />
            </Pressable>
          </View>
        )}
        <Input
          error={errors.name?.errorMessage}
          defaultValue={name}
          onChangeText={onNameChange}
          placeholder="Bracelet"
          label="Name"
        />
        <Input
          error={errors.value?.errorMessage}
          keyboardType="decimal-pad"
          onChangeText={onValueChange}
          showCurrency={true}
          defaultValue={value}
          placeholder="700"
          label="Value"
        />
        <Input
          onChangeText={setDescription}
          defaultValue={description}
          placeholder="Optional"
          multiline
          inputStyle={styles.input}
          label="Description"
        />
      </KeyBoardView>
    </ViewContainer>
  );
}

const styles = StyleSheet.create({
  addPhoto: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
    fontFamily: fonts.bold,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    paddingTop: 10,
  },
  error: {
    textAlign: "left",
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 17,
    color: colors.red,
  },
  iconContainer: {
    marginVertical: 20,
    borderColor: colors.icon,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
    height: 150,
    width: 150,
    borderWidth: 2,
    alignSelf: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imageContainer: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 20,
  },
  input: {
    height: 148,
  },
  trashContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
