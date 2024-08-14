// =================================================================== 
// Libraries
// ===================================================================
import React, { useState, useRef, memo, useEffect, useCallback, } from 'react';
import {
    View,
    Text,
    Platform,
    Pressable,
    Image
} from 'react-native';
//=================================================================== 
// Redux
// ===================================================================
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode } from 'reduxConfiguration/slices/themeSlice';
// =================================================================== 
// Components
// ===================================================================
// ===================================================================
import { ConstNumbers, Images, GlobalStyle } from 'constantsConfiguration';

const SettingsButton = ({ text, image, onPress }) => {
    // ===================================================================
    // Redux Props
    // -------------------------------------------------------------------
    const theme = useSelector(selectThemeMode)
    // ===================================================================

    // ===================================================================
    // State
    // -------------------------------------------------------------------
    // ===================================================================

    // ===================================================================
    // Ref
    // -------------------------------------------------------------------
    // ===================================================================

    // ===================================================================
    // Api
    // -------------------------------------------------------------------

    // ===================================================================

    // ===================================================================
    //  Methods
    // -------------------------------------------------------------------
    // ===================================================================

    // ===================================================================
    //  Animations
    // -------------------------------------------------------------------
    // ===================================================================

    // ===================================================================
    // Render
    // -------------------------------------------------------------------

    return (
        <View style={{ width: '100%', height: 60, overflow: 'hidden', }} >
            <Pressable
                android_ripple={{ color: theme.buttonPressableColor1, }}
                style={({ pressed }) => [{ backgroundColor: pressed && Platform.OS === 'ios' ? theme.buttonPressableColor1 : 'transparent', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}
                onPress={onPress}

            >
                <View style={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: ConstNumbers.paddingHorizontalMain }}>
                    <View style={{ width: 40, height: 40, borderRadius: 100, backgroundColor: theme.settingsButtonIconBackgroundColor, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                        <Image source={image} style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: theme.settingsButtonIconColor }} />
                    </View>
                    <View style={{ height: '100%', flex: 1, justifyContent: 'center', alignItems: 'flex-start', }}>
                        <Text style={[GlobalStyle.textFontRegular, { fontSize: 16, color: theme.settingsButtonTextColor, }]}>{text}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }} >
                        <Image source={Images.Right} style={{ width: 7, height: 18, marginRight: 4, resizeMode: 'contain', tintColor: theme.usersRightIconColor }} />
                    </View>
                </View>

            </Pressable>
        </View>
    );
};

export default memo(SettingsButton);
