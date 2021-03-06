import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Text, Alert } from 'react-native'
import SideMenu from 'react-native-side-menu-updated'
import Feather from 'react-native-vector-icons/Feather';

import TableItem from './TableItem'
import FloorItem from './FloorItem'
import UserSideMenu from '../UserSideMenu'
import { loadTable, socketLoadTable } from './../../actions/listTable'
import { createNewOrder, loadOrderInfomation } from './../../actions/dishOrdering'
import TableOption from './TableOption';
import TableOrderComment from './TableOrderComment';
import { ORDER_SCREEN, RETURN_DISH_SCREEN, SWITCH_TABLE_SCREEN } from '../../common/screenName';
import { MAIN_COLOR } from '../../common/color';

// socket
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import CancelTableModal from './CancelTableModal';
import { ROOT_API_CONNECTION } from '../../common/apiConnection';
import orderApi from '../../api/orderApi';
import { showToast } from '../../common/functionCommon';





export default function ListTableScreen({ route, navigation }) {

    const dispatch = useDispatch()
    const { userInfo } = route.params;
    const { accessToken } = userInfo
    const [locationTableId, setLocationTableId] = useState(0)
    const [listTableScreen, setListTableScreen] = useState([])
    const [dataNavigate, setDataNavigate] = useState({ isNavigate: false, tableName: '1' })


    const listTable = useSelector(state => state.listTable.listTable)
    const listLocation = useSelector(state => state.listTable.listLocation)
    const isLoading = useSelector(state => state.listTable.isLoading)
    const error = useSelector(state => state.listTable.error)

    const newOrderId = useSelector(state => state.dishOrdering.rootOrder.orderId)
    const { createOrderIsLoading, createOrderError } = useSelector(state => state.dishOrdering)

    function addOpenLocation(listLocation) {
        if (createOrderError != null) {
            showToast("Hệ thống không phản hồi!")
        }
        if (listLocation == null || listLocation.length == 0) return
        let newListLocation = [...listLocation]
        newListLocation.unshift({
            locationTableId: 0,
            locationCode: 'SPECIAL',
            locationName: 'Đang mở',
            statusValue: 'READY'
        })
        return newListLocation
    }

    if (error != null) {
        Alert.alert(
            'Lỗi',
            "Có gì đó xảy ra.",
            [
                {
                    text: 'Thử lại',
                    onPress: async () => {
                        dispatch(loadTable({ accessToken }))
                    },
                    style: 'cancel'
                },

            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        if (dataNavigate.isNavigate) {
            setDataNavigate({ ...dataNavigate, isNavigate: false })
            navigation.navigate(ORDER_SCREEN, { userInfo, status: 'READY', orderId: newOrderId, tableName: dataNavigate.tableName })
        }
    }, [newOrderId])

    useEffect(() => {
        let socket = new SockJS(`${ROOT_API_CONNECTION}/rms-websocket`);
        let stompClient = Stomp.over(socket);
        //!function support
        function successCallback(stompClient) {
            console.log('socket List Table connected');
            stompClient.subscribe("/topic/tables", ({ body }) => {
                let tableData = JSON.parse(body);
                console.log('socket table run', tableData)
                dispatch(socketLoadTable({ listTable: tableData }))
            });
        }
        //!main function
        function connectAndReconnect(successCallback) {
            socket = new SockJS(`${ROOT_API_CONNECTION}/rms-websocket`);
            stompClient = Stomp.over(socket);
            stompClient.debug = () => { }
            stompClient.connect(
                {
                    token: accessToken
                },
                frame => {

                    successCallback(stompClient)
                },
                error => {
                    console.log('socket listtable die')
                    setTimeout(() => {
                        connectAndReconnect(successCallback);
                    }, 5000);
                }
            );
        }
        //! call function
        connectAndReconnect(successCallback)
        //! when unmount
        return () => {
            console.log('Socket listTable disconnected')
            stompClient.disconnect();
        }

    }, []);


    function formatData(dataTableDetail, numColumns) {
        const numberOfFullRows = Math.floor(dataTableDetail.length / numColumns);

        let numberOfElementsLastRow = dataTableDetail.length - (numberOfFullRows * numColumns)
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            dataTableDetail.push({ tableId: `black-${numberOfElementsLastRow}`, empty: true })
            numberOfElementsLastRow = numberOfElementsLastRow + 1
        }

        return dataTableDetail
    }

    useLayoutEffect(() => {
        dispatch(loadTable({ accessToken }))
    }, [navigation])


    useEffect(() => {
        async function _loadScreenTable() {
            let newListTable = [...listTable]
            if (locationTableId == 0) {
                newListTable = newListTable.filter(table => {
                    return table.statusId == 5 || table.statusId == 6
                })
            } else {
                newListTable = newListTable.filter(table => {
                    return table.locationId == locationTableId
                })
            }
            newListTable = formatData(newListTable, 2)

            setListTableScreen(newListTable)
        }
        _loadScreenTable()

    }, [locationTableId, listTable])



    const handlePressTable = (item) => {

        if (item.statusValue == "READY") {
            setDataNavigate({ isNavigate: true, tableName: item.tableName })
            dispatch(createNewOrder({ userInfo, tableId: item.tableId }))

        } else {
            dispatch(loadOrderInfomation({
                orderId: item.orderDto.orderId,
                orderCode: item.orderDto.orderCode,
                statusId: item.orderDto.statusId,
                tableId: item.tableId,
                totalAmount: item.orderDto.totalAmount,
                totalItem: item.orderDto.totalItem
            }))
            navigation.navigate(ORDER_SCREEN, { userInfo, status: item.statusValue, orderId: item.orderDto.orderId, tableName: item.tableName })
        }

    }
    const [open, setOpen] = useState(false)
    function openMenu() {
        let isOpen = open;
        setOpen(!isOpen)
    }
    const menu = <UserSideMenu openMenu={openMenu} userInfo={userInfo} navigation={navigation} />


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => openMenu()}
                >
                    <Feather name="menu" size={40} color='white' />
                </TouchableOpacity>
            ),
        });
    });
    function showOptionDetail(option, itemSelected) {
        switch (option) {
            case 1: {
                orderApi.waitingForPayment(accessToken, { orderId: itemSelected.orderDto.orderId }).then(response => {
                    if (response.data == undefined) {
                        Alert.alert(
                            'Thông báo!',
                            response,
                            [
                                {
                                    text: 'Tôi hiểu',
                                    style: 'cancel'
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }).catch(err => {
                    Alert.alert(
                        'Lỗi!',
                        err,
                        [
                            {
                                text: 'Thoát',
                                style: 'cancel'
                            }
                        ],
                        { cancelable: false }
                    );
                })
                break;
            }
            case 2: {
                showTableOrderCommentBox(itemSelected)
                break
            }
            case 3: {
                navigation.navigate(RETURN_DISH_SCREEN, { userInfo, orderId: itemSelected.orderDto.orderId })
                break
            }
            case 4: {
                showCancelTableModal(itemSelected)
                break
            }
            case 5: {
                navigation.navigate(SWITCH_TABLE_SCREEN, {
                    userInfo, rootOrder: {
                        orderId: itemSelected.orderDto.orderId,
                        tableId: itemSelected.tableId,
                        statusId: itemSelected.orderDto.statusId,
                    }, status: -1
                })
                break
            }
            default: console.log(itemSelected)
                break;
        }

    }

    const tableOptionRef = useRef(null)
    function showTableOption(item) {
        tableOptionRef.current.showTableOptionBox(item);
    }
    const tableOrderCommentRef = useRef(null)
    function showTableOrderCommentBox(itemSelected) {
        tableOrderCommentRef.current.showTableOrderCommentBox(itemSelected);
    }
    const cancelTableOrderRef = useRef(null)
    function showCancelTableModal(itemSelected) {
        cancelTableOrderRef.current.showCancelTableModal(itemSelected);
    }


    return (
        <SideMenu
            menu={menu}
            isOpen={open}
            menuPosition='right'
            disableGestures={true}
            onChange={() => setOpen(!open)}
        >
            <View style={styles.container}>
                <View >
                    <FlatList
                        data={addOpenLocation(listLocation)}
                        horizontal={true}
                        keyExtractor={(item, index) => item.locationTableId.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <FloorItem item={item} index={index} locationTableId={locationTableId} handleLoadTable={setLocationTableId} />
                            )
                        }}
                    />
                </View>
                <View style={styles.line_view}></View>
                <View style={{ flex: 10, marginRight: 8 }}>
                    {(isLoading || createOrderIsLoading) ? <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color={MAIN_COLOR} />
                        : (listTableScreen.length <= 0 && locationTableId == 0) ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{'Chưa có bàn nào được sử dụng'}</Text>
                        </View> :
                            <FlatList
                                data={listTableScreen}
                                keyExtractor={(item, index) => item.tableId.toString()}
                                numColumns={2}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TableItem item={item} index={index} handlePressTable={handlePressTable} showTableOption={showTableOption} />
                                    )
                                }}
                            />}

                </View>
                <TableOption ref={tableOptionRef} handleMenu={showOptionDetail} />
                <TableOrderComment ref={tableOrderCommentRef} accessToken={accessToken} />
                <CancelTableModal ref={cancelTableOrderRef} userInfo={userInfo} navigation={navigation} />
            </View>
        </SideMenu>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    line_view: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.6)'
    },
})
