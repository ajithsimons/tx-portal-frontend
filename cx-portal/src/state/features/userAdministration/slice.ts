import { createSlice } from '@reduxjs/toolkit'
import {
  RegistrationRequestAPIResponse,
  RegistrationRequestDataGrid,
  TenantUser,
  UserAdministrationState,
} from './types'
import { fetchTenantUsers, fetchRegistrationRequests } from './actions'
import { mapRegistrationRequestResponseToDataGrid } from 'utils/dataMapper'
import { RootState } from 'state/store'

const initialState: UserAdministrationState = {
  tenantUsers: [],
  registrationRequests: [],
  loading: false,
  error: '',
  addUserOpen: false,
}

const userAdministrationSlice = createSlice({
  name: 'userAdministration',
  initialState,
  reducers: {
    openAddUser: (state) => ({
      ...state,
      addUserOpen: true,
    }),
    closeAddUser: (state) => ({
      ...state,
      addUserOpen: false,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTenantUsers.pending, (state) => ({
      ...state,
      tenantUsers: [],
      loading: true,
      error: '',
    }))
    builder.addCase(fetchTenantUsers.fulfilled, (state, { payload }) => ({
      ...state,
      tenantUsers: payload || [],
      loading: false,
      error: '',
    }))
    builder.addCase(fetchTenantUsers.rejected, (state, action) => ({
      ...state,
      tenantUsers: [],
      loading: false,
      error: action.error.message as string,
    }))
    builder.addCase(fetchRegistrationRequests.pending, (state) => {
      state.registrationRequests = []
      state.loading = true
      state.error = ''
    })
    builder.addCase(
      fetchRegistrationRequests.fulfilled,
      (state, { payload }) => {
        const payloadList = payload as Array<RegistrationRequestAPIResponse>
        state.registrationRequests =
          (mapRegistrationRequestResponseToDataGrid(
            payloadList
          ) as Array<RegistrationRequestDataGrid>) || []
        state.loading = false
        state.error = ''
      }
    )
    builder.addCase(fetchRegistrationRequests.rejected, (state, action) => {
      state.registrationRequests = []
      state.loading = false
      state.error = action.error.message as string
    })
  },
})

export const userAdministrationSelector = (
  state: RootState
): UserAdministrationState => state.userAdministration

export const addUserOpenSelector = (state: RootState): boolean =>
  state.userAdministration.addUserOpen
export const tenantUsersSelector = (state: RootState): TenantUser[] =>
  state.userAdministration.tenantUsers
export const registrationRequestsSelector = (
  state: RootState
): RegistrationRequestDataGrid[] =>
  state.userAdministration.registrationRequests

export default userAdministrationSlice
