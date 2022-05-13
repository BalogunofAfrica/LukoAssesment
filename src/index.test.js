import AsyncStorage from "@react-native-async-storage/async-storage";
import * as cache from "../cache";

const commonData = {
  name: "Priced Rubles",
  photo: "",
  description: "",
  purchasePrice: 400,
  type: "",
};

describe("CRUD operations on the local storage", () => {
  describe("readData", () => {
    it("checks if Async Storage is used", async () => {
      await cache.getData(cache.keys.valuables);
      expect(AsyncStorage.getItem).toBeCalledWith(cache.keys.valuables);
    });

    describe("failedRead", () => {
      let error;
      beforeEach(async () => {
        error = new Error("Failed to read data");
        AsyncStorage.getItem.mockRejectedValueOnce(error);
      });
      it("should return an error when trying to read from Async Storage", async () => {
        const res = await cache.getData(cache.keys.valuables);
        expect(res).toBe(error.message);
      });
    });
  });

  describe("removeData", () => {
    it("should remove specified data from storage", async () => {
      await cache.storeData(cache.keys.valuables, commonData);

      await cache.removeData(cache.keys.valuables, commonData);
      const res = await cache.getData(cache.keys.valuables);

      const exists = res.some((value) => value.name === commonData.name);
      expect(exists).toEqual(false);
    });

    describe("failedRemove", () => {
      let error;
      beforeEach(async () => {
        error = new Error("Failed to remove data");
        AsyncStorage.setItem.mockRejectedValueOnce(error);
      });
      it("should return an error when trying to remove from Async Storage", async () => {
        const res = await cache.removeData(cache.keys.valuables, commonData);

        expect(res).toBe(error.message);
      });
    });
  });

  describe("storeData", () => {
    beforeEach(async () => {
      await AsyncStorage.clear();
    });

    it("should write data to storage", async () => {
      await cache.storeData(cache.keys.valuables, commonData);

      const res = await cache.getData(cache.keys.valuables);
      expect(res).toStrictEqual([commonData]);
    });

    it("should append data to existing data", async () => {
      const data1 = commonData;
      const data2 = { ...commonData, name: "Priced Gold" };
      await cache.storeData(cache.keys.valuables, data1);
      await cache.storeData(cache.keys.valuables, data2);

      const res = await cache.getData(cache.keys.valuables);
      expect(res[0].name).toEqual(data2.name);
      expect(res[1].name).toEqual(data1.name);
    });

    it("shoud return proper message when storing duplicate data", async () => {
      const data = { name: "Cat1" };
      const message = "duplicate data";
      await cache.storeData(cache.keys.valuables, commonData);
      const res = await cache.storeData(cache.keys.valuables, commonData);

      expect(res).toBe(message);
    });

    describe("failedStore", () => {
      let error;
      beforeEach(async () => {
        error = new Error("Failed to store data");
        AsyncStorage.setItem.mockRejectedValueOnce(error);
      });
      it("should return an error when trying to store into Async Storage", async () => {
        const res = await cache.storeData(cache.keys.valuables, commonData);
        expect(res).toBe(error.message);
      });
    });
  });
});
