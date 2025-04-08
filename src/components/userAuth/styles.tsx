import {
    StyleSheet,
  } from 'react-native';
import theme from '../../utils/theme';
import { NavigationContainer } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    innerContainer: {
        flex: 1,
        paddingVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    twoSectionContainer: {
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    threeSectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: theme.palette.text.light,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    icon: {
        alignSelf: 'center',
        marginRight: 5,
        marginBottom: 10,
    },
    twoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        marginTop: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    stepper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
      },
      step: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.palette.text.light,
        marginHorizontal: 5,
      },
      activeStep: {
        backgroundColor: theme.palette.primary.main,
      },
      navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      }
  });

export default styles;