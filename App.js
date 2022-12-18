import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [custId, setCustId] = useState(null);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [phoneNumber, setphoneNumber] = useState(null);
  const [branch, setBranch] = useState(null);
  const [product, setProduct] = useState(null);
  const [tenor, setTenor] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    fetchBranch();
    fetchProduct();
    getAllCustomer();
  }, []);

  const fetchBranch = async () => {
    const resp = await fetch("http://192.168.18.67:3000/GetMasterBranch");
    const data = await resp.json();
    setBranchList(data.data);
    setLoading(false);
  };

  const fetchProduct = async () => {
    const resp = await fetch("http://192.168.18.67:3000/GetMasterProduct");
    const data = await resp.json();
    setProductList(data.data);
    setLoading(false);
  };

  const getAllCustomer = async () => {
    const resp = await fetch("http://192.168.18.67:3000/GetAllDataCust");
    const data = await resp.json();
    setCustomer(data.data);
    setLoading(false);
  };

  const clearForm = () => {
    setCustId(null);
    setfirstName("");
    setBranch(0);
    setProduct(0);
    setTenor(-1);
    setlastName("");
    setphoneNumber(null);
  };

  const setEdit = (data) => {
    setCustId(data.CUST_ID);
    setfirstName(data.FIRST_NAME);
    setBranch(data.BRANCH_ID);
    setProduct(data.PRODUCT_ID);
    setTenor(data.TENOR_ID);
    setlastName(data.LAST_NAME);
    setphoneNumber(data.PHONE_NO.toString());
  };

  const submitForm = () => {
    if (custId == null) {
      fetch("http://192.168.18.67:3000/SaveDataCust", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          branch: branch,
          product: product,
          tenor: tenor,
          avatar: "",
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(
            "POST Response",
            "Response Body -> " + JSON.stringify(responseData)
          );
        });
      getAllCustomer();
    } else {
      fetch("http://192.168.18.67:3000/UpdateDataCust/" + custId, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          branch: branch,
          product: product,
          tenor: tenor,
          avatar: "",
        }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(
            "POST Response",
            "Response Body -> " + JSON.stringify(responseData)
          );
        });
    }
    getAllCustomer();
  };

  const alertDelete = (custId) => {
    Alert.alert("Confirmation", "Confirmation to deleted?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteCust(custId) },
    ]);
  };

  const deleteCust = (custId) => {
    fetch("http://192.168.18.67:3000/DeleteDataCust/" + custId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(
          "POST Response",
          "Response Body -> " + JSON.stringify(responseData),
          Alert.alert(responseData.message),
          getAllCustomer()
        );
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>FirstName</Text>
      <TextInput
        style={{ height: 40, borderWidth: 0.5 }}
        placeholder=" FirstName!"
        onChangeText={(firstName) => setfirstName(firstName)}
        defaultValue={firstName}
        maxLength={30}
      />
      <Text>lastName</Text>
      <TextInput
        style={{ height: 40, borderWidth: 0.5 }}
        placeholder=" lastName!"
        onChangeText={(lastName) => setlastName(lastName)}
        defaultValue={lastName}
        maxLength={30}
      />
      <Text>phoneNumber</Text>
      <TextInput
        keyboardType="numeric"
        style={{ height: 40, borderWidth: 0.5 }}
        placeholder=" phoneNumber!"
        onChangeText={(phoneNumber) => setphoneNumber(phoneNumber)}
        defaultValue={phoneNumber}
        maxLength={13}
      />
      <Picker
        selectedValue={branch}
        style={{ borderWidth: 0.5 }}
        onValueChange={(itemValue, itemIndex) => setBranch(itemValue)}
      >
        <Picker.Item label={"select branch"} value={0} />
        {branchList.map((item, idx) => {
          return (
            <Picker.Item
              key={idx.toString()}
              label={item.BRANCH_NAME}
              value={item.BRANCH_ID}
            />
          );
        })}
      </Picker>
      <Picker
        selectedValue={product}
        style={{ borderWidth: 0.5 }}
        onValueChange={(itemValue, itemIndex) => setProduct(itemValue)}
      >
        <Picker.Item label={"select product"} value={0} />
        {productList.map((item, idx) => {
          return (
            <Picker.Item
              key={idx.toString()}
              label={item.PRODUCT_NAME}
              value={item.PRODUCT_ID}
            />
          );
        })}
      </Picker>
      <Picker
        selectedValue={tenor}
        style={{ borderWidth: 0.5 }}
        onValueChange={(itemValue, itemIndex) => setTenor(itemValue)}
      >
        <Picker.Item label={"select tenor"} value={-1} />
        {Array.from(Array(60), (item, idx) => {
          return (
            <Picker.Item
              key={idx.toString()}
              label={idx.toString()}
              value={idx}
            />
          );
        })}
      </Picker>
      <Button
        onPress={() => clearForm()}
        title="Clear Form"
        color={"red"}
      ></Button>
      <View style={{ height: 10 }} />
      <Button
        onPress={() => submitForm()}
        title="Submit"
        color={"green"}
      ></Button>
      <View style={{ height: 10 }}></View>
      <FlatList
        keyExtractor={(item) => item.CUST_ID.toString()}
        data={customer}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View>
              <Text>imagenya</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => setEdit(item)}>
                <Text>
                  Full Name : {item.FIRST_NAME} {item.LAST_NAME}
                </Text>
              </TouchableOpacity>
              <Text>Branch Name : {item.BRANCH_NAME}</Text>
              <Text>Product Name : {item.PRODUCT_NAME}</Text>
              <Text>Tenor {item.TENOR_ID}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => alertDelete(item.CUST_ID)}>
                <Ionicons name="trash" size={20} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 35,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
