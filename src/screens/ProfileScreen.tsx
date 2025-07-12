import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function ProfileScreen() {
    const [name, setName] = useState('John Doe');
    const [bio, setBio] = useState('This is my bio.');

    return (
        <View style={{ padding: 20 }}>
            <Text>Name</Text>
            <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10 }} />
            <Text>Bio</Text>
            <TextInput value={bio} onChangeText={setBio} style={{ borderWidth: 1, marginBottom: 10 }} />
            <Button title="Save" onPress={() => Alert.alert('Profile updated')} />
        </View>
    );
}