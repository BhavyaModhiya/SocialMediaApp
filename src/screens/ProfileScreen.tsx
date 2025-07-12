import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';

export default function ProfileScreen() {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('1234567890');
    const [bio, setBio] = useState('This is my bio.');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSave = () => {
        setModalVisible(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Edit Profile</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                style={styles.input}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                style={styles.input}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself"
                style={[styles.input, styles.bioInput]}
                multiline
                numberOfLines={4}
            />

            <View style={styles.buttonWrapper}>
                <Button title="Save Profile" onPress={handleSave} />
            </View>

            {/* Custom Modal */}
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>✅ Success!</Text>
                        <Text style={styles.modalMessage}>Your profile has been updated.</Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: '500',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonWrapper: {
        marginTop: 10,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
