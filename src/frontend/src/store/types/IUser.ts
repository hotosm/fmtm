import { userType } from '@/models/user/userModel';
import { paginationType } from './ICommon';

export type UserStateTypes = {
  userList: { results: userType[]; pagination: paginationType };
  userListLoading: boolean;
};
