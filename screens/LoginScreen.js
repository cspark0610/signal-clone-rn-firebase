import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			// si esta auteneticado hacemos lo redirigimos a la home page
			//console.log(authUser);
			if (authUser) {
				navigation.replace('Home');
			}
		});
		return unsubscribe;
	}, []);
	const signIn = () => {
		auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err));
	};
	return (
		<KeyboardAvoidingView behavior="padding" style={styles.container}>
			<StatusBar style="light" />

			<Image
				source={{ uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png' }}
				style={{ width: 200, height: 200 }}
			/>
			<View style={styles.inputContainer}>
				<Input placeholder="Email" autofocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
				<Input
					placeholder="Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
			</View>
			<Button title="Login" onPress={() => signIn()} containerStyle={styles.button} />
			<Button
				title="Register"
				onPress={() => navigation.navigate('Register')}
				type="outline"
				containerStyle={styles.button}
			/>
			<View style={{ height: 100 }} />
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 10,
		backgroundColor: 'white',
	},
	inputContainer: {
		width: 300,
	},
	button: {
		width: 200,
		marginTop: 10,
	},
});
