import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import "../global.css";

export default function Index() {
  return (
    <View className="flex justify-center ml-8">
      <Text className='text-red-400'>Open up App.tsx to start working on your app!</Text>
      <Text>Hello World!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}