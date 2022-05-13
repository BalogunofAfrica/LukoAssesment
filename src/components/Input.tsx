import { useMemo, useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

type Props = Omit<TextInputProps, "style" | "placeholderTextColor"> & {
  error?: string;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  showCurrency?: boolean;
};
export function Input({
  error,
  inputStyle,
  label,
  showCurrency = false,
  ...rest
}: Props) {
  const [borderColor, setBorderColor] = useState(colors.gray100);

  const style = useMemo(
    () => [styles.input, inputStyle, { borderColor }],
    [borderColor]
  );
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          onFocus={() => {
            setBorderColor(colors.mainBlue);
          }}
          onBlur={() => {
            setBorderColor(colors.gray100);
          }}
          placeholderTextColor={colors.mainGrey}
          style={style}
          {...rest}
        />
        {showCurrency ? <Text style={styles.currencyText}>€</Text> : null}
      </View>
      {error ? <Text style={[styles.label, styles.error]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  currencyText: {
    position: "absolute",
    right: 15,
    top: 12,
    fontFamily: fonts.regular,
    color: colors.gray700,
    fontSize: 17,
  },
  error: {
    color: colors.red,
  },
  input: {
    backgroundColor: colors.pureWhite,
    borderRadius: 10,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 48,
    width: "100%",
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.gray1000,
    fontWeight: "400",
    textAlignVertical: "top",
  },
  label: {
    color: colors.gray1000,
    textAlign: "left",
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 17,
  },
});
