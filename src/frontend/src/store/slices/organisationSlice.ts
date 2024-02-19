import CoreModules from '@/shared/CoreModules.js';
import { IOrganisationState } from '../types/IOrganisation';

const initialState: IOrganisationState = {
  organisationFormData: {},
  organisationData: [],
  myOrganisationData: [],
  postOrganisationData: null,
  organisationDataLoading: false,
  postOrganisationDataLoading: false,
  consentDetailsFormData: {
    give_consent: '',
    review_documentation: [],
    log_into: [],
    participated_in: [],
  },
  consentApproval: false,
};
const OrganisationSlice = CoreModules.createSlice({
  name: 'organisation',
  initialState: initialState,
  reducers: {
    GetOrganisationsData(state, action) {
      state.organisationData = action.payload;
    },
    GetOrganisationDataLoading(state, action) {
      state.organisationDataLoading = action.payload;
    },
    GetMyOrganisationsData(state, action) {
      state.myOrganisationData = action.payload;
    },
    GetMyOrganisationDataLoading(state, action) {
      state.myOrganisationDataLoading = action.payload;
    },
    postOrganisationData(state, action) {
      state.postOrganisationData = action.payload;
    },
    PostOrganisationDataLoading(state, action) {
      state.postOrganisationDataLoading = action.payload;
    },
    SetOrganisationFormData(state, action) {
      state.organisationFormData = action.payload;
    },
    SetConsentDetailsFormData(state, action) {
      state.consentDetailsFormData = action.payload;
    },
    SetConsentApproval(state, action) {
      state.consentApproval = action.payload;
    },
    SetIndividualOrganization(state, action) {
      state.organisationFormData = action.payload;
    },
  },
});

export const OrganisationAction = OrganisationSlice.actions;
export default OrganisationSlice;
