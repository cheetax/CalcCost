import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useFormik } from "formik";
import { Appbar, TextInput, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { DatePickerInput, registerTranslation } from 'react-native-paper-dates';
import { useAppContext } from "../providers/AppContextProvider";

registerTranslation('ru', {
  save: 'Записать',
  selectSingle: 'Выбрать дату',
  selectMultiple: 'Выбрать даты',
  selectRange: 'Select period',
  notAccordingToDateFormat: (inputFormat) =>
    `Формат даты должен быть ${inputFormat}`,
  mustBeHigherThan: (date) => `Должно быть позже чем ${date}`,
  mustBeLowerThan: (date) => `Должно быть раньше чем ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Должно быть между ${startDate} - ${endDate}`,
  dateIsDisabled: 'День не разрешен',
  previous: 'Предыдущий',
  next: 'Слудующий',
  typeInDate: 'Тип даты',
  pickDateFromCalendar: 'Выберите дату из календаря',
  close: 'Закрыть'
})

const ViewDataField = props => {
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
  } = props;



  //const [field, meta] = useField(props);

  React.useEffect(() => {
    if (proceeds && expenses) {
      setFieldValue('profit', Math.round(proceeds - expenses));
    }
    if (odometerFinish && odometerStart) {
      setFieldValue('odometer', odometerFinish - odometerStart);
      setFieldValue('profitPerOdometer', Math.round(profit / odometer))
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
        <Text {...props} >Пробег:</Text>
        <Text {...props} >{odometer}</Text>
      </View>

      <View style={Styles.stackRow} >
        <Text {...props} >Затраты:</Text>
        <Text {...props} >{expenses}</Text>
      </View>

      <View style={Styles.stackRow} >
        <Text {...props} >Доход:</Text>
        <Text {...props}>{profit}</Text>
      </View>
      <View style={Styles.stackRow} >
        <Text {...props} >Доход на пробег:</Text>
        <Text {...props} >{key}</Text>
      </View>
    </View>
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...item },
    validateOnChange: false,
    onSubmit: values => {
      appliedListOfItems(values)
      navigation.navigate({
        name: 'List',
      });
    }
  });
  //console.log(dayjs(item.date).toDate())
  const theme = useTheme();
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
        <Appbar.Action icon='check' onPress={formik.handleSubmit} />
      </Appbar.Header>
      {loaded ?
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
          keyboardVerticalOffset={10}
        >
          <ScrollView
            style={Styles.forma}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            contentInsetAdjustmentBehavior='always'
          >
            <DatePickerInput
              locale='ru'
              withDateFormatInLabel={false}
              label="Дата"
              value={formik.values.date}
              onChange={d => {
                formik.setFieldValue('date', d)
              }}
              inputMode="start"
              mode="outlined"
              presentationStyle="formSheet"
            />
            <InputField
              value={formik.values.priceFuel}
              onChangeText={formik.handleChange('priceFuel')}
              label='Стоимость топлива' />
            <InputField
              value={formik.values.averageFuel}
              onChangeText={formik.handleChange('averageFuel')}
              label='Средний расход' />
            <InputField
              value={formik.values.proceeds}
              onChangeText={formik.handleChange('proceeds')}
              label='Выручка' />
            <InputField
              value={formik.values.odometerStart}
              onChangeText={formik.handleChange('odometerStart')}
              label='Спидометр на начало' />
            <InputField
              value={formik.values.odometerFinish}
              onChangeText={formik.handleChange('odometerFinish')}
              label='Спидометр на конец' />

            <ViewDataField values={formik.values} setFieldValue={formik.setFieldValue} name='viewData' variant='headlineMedium' />

          </ScrollView>
        </KeyboardAvoidingView> :
        <ActivityIndicator
          animating={true}
          size={"large"}
          style={Styles.activitiIndicator}
        />}
    </View >
  );
}

const Styles = StyleSheet.create({

  main: {
    flex: 1,
    flexDirection: 'column',
  },
  activitiIndicator: {
    flex: 1,
    marginVertical: 'auto',
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