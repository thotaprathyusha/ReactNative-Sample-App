import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
  StatusBar,
  Text,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-paper';
import PaymentModal from 'react_geideapay//components/PaymentModal';
import Toast from 'react-native-toast-message';
import RadioGroup from 'react-native-radio-buttons-group';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Address from 'react_geideapay/models/adress';
const paymentOperations = [
  'Default (merchant configuration)',
  'Pay',
  'PreAuthorize',
  'AuthorizeCapture',
];
const initiatedByOptions = ['Internet', 'Merchant'];
const agreementTypes = ['None', 'Recurring', 'Installment', 'Unscheduled'];

const langOptions = [
  {
    id: '1',
    label: 'English',
    value: 'English',
    selected: true,
  },
  {
    id: '2',
    label: 'Arabic',
    value: 'Arabic',
  },
];

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      amount: '100',
      currency: 'EGP',
      merchantReferenceID: '',
      customerEmail: '',
      phoneNumber: '',
      headerColor: '#FFFFFF',
      callbackUrl: '',
      checkoutVisible: false,
      cardHolderName: null,
      cardOnFile: false,
      orderId: null,
      threeDSecureId: null,
      creditCardFormValid: false,
      creditCardFormData: {},
      sameAddress: true,
      //payment details
      paymentOperation: paymentOperations[0],
      initiatedBy: initiatedByOptions[0],
      agreementType: agreementTypes[0],
      paymentIntentID: '',
      hideLogo: false,
      //show save card
      showSaveCard: false,
      //show Email
      showEmail: false,
      //show Receipt
      showReceipt: false,
      //show phone
      showPhone: false,
      //show addresses
      showBilling: false,
      //language
      lang: 'English',
      billingAddress: new Address(),
      shippingAddress: new Address(),
    };

    this.onModalCheckoutButtonPress =
      this.onModalCheckoutButtonPress.bind(this);
    this.closePaymentModal = this.closePaymentModal.bind(this);
    this.onPaymentSuccess = this.onPaymentSuccess.bind(this);
    this.onPaymentFailure = this.onPaymentFailure.bind(this);
    this.onScreenCheckoutButtonPress =
      this.onScreenCheckoutButtonPress.bind(this);
    this.handlePaymentDetails = this.handlePaymentDetails.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
  }
  componentDidUpdate(prevProps) {
    // console.log('this.props.route.params');
    // console.log(this.props.route.params);
    // console.log('prevProps.route.params');
    // console.log(prevProps.route.params);
    if (
      this.props.route.params != null &&
      this.props.route.params?.successResponse != null &&
      this.props.route.params?.successResponse !== '' &&
      (prevProps.route.params?.successResponse == null ||
        prevProps.route.params?.successResponse !==
          this.props.route.params?.successResponse)
    ) {
      const result = this.props.route.params?.successResponse;
      this.onPaymentSuccess(result);
      this.props.route.params.successResponse = '';
    } else if (
      this.props.route.params != null &&
      this.props.route.params?.failureResponse != null &&
      this.props.route.params?.failureResponse !== '' &&
      (prevProps.route.params?.failureResponse == null ||
        prevProps.route.params?.failureResponse !==
          this.props.route.params?.failureResponse)
    ) {
      const result = this.props.route.params?.failureResponse;
      this.onPaymentFailure(result);
      this.props.route.params.failureResponse = '';
    }
  }

  componentDidMount() {
    this.setState({orderId: null});
  }

  onAddressChange(key, isBilling, value) {
    if (isBilling) {
      const billingAddress = {...this.state.billingAddress, [key]: value};
      const shippingAddress = {...this.state.billingAddress, [key]: value};
      this.setState({billingAddress});
      this.setState({shippingAddress});
    } else {
      const shippingAddress = {...this.state.shippingAddress, [key]: value};
      this.setState({shippingAddress});
    }
  }

  handlePaymentDetails(key, value) {
    this.setState({[key]: value});
  }

  closePaymentModal() {
    this.setState({checkoutVisible: false});
  }

  onModalCheckoutButtonPress() {
    this.setState({checkoutVisible: true});
  }

  onScreenCheckoutButtonPress() {
    const {
      checkoutVisible,
      amount,
      currency,
      callbackUrl,
      billingAddress,
      shippingAddress,
      customerEmail,
      phoneNumber,
    } = this.state;
    const {publicKey, apiPassword} = this.props.route.params;
    this.props.navigation.push('CheckoutScreen', {
      amount: Number(amount),
      screenTitle: 'Checkout',
      title: 'Sample Geidea Payment Example Screen',
      description: 'This is an example screen to show how to use Geidea SDK',
      country: 'Egypt',
      currency: currency,
      callbackUrl: callbackUrl,
      publicKey: publicKey,
      apiPassword: apiPassword,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      showBilling: this.state.showBilling,
      merchantReferenceID: this.state.merchantReferenceID,
      showSaveCard: this.state.showSaveCard,
      sameAddress: this.state.sameAddress,
      showEmail: this.state.showEmail,
      hideLogo: this.state.hideLogo,
      showReceipt: this.state.showReceipt,
      showPhone: this.state.showPhone,
      customerEmail: customerEmail,
      phoneNumber: phoneNumber,
      lang: this.state.lang,
      paymentOperation:
        this.state.paymentOperation === 'Default (merchant configuration)'
          ? null
          : this.state.paymentOperation,
      initiatedBy: this.state.initiatedBy,
      agreementType: this.state.agreementType,
      successResponse: '',
      failureResponse: '',
      //textColor: '#ff4d00',
      //backgroundColor: '#ff4d00',
      cardColor: '#583e9e', //#ff4d00
      previousScreen: 'CheckoutFlow', // same name as in the navigation stack in App.js
    });
  }

  showToast(message, type = 'success') {
    Toast.show({
      type: type,
      text1: type,
      text2: message,
      position: 'bottom',
    });
  }

  onPaymentSuccess(response) {
    this.setState({isLoading: false});
    console.log(response);
    this.showToast(response.detailedResponseMessage);
  }
  onPaymentFailure(response) {
    this.setState({isLoading: false});
    this.showToast(response, 'error');
  }

  renderPaymentModal() {
    const {
      checkoutVisible,
      amount,
      currency,
      callbackUrl,
      billingAddress,
      shippingAddress,
      showBilling,
      showSaveCard,
      showEmail,
      hideLogo,
      showReceipt,
      customerEmail,
      phoneNumber,
      headerColor,
      showPhone,
      merchantReferenceID,
      lang,
      sameAddress,
    } = this.state;
    const {publicKey, apiPassword} = this.props.route.params;
    return (
      <PaymentModal
        amount={Number(amount)}
        visible={checkoutVisible}
        title="Sample Geidea Payment Modal Example"
        description="This is an example to show how to use Geidea SDK"
        country="Egypt"
        currency={currency}
        orderId={this.state.orderId}
        merchantReferenceID={merchantReferenceID}
        callbackUrl={callbackUrl}
        onRequestClose={this.closePaymentModal}
        publicKey={publicKey}
        apiPassword={apiPassword}
        onPaymentSuccess={this.onPaymentSuccess}
        onPaymentFailure={this.onPaymentFailure}
        lang={lang}
        billingAddress={billingAddress}
        shippingAddress={shippingAddress}
        showBilling={showBilling}
        sameAddress={sameAddress}
        showSaveCard={showSaveCard}
        showEmail={showEmail}
        hideLogo={hideLogo}
        showReceipt={showReceipt}
        customerEmail={customerEmail}
        phoneNumber={phoneNumber}
        headerColor={headerColor}
        showPhone={showPhone}
        paymentOperation={
          this.state.paymentOperation === 'Default (merchant configuration)'
            ? null
            : this.state.paymentOperation
        }
      />
    );
  }

  validateInput(inputName) {
    const input = this.state[inputName];
    if (inputName === 'phoneNumber') {
      const phoneRegex = /^\d{10}$/; // 10 digit phone number
      if (!phoneRegex.test(input)) {
        Alert.alert(
          'Invalid phone number',
          'Please enter a valid phone number.',
        );
      }
    } else if (inputName === 'customerEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');
      }
    } else if (inputName === 'headerColor') {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(input)) {
        Alert.alert(
          'Invalid hex color',
          'Valid formats include: #123456, #FFF, #A0A0A0, etc.',
        );
      }
    }
  }

  renderTextInputRow(label, varName, defaultValue) {
    return (
      <TextInput
        label={label}
        style={styles.TextInputRow}
        mode="outlined"
        dense={true}
        key={varName}
        onChangeText={this.handlePaymentDetails.bind(this, varName)}
        onBlur={this.validateInput.bind(this, varName)}
        value={defaultValue}
      />
    );
  }

  renderAddressTextInputRow(label, varName, defaultValue, isBilling) {
    return (
      <TextInput
        label={label}
        style={styles.TextInputRow}
        mode="outlined"
        dense={true}
        onChangeText={this.onAddressChange.bind(this, varName, isBilling)}
        defaultValue={defaultValue}
      />
    );
  }

  renderOrderDetails() {
    return (
      <View>
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              marginVertical: 10,
            },
          ]}>
          <TextInput
            label="Amount*"
            style={{flex: 4, marginRight: 10, backgroundColor: '#fff'}}
            mode="outlined"
            dense={true}
            onChangeText={this.handlePaymentDetails.bind(this, 'amount')}
            defaultValue={this.state.amount}
          />
          <TextInput
            label="Currency"
            style={{flex: 2, backgroundColor: '#fff'}}
            mode="outlined"
            dense={true}
            onChangeText={this.handlePaymentDetails.bind(this, 'currency')}
            defaultValue={this.state.currency}
          />
        </View>
        {this.renderTextInputRow(
          'Merchant Reference ID',
          'merchantReferenceID',
          this.state.merchantReferenceID,
        )}
        {this.renderTextInputRow(
          'Customer Email',
          'customerEmail',
          this.state.customerEmail,
        )}
        {this.renderTextInputRow(
          'Phone Number',
          'phoneNumber',
          this.state.phoneNumber,
        )}
        {this.renderTextInputRow(
          'Header Color',
          'headerColor',
          this.state.headerColor,
        )}
        {this.renderTextInputRow(
          'Callback URL',
          'callbackUrl',
          this.state.callbackUrl,
        )}
      </View>
    );
  }

  renderBillingAddressDetails(isBilling) {
    return (
      <View>
        {this.renderAddressTextInputRow(
          'Country Code',
          '_countryCode',
          isBilling
            ? this.state.billingAddress._countryCode
            : this.state.shippingAddress._countryCode,
          isBilling,
        )}
        {this.renderAddressTextInputRow(
          'Street name & number',
          '_street',
          isBilling
            ? this.state.billingAddress._street
            : this.state.shippingAddress._street,
          isBilling,
        )}
        <View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              marginVertical: 10,
            },
          ]}>
          <TextInput
            label="City"
            style={{flex: 3, marginRight: 10, backgroundColor: '#fff'}}
            mode="outlined"
            dense={true}
            onChangeText={this.onAddressChange.bind(this, '_city', isBilling)}
            defaultValue={
              isBilling
                ? this.state.billingAddress._city
                : this.state.shippingAddress._city
            }
          />
          <TextInput
            label="Postal"
            style={{flex: 3, backgroundColor: '#fff'}}
            mode="outlined"
            dense={true}
            onChangeText={this.onAddressChange.bind(
              this,
              '_postCode',
              isBilling,
            )}
            defaultValue={
              isBilling
                ? this.state.billingAddress._postCode
                : this.state.shippingAddress._postCode
            }
          />
        </View>
      </View>
    );
  }

  renderSdkLanguage() {
    return (
      <View style={styles.row}>
        <RadioGroup
          radioButtons={langOptions}
          layout="row"
          onPress={options =>
            options.forEach(option => {
              if (option.selected) {
                this.setState({lang: option.value});
              }
            })
          }
        />
      </View>
    );
  }

  renderCheckoutOptions() {
    const {
      showBilling,
      showSaveCard,
      showEmail,
      hideLogo,
      showPhone,
      showReceipt,
    } = this.state;
    return (
      <View>
        <View style={styles.row}>
          <View style={styles.CheckBox}>
            <CheckBox
              value={showBilling}
              onValueChange={val => this.setState({showBilling: val})}
            />
            <Text>Show Address</Text>
          </View>
          <View style={styles.CheckBox}>
            <CheckBox
              value={showPhone}
              onValueChange={val => this.setState({showPhone: val})}
            />
            <Text>Show phoneNumber</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.CheckBox}>
            <CheckBox
              value={showSaveCard}
              onValueChange={val => this.setState({showSaveCard: val})}
            />
            <Text>Save card</Text>
          </View>
          <View style={styles.CheckBox}>
            <CheckBox
              value={showEmail}
              onValueChange={val => this.setState({showEmail: val})}
            />
            <Text>Show Email</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.CheckBox}>
            <CheckBox
              value={showReceipt}
              onValueChange={val => this.setState({showReceipt: val})}
            />
            <Text>Show Receipt</Text>
          </View>
          <View style={styles.CheckBox}>
            <CheckBox
              value={hideLogo}
              onValueChange={val => this.setState({hideLogo: val})}
            />
            <Text>Hide Geidea logo</Text>
          </View>
        </View>
      </View>
    );
  }

  renderDropDown(varName, options) {
    return (
      <View style={{marginVertical: 10}}>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            if (varName === 'paymentOperation') {
              this.setState({paymentOperation: selectedItem});
            }
            if (varName === 'initiatedBy') {
              this.setState({initiatedBy: selectedItem});
            }
            if (varName === 'agreementType') {
              this.setState({agreementType: selectedItem});
            }
          }}
          defaultButtonText={options[0]}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return (
              <FontAwesome
                name={isOpened ? 'chevron-up' : 'chevron-down'}
                color={'#444'}
                size={18}
              />
            );
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
      </View>
    );
  }

  renderPaymentOptions() {
    return (
      <View>
        {this.renderDropDown('paymentOperation', paymentOperations)}
        {this.renderDropDown('initiatedBy', initiatedByOptions)}
        {this.renderDropDown('agreementType', agreementTypes)}
        {this.renderTextInputRow(
          'Payment Intent ID',
          'paymentIntentID',
          this.state.paymentIntentID,
        )}
      </View>
    );
  }

  render() {
    const {isLoading, amount, sameAddress} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="red" barStyle="light-content" />
        <ScrollView style={{margin: 20}}>
          <Text style={styles.title}>SDK Language</Text>
          {this.renderSdkLanguage()}

          <Text style={styles.title}>Checkout options</Text>
          {this.renderCheckoutOptions()}

          <Text style={styles.title}>Payment options</Text>
          {this.renderPaymentOptions()}

          <Text style={styles.title}>Order details</Text>
          {this.renderOrderDetails()}

          <Text style={styles.title}>Billing address</Text>
          {this.renderBillingAddressDetails(true)}

          <View style={styles.CheckBox}>
            <CheckBox
              value={sameAddress}
              onValueChange={val => {
                this.setState({sameAddress: val});
                if (val) {
                  this.setState({
                    shippingAddress: {...this.state.billingAddress},
                  });
                }
              }}
            />
            <Text>Shipping address is same as billing address</Text>
          </View>

          {sameAddress ? null : (
            <Text style={styles.title}>Shipping address</Text>
          )}
          {sameAddress ? null : this.renderBillingAddressDetails(false)}

          {this.renderPaymentModal()}
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              disabled={isLoading || amount === ''}
              onPress={this.onModalCheckoutButtonPress}
              title={'Modal Checkout'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              disabled={isLoading || amount === ''}
              onPress={this.onScreenCheckoutButtonPress}
              title={'Screen Checkout'}
            />
          </View>
        </ScrollView>
        <Toast />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#356bca',
    borderRadius: 5,
    padding: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  textField: {
    flex: 1,
    marginTop: 24,
  },
  TextInput: {
    margin: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  TextInputRow: {
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  CheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
  dropdown1BtnTxtStyle: {color: '#888', textAlign: 'left', fontSize: 16},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default HomeScreen;
