import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Platform, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native'
import { MAIN_COLOR } from '../../common/color'
import Modal from 'react-native-modalbox'
import Feather from 'react-native-vector-icons/Feather';

import orderApi from '../../api/orderApi'


var screen = Dimensions.get('window')

function NumberButton({ number, handleClickNumber }) {
    return (
        <View style={{
            flex: 1,
            borderColor: 'black',
            borderWidth: 0.5,
            marginHorizontal: 3,
            marginBottom: 6
        }}>
            <TouchableHighlight
                onPress={() => handleClickNumber(number)}
                underlayColor={MAIN_COLOR}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: '600' }}>{number}</Text>
            </TouchableHighlight>
        </View>
    )
}

function ChangeAP({ userInfo }, ref) {
    const [newItemSelected, setNewItemSelected] = useState({})
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState('0')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [conTrinh, setConTrinh] = useState(true)

    const changeAPRef = useRef(null);
    useImperativeHandle(ref, () => ({
        showChangeAPRefBox: (itemSelected) => {
            setNewItemSelected(itemSelected)
            setAmount(itemSelected.quantityOk != null ? itemSelected.quantityOk.toString() : "0")
            setPrice(itemSelected.quantityOk != null ? itemSelected.sellPrice.toString() : "0")
            setConTrinh(true)
            setErrorMessage('')
            changeAPRef.current.open();
        },
        closeChangeAPRefBox: () => {
            if (changeAPRef.current.state.isOpen) {
                changeAPRef.current.close()
            }
        }
    }));

    function _handleChangeCancelQuantity(type, value) {
        const oldAmount = parseInt(amount)
        let newAmount = oldAmount + value
        if (type == 'sub' && newAmount < 0) {
            return
        }
        if (type == 'sub' && newItemSelected.statusStatusId != 18 && newItemSelected.quantityOk > newAmount) {
            return
        }
        if (newAmount > 999) {
            setAmount(999)
        } else {
            setAmount(newAmount)
        }
    }


    //!handle submit
    const handleSubmitChange = () => {
        setErrorMessage('')
        setIsLoading(true)
        if (parseInt(amount) == newItemSelected.quantityOk && parseFloat(price) == newItemSelected.sellPrice) {
            setIsLoading(false)
            changeAPRef.current.close()
            return
        }
        let newData = {
            orderOrderId: newItemSelected.orderOrderId,
            orderDishId: newItemSelected.orderDishId,
            quantityOk: parseInt(amount),
            sellPrice: parseFloat(price),
            sumPrice: parseFloat(amount) * parseFloat(price),
            modifiedBy: userInfo.staffCode
        }
        orderApi.changeAPByOrderDishId(userInfo.accessToken, newData)
            .then(response => {
                if (response.status != undefined && response.status == 200) {
                    setIsLoading(false)
                    setErrorMessage('')
                    changeAPRef.current.close()
                } else {
                    setErrorMessage(response)
                    setIsLoading(false)
                }

            })
            .catch(err => {
                setErrorMessage('Thay đổi thất bại')
                console.log("Thay đổi thất bại", err)
                setIsLoading(false)
            })
    }
    function handleCancelModal() {
        setIsLoading(false)
        changeAPRef.current.close()
    }

    function handleClickNumber(number) {
        const fakeSet = setPrice
        let newResult = price


        if (number == "Del") {
            if (conTrinh) {
                setConTrinh(false)
            }
            if (newResult.length <= 1) {
                newResult = "0"
            } else {
                newResult = newResult.slice(0, -1);
            }

        } else if (number == "AC") {
            if (conTrinh) {
                setConTrinh(false)
            }
            newResult = "0"
        }
        else {
            if (newResult.length <= 9) {
                if (conTrinh) {
                    newResult = "0"
                    setConTrinh(false)
                }
                if (newResult == "0") {
                    newResult = number
                } else {
                    newResult += number
                }
            }

        }
        fakeSet(newResult)
    }
    return (
        <Modal
            ref={changeAPRef}
            style={{
                borderRadius: 15,
                shadowRadius: 10,
                width: screen.width - 20,
                height: errorMessage != '' ? 500 : 470,
                justifyContent: 'center',
                overflow: 'hidden'
            }}
            position='center'
            backdrop={true}
        >
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#24C3A3', justifyContent: 'center', alignItems: "center" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: 'white', fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: "center"
                        }}>
                        {newItemSelected.dish != undefined ? newItemSelected.dish.dishName : ''}
                    </Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: 'red', padding: 8 }}>
                    {
                        newItemSelected.statusStatusId == 18 ? 'Món ăn đang chưa được làm, có thể thay đổi số lượng và giá'
                            : 'Món ăn ở trạng thái không thể giảm số lượng được, nếu muốn giảm có thể vào phần hủy món'
                    }

                </Text>
                {/* Phần tính toán */}
                <View style={{ flex: 7, flexDirection: 'row', paddingHorizontal: 8 }}>
                    <View style={{ flexDirection: 'column', flex: 4 }}>
                        <Text style={{ fontSize: 15, marginBottom: 3, fontWeight: '500' }}>Nhập giá thay đổi:</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', flex: 1, }}>
                                <NumberButton number={'1'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'4'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'7'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'AC'} handleClickNumber={handleClickNumber} />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, }}>
                                <NumberButton number={'2'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'5'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'8'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'0'} handleClickNumber={handleClickNumber} />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, }}>
                                <NumberButton number={'3'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'6'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'9'} handleClickNumber={handleClickNumber} />
                                <NumberButton number={'Del'} handleClickNumber={handleClickNumber} />
                            </View>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'column', flex: 3, alignItems: 'center', marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 15, marginBottom: 3, fontWeight: '500' }}>Thay đổi số lượng: </Text>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-start', marginHorizontal: 8 }}>
                            <TouchableOpacity
                                disabled={(newItemSelected.statusStatusId != 18 && newItemSelected.quantityOk >= amount) ? true : false}
                                onPress={() => _handleChangeCancelQuantity('sub', -1)}
                                onLongPress={() => _handleChangeCancelQuantity('sub', -10)}
                            >
                                <Feather name="minus-circle"
                                    color={(newItemSelected.statusStatusId != 18 && newItemSelected.quantityOk >= amount) ? 'gray' : 'red'} size={40} />
                            </TouchableOpacity>
                            <View
                                // onPress={() => setIsAmountFocuse(true)}
                                style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{
                                    marginTop: 9,
                                    textAlign: 'center',
                                    //  backgroundColor: isAmountFocuse ? '#9FE5D7' : 'white',
                                    backgroundColor: 'white'
                                    , fontSize: 18, fontWeight: '600'
                                }}>
                                    {amount}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => _handleChangeCancelQuantity('add', 1)}
                                onLongPress={() => _handleChangeCancelQuantity('add', 10)}
                            >
                                <Feather name="plus-circle" color='green' size={40} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ marginHorizontal: 3 }}>x</Text>
                        <View
                            // onPress={() => setIsAmountFocuse(false)}
                            style={{ flex: 1 }}>
                            <Text style={{
                                textAlign: 'center',
                                // backgroundColor: isAmountFocuse ? 'white' : '#9FE5D7',
                                backgroundColor: 'white'
                                , fontSize: 18, fontWeight: '600'
                            }}>
                                {new Intl.NumberFormat().format(price)}
                            </Text>
                        </View>
                        <Text style={{ marginHorizontal: 3, fontSize: 15, fontWeight: '500', marginBottom: 5 }}>Tổng:</Text>
                        <Text style={{
                            flex: 1, textAlign: "center", fontSize: 18, fontWeight: '600'
                        }}>{new Intl.NumberFormat().format(parseFloat(amount) * parseFloat(price))}</Text>
                    </View>

                </View>


                {errorMessage != '' && <View style={{ flexDirection: 'row', paddingLeft: 5, width: screen.width - 40 }}>
                    <Feather name={'alert-triangle'} size={18} color='red' />
                    <Text style={{ color: 'red', fontSize: 16, marginLeft: 8 }}>{errorMessage}</Text>
                </View>}
                {/* Phần button dưới cùng */}
                {isLoading ? <ActivityIndicator style={{ alignSelf: 'center', flex: 1, paddingBottom: 8 }} size="large" color={MAIN_COLOR} />
                    : <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 }}>
                        <TouchableOpacity
                            onPress={handleCancelModal}
                            style={{
                                backgroundColor: 'red', flex: 1, height: 40, alignItems: "center",
                                justifyContent: 'center', marginHorizontal: 5, borderRadius: 5
                            }}>
                            <Text
                                style={{ textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' }}
                            >Hủy
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmitChange}
                            style={{
                                backgroundColor: 'green', flex: 1, height: 40, alignItems: "center",
                                justifyContent: 'center', marginHorizontal: 5, borderRadius: 5
                            }}>
                            <Text
                                style={{
                                    textAlign: 'center', color: 'white',
                                    fontSize: 18, fontWeight: 'bold'
                                }}
                            >Đồng ý
                            </Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    }
})

export default ChangeAP = forwardRef(ChangeAP);
