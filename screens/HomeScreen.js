import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem';
import { auth, db } from '../firebase';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
	const [chats, setChats] = useState([]);

	const signOutUser = () => {
		auth
			.signOut()
			.then(() => {
				navigation.replace('Login');
			})
			.catch((err) => alert(err));
	};
	useEffect(() => {
		const unsuscribe = db.collection('chats').onSnapshot((shot) =>
			setChats(
				shot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		);
		return unsuscribe;
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Signal',
			headerStyle: { backgroundColor: 'light blue' },
			headerTitleStyle: { color: 'white' },
			headerTintColor: 'black',
			headerLeft: () => (
				<View style={{ marginLeft: 20 }}>
					<TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
						<Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
					</TouchableOpacity>
				</View>
			),
			headerRight: () => (
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 80, marginRight: 20 }}>
					<TouchableOpacity activeOpacity={0.2}>
						<AntDesign name="camera" size={24} color="white" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate('AddChatScreen')} activeOpacity={0.5}>
						<SimpleLineIcons name="pencil" size={24} color="white" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);
	const enterChat = (id, chatName) => {
		navigation.navigate('ChatScreen', { id: id, chatName: chatName });
	};
	return (
		<SafeAreaView>
			<ScrollView>
				{chats.map(({ id, data: { chatName } }) => (
					<CustomListItem key={id} chatName={chatName} id={id} enterChat={enterChat} />
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
