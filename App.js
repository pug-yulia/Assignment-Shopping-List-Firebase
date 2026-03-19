import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, Alert } from 'react-native';

import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

export default function App() {

  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });

  const [items, setItems] = useState([]);

  const database = getDatabase(app);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');

    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const itemsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });
  }, []);

  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, 'items/'), product);
    } else {
      Alert.alert('Error', 'Type product and amount first');
    }
  };

  const deleteItem = (id) => {
    remove(ref(database, 'items/' + id));
  };

  return (
    <View style={styles.container}>

      <Text style={{ fontSize: 20, marginBottom: 20 }}>Shopping List Firebase</Text>

      <TextInput
        placeholder='Product title'
        value={product.title}
        onChangeText={text => setProduct({ ...product, title: text })}
        style={styles.input}
      />

      <TextInput
        placeholder='Amount'
        value={product.amount}
        onChangeText={text => setProduct({ ...product, amount: text })}
        style={styles.input}
      />

      <Button onPress={handleSave} title="Save" />

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>
              {item.title}, {item.amount}
            </Text>

            <Text
              style={{ color: 'red' }}
              onPress={() => deleteItem(item.id)}
            >
              bought
            </Text>
          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 240,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  listcontainer: {
    marginTop: 10,
  }
});