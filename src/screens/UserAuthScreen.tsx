import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Components
import Login from '../components/userAuth/Login';
import Register from '../components/userAuth/Register';

export const enum AuthComponent {
  Register = 'Register',
  Login = 'Login'
}

interface UserAuthProps {
  setIsAuthenticated : (isAuthenticated: boolean) => void;
}

const UserAuthScreen: React.FC<UserAuthProps> = ({ setIsAuthenticated }) => {
  const [currentComponent, setCurrentComponent] = useState<AuthComponent>(AuthComponent.Register);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
      style={{ backgroundColor: 'white' }}>
      <View style={styles.bg} />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Logo</Text>
        </View>
      <View style={styles.formContainer}>
        {currentComponent === AuthComponent.Login ? 
            <Login 
              setCurrentComponent={setCurrentComponent} 
              setIsAuthenticated={setIsAuthenticated}
            /> 
            : 
            <Register setCurrentComponent={setCurrentComponent}/>
        }
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            if (currentComponent == AuthComponent.Register) {
              setCurrentComponent(AuthComponent.Login);
            } else {
              setCurrentComponent(AuthComponent.Register);
            }
          }}>
          <Text style={styles.buttonText}>{currentComponent}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  bg: {
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 80,
    height: 100,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UserAuthScreen;
