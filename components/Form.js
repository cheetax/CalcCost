import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Formik, useFormikContext, useField } from "formik";
import { Appbar, IconButton, TextInput, Text, useTheme } from 'react-native-paper';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useAppContext } from "../providers/AppContextProvider";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)



const ViewDataField = (props) => {
  const {
    values: {
      expenses,
      proceeds,
      profit,
      profitPerOdometer,
      odometer,
      priceFuel,
      averageFuel,
      odometerFinish,
      odometerStart,
      key
    },
    setFieldValue
  } = useFormikContext();

  const [field, meta] = useField(props);

  React.useEffect(() => {
    if (proceeds && expenses) {
      setFieldValue('profit', Math.round(proceeds - expenses));
    }
    if (odometerFinish && odometerStart) {
      setFieldValue('odometer', odometerFinish - odometerStart);
      setFieldValue('profitPerOdometer', profit / odometer)
    }
    if (odometer && priceFuel && averageFuel) {
      setFieldValue('expenses', Math.round(odometer / 100 * averageFuel * priceFuel));

    }
  }, [
    proceeds,
    expenses,
    profit,
    profitPerOdometer,
    odometerFinish,
    odometerStart,
    odometer,
    priceFuel,
    averageFuel,
    setFieldValue,
    props.name,
  ]);

  return (
    <View style={Styles.main} >
      <View style={Styles.stackRow} >
        <Text {...props} {...field}>Пробег:</Text>
        <Text {...props} {...field}>{odometer}</Text>
      </View>

      <View style={Styles.stackRow} >
        <Text {...props} {...field}>Затраты:</Text>
        <Text {...props} {...field}>{expenses}</Text>
      </View>

      <View style={Styles.stackRow} >
        <Text {...props} {...field}>Доход:</Text>
        <Text {...props} {...field}>{profit}</Text>
      </View>
      <View style={Styles.stackRow} >
        <Text {...props} {...field}>Доход на пробег:</Text>
        <Text {...props} {...field}>{key}</Text>
      </View>
    </View>
  )
}

const DatePicer = (props) => {
  const {
    values: { date },
    setFieldValue
  } = useFormikContext();
  const onChange = (event, selected) => setFieldValue('date', selected)

  const showDatePicer = () => {
    DateTimePickerAndroid.open({
      value: dayjs(date).toDate(),
      mode: 'date',
      onChange
    });
  }
  return (
    <InputField
      {...props}
      value={dayjs(props.date).format('DD.MM.YY')}
      label='Дата'
      editable={true}
      onFocus={() => showDatePicer()} />
  )
}

const InputField = (props) => <TextInput
  style={{ marginTop: 12 }}
  contentStyle={{ height: 56 }}
  mode="outlined"
  {...props}
/>

export default function Form({ route, navigation }) {

  const { item, getItem, appliedListOfItems } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const nameForma = route.params.key !== '' ? 'Редактирование смены' : 'Новая смена'

  useEffect(() => {
    getItem(route.params.key)
    setLoaded(!loaded)
  }, [])

  const { handleSubmit } = useFormikContext();

  const theme = useTheme();
  console.log(loaded)
  console.log(item)
  return (
    <View style={Styles.main} >
      <Appbar.Header
      >
        <Appbar.Action
          icon='close'
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title={
            <Text
              variant='titleLarge'>{nameForma} </Text>}
        />
        <Appbar.Action icon='check' onPress={handleSubmit()} />
      </Appbar.Header>
      {loaded ? <Formik
        //enableReinitialize={true}
        initialValues={item}
        onSubmit={(values) => {
          appliedListOfItems(values)
          navigation.navigate({
            name: 'List',
          });
        }}
        onChange={(values) => { console.log(values) }}
      >
        {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
          <View style={Styles.main} >

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior="height"
              keyboardVerticalOffset={10}
            >
              <ScrollView style={Styles.forma} showsVerticalScrollIndicator={false} >
                <DatePicer date={values.date} style={Styles.inputField} />
                <InputField
                  value={values.priceFuel}
                  onChangeText={handleChange('priceFuel')}
                  label='Стоимость топлива' />
                <InputField
                  value={values.averageFuel}
                  onChangeText={handleChange('averageFuel')}
                  label='Средний расход' />
                <InputField
                  value={values.proceeds}
                  onChangeText={handleChange('proceeds')}
                  label='Выручка' />
                <InputField
                  value={values.odometerStart}
                  onChangeText={handleChange('odometerStart')}
                  label='Спидометр на начало' />
                <InputField
                  value={values.odometerFinish}
                  onChangeText={handleChange('odometerFinish')}
                  label='Спидометр на конец' />

                <ViewDataField name='viewData' variant='headlineMedium' />

              </ScrollView>
            </KeyboardAvoidingView>
          </View>)
        }
      </Formik > : <></>}
    </View >
  );
}

const Styles = StyleSheet.create({

  main: {
    flex: 1,
    flexDirection: 'column',
  },
  forma: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 24
  },
  text: {
    paddingHorizontal: 0,
    paddingRight: 8,
  },
  inputField: {
    marginTop: 12,
  },
  inputFieldContent: {
    height: 56
  },
  stackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  }
})