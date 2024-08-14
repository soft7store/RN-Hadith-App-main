// =================================================================== 
// Libraries
// ===================================================================
import React, { useState, useRef, memo, useEffect, useCallback, useReducer } from 'react';
import {
    View,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    BackHandler,
    ScrollView,
    findNodeHandle,
    Dimensions,
    Alert
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import TouchID from 'react-native-touch-id';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth';
//=================================================================== 
// Redux
// ===================================================================
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode } from 'reduxConfiguration/slices/themeSlice';
import { createApiMessage } from "reduxConfiguration/slices/snackbarSlice"
import { login } from "reduxConfiguration/slices/authSlice";
// =================================================================== 
// Components
// ===================================================================
import { Devider, FullScreenLoader, ExternalLogin } from 'components'
// ===================================================================
// Local Components
// ===================================================================
import BottomButtons from './LocalComponents/BottomButtons'
import Inputs from './LocalComponents/Inputs'
import LogoComponent from './LocalComponents/LogoComponent'
import AccountRemember from './LocalComponents/AccountRemember'
// ===================================================================
// Constants
// ===================================================================
import { ConstNumbers } from 'constantsConfiguration'
// ===================================================================
// Utilities
// ===================================================================
import { validateFields } from 'utilities/validation'
// ===================================================================
// HOC
// ===================================================================
import Localization from 'hoc/localization';
// =================================================================== 
import { apiErrorSnackbarOptions } from 'api/globalResponseErrorHandler'

const initialState = {
    items: {},
    refreshLocal: false,
    update: 0,
};

// ===================================================================
// Reducer Function
// -------------------------------------------------------------------
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'reset':
            return { ...state, items: payload, refreshLocal: false };

        case 'changeInput':
            let itemsNew = { ...state.items };
            itemsNew[payload.name].value = payload.value;
            return { ...state, items: itemsNew };

        default:
            throw new Error();
    }
};
// ===================================================================

function ScreenDataComponent({ t, navigation, screenSettings, api }) {
    // ===================================================================
    // Redux Props
    // -------------------------------------------------------------------
    const dispatchRedux = useDispatch()
    const theme = useSelector(selectThemeMode)

    // ===================================================================

    // ===================================================================
    // Reducer
    // -------------------------------------------------------------------
    const [state, reduce] = useReducer(reducer, {
        ...initialState,
        items: screenSettings?.createAndEditList?.initialState ? { ...screenSettings.createAndEditList.initialState } : {},
    });

    // ===================================================================

    // ===================================================================
    // State
    // -------------------------------------------------------------------
    const [triedToSubmitAtLeastOnce, setTriedToSubmitAtLeastOnce] = useState(false)
    const [loading, setLoading] = useState(false);
    const [keyboardOpenedHeight, setKeyboardVisible] = useState(0);

    // ===================================================================

    const scrollRef = useRef(null)

    // ===================================================================
    // UseEffects
    // -------------------------------------------------------------------
    useEffect(() => {
        const keyboardDidShowListener = Platform.OS === 'android' ? Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardVisible(parseInt(e.endCoordinates.height));
            }
        ) : Keyboard.addListener(
            'keyboardWillShow',
            (e) => {
                setKeyboardVisible(parseInt(e.endCoordinates.height));
            }
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            (e) => {
                setKeyboardVisible(0);
            }
        )

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);



    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handlebackButton
        );

        return () => backHandler.remove();
    }, []);

    // ===================================================================

    // ===================================================================
    // Methods
    // -------------------------------------------------------------------
    const handlebackButton = useCallback(() => {
        navigation.goBack()
        return true;
    }, []);

    const handleSubmit = useCallback((email = null, password = null, touchId = false) => {

        let emailNew = email ? email : state.items.email.value

        let formHasErrors = !validateFields(screenSettings.createAndEditList.fields, state.items)

        if (!triedToSubmitAtLeastOnce && !touchId) setTriedToSubmitAtLeastOnce(true)

        if (keyboardOpenedHeight > 0) Keyboard.dismiss()

        if (formHasErrors && !touchId) return

        setTimeout(() => {
            setLoading(true)

            setTimeout(() => {
                auth()
                    .sendPasswordResetEmail(emailNew)
                    .then((res) => {
                        setLoading(false)
                        Alert.alert(
                            t('emailSentTitle', 'Email sent'),
                            t('emailSentDescription', 'The link to reset your password was sent to your email'),
                            [
                                {
                                    text: t('goBack', 'Go back'), onPress: () => {
                                        navigation.goBack()
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    })
                    .catch(error => {
                        setLoading(false)
                        let message = error?.code ? t(error.code, error.code) : '';
                        const key = new Date().getTime() + Math.random()

                        dispatchRedux(createApiMessage({ message, key, options: apiErrorSnackbarOptions(key) }))

                    });
            }, 100)

        }, 100)

    }, [state, triedToSubmitAtLeastOnce, loading])

    

    const onFocusAddition = useCallback((e) => {
        scrollToInput(findNodeHandle(e.target))
    }, [])

    const scrollToInput = useCallback((target) => {
        scrollRef.current.props.scrollToFocusedInput(target, 40);
    }, [scrollRef])

    // ===================================================================

    // ===================================================================
    // Animations
    // -------------------------------------------------------------------


    // ===================================================================

    // ===================================================================
    // Render
    // -------------------------------------------------------------------
    return (
        <>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                innerRef={(ref) => { scrollRef.current = ref ? ref.getScrollResponder() : null; }}
            >
                <View style={{ width: '100%', flex: 1, paddingHorizontal: ConstNumbers.paddingHorizontalMain, minHeight: Dimensions.get('window').height - 50 }}>

                    <View style={{ width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', }}>

                        <LogoComponent />

                        <Inputs
                            screenSettings={screenSettings}
                            reduce={reduce}
                            triedToSubmitAtLeastOnce={triedToSubmitAtLeastOnce}
                            disabled={loading}
                            onFocusAddition={onFocusAddition}
                        />

                        <Devider height={20} />

                        <BottomButtons
                            navigation={navigation}
                            onPressLogin={() => { handleSubmit() }}
                            disabled={loading}
                            loading={loading}
                        />

                        <Devider height={10} />

                        <AccountRemember navigation={navigation} />

                    </View>


                </View>
            </KeyboardAwareScrollView>

            {/* <FullScreenLoader
                isLoading={loading}
            /> */}
        </>
    );
};

// export default memo(ScreenDataComponent);
export default Localization('Auth', memo(ScreenDataComponent));
