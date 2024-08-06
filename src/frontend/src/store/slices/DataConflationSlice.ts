import { createSlice } from '@reduxjs/toolkit';
import { DataConflationStateTypes } from '@/store/types/IDataConflation';

const initialState: DataConflationStateTypes = {
  submissionConflationGeojson: null,
  selectedFeatureOSMId: null,
};

const DataConflationSlice = createSlice({
  name: 'dataconflation',
  initialState: initialState,
  reducers: {
    SetSubmissionConflationGeojson(state, action) {
      state.submissionConflationGeojson = action.payload;
    },
    SetSelectedFeatureOSMId(state, action) {
      state.selectedFeatureOSMId = action.payload;
    },
  },
});

export const DataConflationActions = DataConflationSlice.actions;
export default DataConflationSlice;
