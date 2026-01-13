import { auth } from "@/config/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const signIn = async () => {
        setError("");
        const trimmedEmail = email.trim();
        
        if (!trimmedEmail || !password) {
            setError("Please enter both email and password");
            return;
        }
        
        if (!validateEmail(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                trimmedEmail,
                password
            );
            const user = userCredential.user;
            if (user) {
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            console.error("Error signing in:", error);
            if (error.code === "auth/invalid-email") {
                setError("Invalid email address");
            } else if (error.code === "auth/user-not-found") {
                setError("No account found with this email");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password");
            } else {
                setError("Failed to sign in. Please try again.");
            }
        }
    }

    const signUp = async () => {
        setError("");
        const trimmedEmail = email.trim();
        
        if (!trimmedEmail || !password) {
            setError("Please enter both email and password");
            return;
        }
        
        if (!validateEmail(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                trimmedEmail,
                password
            );
            const user = userCredential.user;
            if (user) {
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            console.error("Error signing up:", error);
            if (error.code === "auth/email-already-in-use") {
                setError("An account with this email already exists");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email address");
            } else if (error.code === "auth/weak-password") {
                setError("Password is too weak");
            } else {
                setError("Failed to sign up. Please try again.");
            }
        }
    }

    return (
        <SafeAreaView>
            <Text>Login</Text>
            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            <TextInput 
                placeholder="email" 
                value={email} 
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput 
                placeholder="password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                autoCapitalize="none"
            />

            <TouchableOpacity onPress={signIn}>
                <Text>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={signUp}>
                <Text>Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default index;
