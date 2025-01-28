import { User } from "@/models/users";
import Api from "@/network/axiosInstance";

export async function getAuthenticatedUser (){
    const response = await Api.get<User>("/users/me");
    return response.data;
}


export async function getUserByUsername(username: string){
    const response = await Api.get<User>("/users/profile/" + username);
    return response.data;
}


interface SignUpValues {
    username: string,
    email: string,
    password: string,
    verificationCode: string,
}

export async function signUp(credentials: SignUpValues){
    const response = await Api.post<User>("/users/signup", credentials);
    return response.data;
}


export async function requestEmailVerificationCode(email: string){
    await Api.post("/users/verification-code", {email});
}


export async function requestPasswordResetCode(email: string) {
    await Api.post("/users/reset-password-code", {email});
}

interface ResetPasswordValues {
    email: string,
    password: string,
    verificationCode: string,
}


export async function resetPassword(credentials: ResetPasswordValues) {
    const response = await Api.post<User>("/users/reset-password", credentials);
    return response.data;
}


interface LoginValues{
    username: string,
    password: string,
}

export async function login(credentials: LoginValues){
    const response = await Api.post<User>("/users/login", credentials);
    return response.data;
}

export async function logout () {
    await Api.post("/users/logout");
}

interface updateUserValues {
    username?: string,
    displayName?: string,
    about?: string,
    profilePic?: File,
}

export async function updateUser(input: updateUserValues) {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
        if(value !== undefined) formData.append(key, value);
    });

    const response = await Api.patch<User>("/users/me", formData);
    return response.data;
}