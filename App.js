import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react'
// import Amplify from 'aws-amplify';
import Amplify from "@aws-amplify/core"
// import { Authenticator } from '@aws-amplify/ui-react';
 import { SignIn, withAuthenticator } from 'aws-amplify-react-native';

import config from './src/aws-exports';

import HomeScreen from './screens/HomeScreen';
import BeforeAuth from './screens/BeforeAuth';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Success from './screens/Success';
import AuthNavigation from './authNavigation';
import { Auth } from 'aws-amplify';


Amplify.configure(config);


function App() {

  const [LoggedIn, setLoggedIn] = useState(false);

  const accessLoggedInState = () =>{
    Auth.currentAuthenticatedUser()
      .then(
        sess => {
          console.log('logged in')
          setLoggedIn(true)
        }
      )
      .catch(() => {
        console.log('not logged in')
        setLoggedIn(false)
      })
  }

  useEffect(() => {
    accessLoggedInState()
  }, [])

  return (

        //  <View >
        //   {/* <HomeScreen/> */}
        // </View>
      //  <SafeAreaView>
      //   <HomeScreen/>
      //     <BeforeAuth/>
      //     <Signup/>
      //     <Login/>
      //     <Success/>
      //  </SafeAreaView>

        <AuthNavigation/>    





  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0
  },
});


// export default withAuthenticator(App)
export default App

