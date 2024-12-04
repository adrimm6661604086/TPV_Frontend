import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Components
import Login from '../../components/userAuth/Login';
import Register from '../../components/userAuth/Register';

export const enum AuthComponent {
  Register = 'Register',
  Login = 'Login'
}

interface UserAuthProps {
  setIsAuthenticated : (isAuthenticated: boolean) => void;
}

const UserAuthScreen: React.FC<UserAuthProps> = ({ setIsAuthenticated }) => {
  const [currentComponent, setCurrentComponent] = useState<AuthComponent>(AuthComponent.Login);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
    >
      <View style={styles.bg} />
      <View style={styles.formContainer}>
        {currentComponent === AuthComponent.Login ? 
            <Login 
              currentComponent={currentComponent}
              setCurrentComponent={setCurrentComponent} 
              setIsAuthenticated={setIsAuthenticated}
            /> 
            : 
            <Register 
              currentComponent={currentComponent}
              setCurrentComponent={setCurrentComponent}
            />
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
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
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    alignSelf: 'center',    
    minHeight: 320,       
    maxHeight: 600,          
    justifyContent: 'center',
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
