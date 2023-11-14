import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContextProviderProps, Func, Item } from "./models/Models";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const Context = React.createContext(null);

export const AppContextProvider = ({ children}: ContextProviderProps) => {
    const context = useCreateAppContext();
    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useAppContext = () => {
    const context = React.useContext(Context);
    if (!context) throw new Error('Use app context within provider!');
    return context;
}

export const useCreateAppContext =  () => {
    const [listOfItems, setListOfItems] = useState<Item[]>([]);
    const [isDarkTheme, setIsDarkTheme] = useState();
    const [settings, setSettings] = useState(
        {
            priceFuel: '46',
            averageFuel: '9.5'
        }
    )    

    const toggleTheme = () => setIsDarkTheme(!isDarkTheme)

    const showData = async () => {
        var data = await AsyncStorage.getItem('dataCalcCost');
        if (data) {
            data = JSON.parse(data)
            data.listOfItems.forEach(item => item.date = dayjs(item.date).toDate())
            setListOfItems(data.listOfItems);
            setSettings(data.settings);
            setIsDarkTheme(data.isDarkTheme)
        }
    }

    useEffect(() => {
        showData();
    }, []);

    const setData = (data) => {
        AsyncStorage.setItem('dataCalcCost', JSON.stringify(data));
    }

    useEffect(() => {
        setData({ listOfItems, settings, isDarkTheme });
    }, [listOfItems, isDarkTheme]);
    
    const round = (value, decimals=2) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    
    const appliedListOfItems = i => setListOfItems(list => [
        i,
        ...list.filter(list => list.key != i.key)
    ].sort((a, b) => dayjs(b.date).toDate() - dayjs(a.date).toDate())
    );    

    const deleteItemOfListOfItems = (key: string) => setListOfItems(list => [
        ...list.filter(listOfItems => listOfItems.key != key)
    ])    
    
    return {
        listOfItems,
        setListOfItems,
        isDarkTheme,
        toggleTheme,
        setIsDarkTheme,
        appliedListOfItems,
        deleteItemOfListOfItems,
        settings,
        setSettings,        
        round
    };
}