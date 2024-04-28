import HeaderContainer from '@/components/global/HeaderContainer';
import React from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex">
      <HeaderContainer>
        <Text>能看到我吗？</Text>
      </HeaderContainer>
    </View>
  );
}