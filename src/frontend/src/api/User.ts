import axios, { AxiosResponse } from 'axios';
import { AppDispatch } from '@/store/Store';
import { UserActions } from '@/store/slices/UserSlice';
import { userType } from '@/models/user/userModel';
import { paginationType } from '@/store/types/ICommon';

export const GetUserListService = (url: string, params: { page: number; results_per_page: number; search: string }) => {
  return async (dispatch: AppDispatch) => {
    dispatch(UserActions.SetUserListLoading(true));

    const getUserList = async (url: string) => {
      try {
        const response: AxiosResponse<{ results: userType[]; pagination: paginationType }> = await axios.get(url, {
          params,
        });
        dispatch(UserActions.SetUserList(response.data));
      } catch (error) {
      } finally {
        dispatch(UserActions.SetUserListLoading(false));
      }
    };

    await getUserList(url);
  };
};
