import React, { useLayoutEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { db, auth } from '../firebase';
import firebase from 'firebase';

const ChatScreen = ({ navigation, route }) => {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions(
			{
				title: 'Chat',
				headerTitleAlign: 'left',
				headerBackTitleVisible: false,
				headerTitle: () => (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Avatar rounded source={{ uri: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png' }} />
						<Text style={{ color: 'white', marginLeft: 10, fontWeight: '700' }}>{route.params.chatName}</Text>
					</View>
				),
				headerLeft: () => (
					<View style={{ marginLeft: 20 }}>
						<TouchableOpacity onPress={navigation.goBack} activeOpacity={0.5}>
							<AntDesign name="arrowleft" size={24} color="white" />
						</TouchableOpacity>
					</View>
				),
				headerRight: () => (
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 80, marginLeft: 10 }}>
						<TouchableOpacity activeOpacity={0.5}>
							<FontAwesome name="video-camera" size={24} color="white" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate('AddChatScreen')} activeOpacity={0.5}>
							<Ionicons name="call" size={24} color="white" />
						</TouchableOpacity>
					</View>
				),
			},
			[navigation, messages]
		);
	});
	useLayoutEffect(() => {
		const unsuscribe = db
			.collection('chats')
			.doc(route.params.id)
			.collection('messages')
			.orderBy('timestamp', 'desc')
			.onSnapshot((shot) => setMessages(shot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))));
		return unsuscribe;
	}, [route]);

	const sendMessage = () => {
		Keyboard.dismiss();
		db.collection('chats').doc(route.params.id).collection('messages').add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			displayName: auth.currentUser?.displayName,
			email: auth.currentUser?.email,
			photoURL: auth.currentUser?.photoURL,
		});
		setInput('');
	};
	console.log(messages);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar style="light" />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
				keyboardVerticalOffset={90}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<ScrollView contentContainerStyle={styles.inner}>
							{messages.map(({ id, data }) =>
								data.email === auth.currentUser.email ? (
									<View key={id} style={styles.reciever}>
										<Avatar
											position="absolute"
											rounded
											size={30}
											source={{ uri: data.photoURL }}
											bottom={-15}
											left={-5}
										/>
										<Text style={styles.receiverText}>{data.message}</Text>
										<Text style={styles.recieverName}>{data.displayName}</Text>
										<Text style={styles.recieverName}>{new Date(data.timestamp?.toDate()).toUTCString()}</Text>
									</View>
								) : (
									<View key={id} style={styles.sender}>
										<Avatar
											position="absolute"
											rounded
											size={30}
											source={{ uri: data.photoURL }}
											bottom={-15}
											left={-5}
										/>
										<Text style={styles.senderText}>{data.message}</Text>
										<Text style={styles.senderName}>{data.displayName}</Text>
										<Text style={styles.senderName}>{new Date(data.timestamp?.toDate()).toUTCString()}</Text>
									</View>
								)
							)}
						</ScrollView>
						<View style={styles.footer}>
							<TextInput
								value={input}
								onChangeText={(text) => setInput(text)}
								onSubmitEditing={() => sendMessage()}
								placeholder="Write your message"
								style={styles.textInput}
							/>
							<TouchableOpacity onPress={() => sendMessage()} activeOpacity={0.5}>
								<Ionicons name="send" size={24} color="#2B68E6" />
							</TouchableOpacity>
						</View>
					</>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1, //como tiene 1 el input se va a ir al fondo de la pantalla
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 15,
	},
	textInput: {
		backgroundColor: '#ECECEC',
		flex: 1,
		bottom: 0,
		height: 40,
		marginRight: 15,
		padding: 10,
		color: 'black',
		borderRadius: 30,
	},
	inner: {
		paddingTop: 15,
	},
	reciever: {
		backgroundColor: '#ECECEC',
		padding: 15,
		alignSelf: 'flex-end',
		borderRadius: 20,
		marginRight: 15,
		marginBottom: 20,
		maxWidth: '80%',
		position: 'relative',
	},
	recieverName: {
		left: 10,
		paddingRight: 10,
		fontSize: 10,
		color: 'black',
	},
	recieverText: {
		color: 'black',
		fontWeight: '500',
		marginLeft: 10,
	},

	sender: {
		backgroundColor: '#2B68E6',
		padding: 15,
		alignSelf: 'flex-start',
		borderRadius: 20,
		margin: 15,
		maxWidth: '80%',
		position: 'relative',
	},
	senderText: {
		color: 'white',
		fontWeight: '500',
		marginLeft: 10,
		marginBottom: 15,
	},
	senderName: {
		left: 10,
		paddingRight: 10,
		fontSize: 10,
		color: 'white',
	},
});
