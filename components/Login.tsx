//android: '784049700606-2rrj0q80uap40353e6m203mubl2m7vj2.apps.googleusercontent.com'

import React, { useEffect, useState } from "react";
import { View } from 'react-native';
//import { useFormik } from "formik";
import { Button } from 'react-native-paper';
//import { InputField } from "./InputField";
import { useUserContext } from "../providers/UserContexProvider";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RootStackParamList } from "../typesNavigation";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

//import { GoogleSignin, } from "@react-native-google-signin/google-signin";

type Props = DrawerScreenProps<RootStackParamList, 'FormLogin'>


const FormLogin = ({ navigation }: Props) => {

    const { userInfo, setUser } = useUserContext()
   // const [userInfo, setUserInfo] = useState<User>()
    
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '972891890305-2jf1bn92gqhg84nqq517otlscsrj29mu.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access. 
    })

    const getUserInfo = async () => {
        //setUser({ name: 'Дмитрий Гребенев', email: 'dmitriy.grebenev@gmail.com', avatar: 'https://photo-pict.com/wp-content/uploads/2019/05/kartinki-dlya-stima-12.jpg' })

        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            setUser(user);
            //console.log(user)
        } catch (error: any) {
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }        
    }
    console.log(userInfo)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            {/* <Text>{userInfo}</Text> */}
            <Button onPress={() => getUserInfo()} >Войти </Button>
        </View>
    )
}

export default FormLogin