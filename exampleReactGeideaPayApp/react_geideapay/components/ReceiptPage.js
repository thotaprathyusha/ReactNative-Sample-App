import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

const PaymentReceiptWidget = ({lang, amount, currency, orderId, merchantReferenceID, operation,showSuccessReceipt,failureMesg }) => {
  const date = new Date();
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  if(showSuccessReceipt){
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/defaultLogo.png')} />
        <Text style={[styles.title, styles.textMarginTop]} numberOfLines={1}>{lang==="English"?"Transaction Approved":"تمت الموافقة على الصفقة"}</Text>
        <Text style={[styles.text, styles.poweredBy]} numberOfLines={1}>{lang==="English"?"The Receipt will close automatically after 15 sec":"سيتم إغلاق الإيصال تلقائيًا بعد 15 ثانية"}</Text>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
           <Text style={styles.labelText}>{lang ==="English"?"Date/Time":"التاريخ / الوقت"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{formattedDate}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Amount":"كمية"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{amount} {currency}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Operation":"عملية"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{operation}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Geidea order ID":"معرّف طلب جيديا"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{orderId}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Merchant Reference ID":"معرّف مرجع التاجر"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{merchantReferenceID}</Text>
          </View>
        </View>

        <Text style={[styles.poweredBy, styles.textMarginTop]} numberOfLines={1}>{lang ==="English"?"Powered by Geidea":"مدعوم من جيديا"}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
else{
  return (
  <TouchableWithoutFeedback onPress={() => {}}>
      <View style={[styles.container,{backgroundColor:'#FFCCCB'}]}>
        <Image style={styles.logo} source={require('../assets/defaultLogo.png')} />
        <Text style={[styles.title, styles.textMarginTop]} numberOfLines={1}>{lang==="English"?"Transaction Failed":"فشل الاجراء"}</Text>
        <Text style={[styles.text, styles.poweredBy]} numberOfLines={1}>{lang==="English"?"The Receipt will close automatically after 15 sec":"سيتم إغلاق الإيصال تلقائيًا بعد 15 ثانية"}</Text>


        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Date/Time":"التاريخ / الوقت"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{formattedDate}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Geidea order ID":"معرّف طلب جيديا"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{orderId}</Text>
          </View>
        </View>

        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Merchant Reference ID":"معرّف مرجع التاجر"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{merchantReferenceID}</Text>
          </View>
        </View>
        
        <View style={[styles.row,{marginTop:20}]}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{lang ==="English"?"Failure Reason":"سبب الفشل"}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.valueText}>{failureMesg}</Text>
          </View>
        </View>

        <Text style={[styles.poweredBy, styles.textMarginTop]} numberOfLines={1}>{lang ==="English"?"Powered by Geidea":"مدعوم من جيديا"}</Text>
      </View>
    </TouchableWithoutFeedback>

  )}
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CDFFCD',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  label: {
    width: '50%',
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  labelText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    width: '50%',
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  valueText: {
    color: '#000',
    fontSize: 16,
    
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
  poweredBy: {
    fontSize: 15,
    color: '#555',
  },
  textMarginTop: {
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginVertical: 8,
  },
}
)

export default PaymentReceiptWidget;