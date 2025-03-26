import React, { useEffect, useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { GetUserListService } from '@/api/User';
import { useAppDispatch, useAppSelector } from '@/types/reduxTypes';
import AssetModules from '@/shared/AssetModules';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/RadixComponents/Dialog';
import Button from '@/components/common/Button';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ManageAdmins = () => {
  const dispatch = useAppDispatch();
  const userListLoading = useAppSelector((state) => state.user.userListLoading);
  const userList = useAppSelector((state) => state.user.userList);

  const [toggleDeleteOrgModal, setToggleDeleteOrgModal] = useState(false);
  const [adminToRemove, setAdminToRemove] = useState(null);

  const userDatacolumns = [
    {
      header: 'S.N',
      cell: ({ cell }: { cell: any }) => cell.row.index + 1,
    },
    {
      header: 'Users',
      accessorKey: 'username',
      cell: ({ row }: any) => {
        return (
          <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
            {!row?.original?.profile_img ? (
              <div className="fmtm-w-[1.875rem] fmtm-h-[1.875rem] fmtm-rounded-full fmtm-bg-[#68707F] fmtm-flex fmtm-items-center fmtm-justify-center fmtm-cursor-default">
                <p className="fmtm-text-white">{row?.original?.username[0]?.toUpperCase()}</p>
              </div>
            ) : (
              <img
                src={row?.original?.profile_img}
                className="fmtm-w-[1.875rem] fmtm-h-[1.875rem] fmtm-rounded-full"
                alt="profile image"
              />
            )}
            <p>{row?.original?.username}</p>
          </div>
        );
      },
    },
    {
      header: ' ',
      cell: ({ row }: any) => {
        const user = row?.original;
        return (
          <>
            <Dialog open={toggleDeleteOrgModal} onOpenChange={setToggleDeleteOrgModal}>
              <DialogTrigger>
                <AssetModules.DeleteOutlinedIcon
                  className="fmtm-cursor-pointer hover:fmtm-text-primaryRed"
                  onClick={() => setAdminToRemove(user)}
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Organization?</DialogTitle>
                </DialogHeader>
                <div>
                  <p className="fmtm-body-lg fmtm-mb-1">
                    Are you sure you want to remove <b>{adminToRemove?.username}</b> as organization admin?
                  </p>
                  <div className="fmtm-flex fmtm-justify-end fmtm-items-center fmtm-mt-4 fmtm-gap-x-2">
                    <Button variant="link-grey" onClick={() => setToggleDeleteOrgModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary-red"
                      isLoading={false}
                      onClick={() => {
                        console.log(row.original);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 13,
  });

  useEffect(() => {
    dispatch(
      GetUserListService(`${VITE_API_URL}/users`, {
        results_per_page: 13,
        page: pagination.pageIndex + 1,
      }),
    );
  }, [pagination]);

  return (
    <div className="fmtm-h-full fmtm-flex fmtm-flex-col fmtm-py-6 fmtm-max-w-[37.5rem] fmtm-mx-auto">
      <DataTable
        data={userList || []}
        columns={userDatacolumns}
        isLoading={userListLoading}
        pagination={{ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }}
        setPaginationPage={(page) => setPagination(page)}
        tableWrapperClassName="fmtm-flex-1"
      />
    </div>
  );
};

export default ManageAdmins;
