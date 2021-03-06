

export const getResult = (state) => {
  return state.number
}

export const getStaffId = (state) => {
  return ( state.userData !== null && state.userData.staffId !== null) ? state.userData.staffId : null
}

export const getStaffCode = (state) => {
  return ( state.userData !== null && state.userData.staffCode !== null) ? state.userData.staffCode : null
}

export const getRoleName = (state) => {
  return ( state.userData !== null && state.userData.roleName !== null) ? state.userData.roleName : null
}

export const getAllTable = (state) => {
  return state.tables
}

export const getLoadingCheckLogin = (state) => {
  return state.loadingCheckLogin
}

export const getLoader = (state) => {
  return state.loader;
}
