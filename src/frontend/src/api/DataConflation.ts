import axios from 'axios';
import { DataConflationActions } from '@/store/slices/DataConflationSlice';

export const SubmissionConflationGeojsonService: Function = (url: string) => {
  return async (dispatch) => {
    const getSubmissionGeojsonConflation = async (url) => {
      try {
        const getSubmissionConflationGeojsonResponse = await axios.get(url);
        dispatch(DataConflationActions.SetSubmissionConflationGeojson(getSubmissionConflationGeojsonResponse.data));
      } catch (error) {}
    };

    await getSubmissionGeojsonConflation(url);
  };
};
