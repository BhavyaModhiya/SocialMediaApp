import React from 'react';
import { View, Text, FlatList } from 'react-native';

const mockNotifications = [
    { id: '1', text: 'Alice liked your post' },
    { id: '2', text: 'Bob commented on your post' },
    { id: '3', text: 'Charlie followed you' }
];

export default function NotificationsScreen() {
    return (
        <FlatList
            data={mockNotifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <Text>{item.text}</Text>
                </View>
            )}
        />
    );
}