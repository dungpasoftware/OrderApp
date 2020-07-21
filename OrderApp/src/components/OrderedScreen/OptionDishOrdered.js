import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Platform, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modalbox'


var screen = Dimensions.get('window')

function OptionButton({ text, color, option, handleMenu }) {

    return (
        <View style={{
            flex: 1,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5
        }}>
            <TouchableOpacity
                onPress={() => handleMenu(option)}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text style={{ textAlign: "center", color, fontSize: 16, fontWeight: '600' }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

function OptionDishOrdered({ handleMenu }, ref) {
    const [itemSelected, setItemSelected] = useState({})
    const optionDishRef = useRef(null);
    useImperativeHandle(ref, () => ({
        showOptionDishBox: (item) => {
            setItemSelected(item)
            optionDishRef.current.open();
        }
    }));
    function handleMenuClick(option) {
        handleMenu(option, itemSelected)
        optionDishRef.current.close()
    }

    const isOrdered = itemSelected.statusStatusId == 18
    const newHeight = isOrdered ? 320 : 360

    const checkStatus = () => {
        switch (itemSelected.statusStatusValue) {
            case "ORDERED":
                return "Đã order"
            case "PREPARATION":
                return "Bếp đang làm"
            case "COMPLETED":
                return "Bếp đã xong"
            case "OK_CANCEL":
                return "Hủy 1 phần"
            case "CANCELED":
                return "Đã bị hủy"
            default: return ""
        }
    }
    return (
        <Modal
            ref={optionDishRef}
            style={{
                borderRadius: Platform.OS == 'ios' ? 15 : 0,
                shadowRadius: 10,
                width: screen.width - screen.width / 3,
                height: newHeight,
                justifyContent: 'center',
                overflow: 'hidden'
            }}
            position='center'
            backdrop={true}
        >
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#24C3A3', justifyContent: 'space-evenly', alignItems: "center" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: 'white', fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: "center"
                        }}>
                        {itemSelected.dish != undefined ? itemSelected.dish.dishName : ''}
                    </Text>
                    <Text
                        style={{
                            textAlign: "center",
                            color: 'white', fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: "center"
                        }}>
                        {`>${checkStatus()}<`}
                    </Text>
                </View>
                <OptionButton text='Thay s.lượng & giá' color='black' option={1} handleMenu={handleMenuClick} />
                <OptionButton text='Topping & Ghi chú' color='black' option={2} handleMenu={handleMenuClick} />
                {!isOrdered && <OptionButton text='Hủy món' color='red' option={3} handleMenu={handleMenuClick} />}

            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    }
})

export default OptionDishOrdered = forwardRef(OptionDishOrdered);
