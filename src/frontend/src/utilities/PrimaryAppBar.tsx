import React, { useState } from 'react';
import windowDimention from '@/hooks/WindowDimension';
import DrawerComponent from '@/utilities/CustomDrawer';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';
import { CommonActions } from '@/store/slices/CommonSlice';
import { LoginActions } from '@/store/slices/LoginSlice';
import { ProjectActions } from '@/store/slices/ProjectSlice';
import { revokeCookies } from '@/utilfunctions/login';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/hotLog.png';
import LoginPopup from '@/components/LoginPopup';
import { useAppDispatch } from '@/types/reduxTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/common/Dropdown';
import Button from '@/components/common/Button2';

export default function PrimaryAppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);
  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleOnCloseDrawer = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (location.pathname.includes('organisation') || location.pathname.includes('organization')) {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [location]);

  const handleOnSignOut = async () => {
    setOpen(false);
    try {
      await revokeCookies();
      dispatch(LoginActions.signOut());
      dispatch(ProjectActions.clearProjects([]));
    } catch {
      dispatch(
        CommonActions.SetSnackBar({
          open: true,
          message: 'Failed to sign out.',
          variant: 'error',
          duration: 2000,
        }),
      );
    }
  };

  const { type, windowSize } = windowDimention();

  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* mapping header */}
      <div className="fmtm-px-5 fmtm-py-1">
        <p className="fmtm-body-sm-semibold fmtm-text-primaryRed">Mapping our world together</p>
      </div>
      {/* navigation bar */}
      <LoginPopup />
      <DrawerComponent open={open} onClose={handleOnCloseDrawer} size={windowSize} type={type} setOpen={setOpen} />
      <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-px-5 fmtm-py-2 fmtm-border-y fmtm-border-grey-100">
        <img
          src={logo}
          alt="FMTM Logo"
          onClick={() => navigate('/')}
          className="fmtm-w-[5.188rem] fmtm-min-w-[5.188rem] fmtm-cursor-pointer"
        />
        <div className="fmtm-hidden lg:fmtm-flex fmtm-items-center fmtm-gap-8 fmtm-ml-8">
          <Link
            to="/"
            className={`fmtm-uppercase fmtm-text-base fmtm-text-[#717171] hover:fmtm-text-[#3f3d3d] fmtm-duration-200 ${
              activeTab === 0 ? 'fmtm-border-[#706E6E]' : 'fmtm-border-white'
            } fmtm-pb-1 fmtm-border-b-2`}
          >
            Explore Projects
          </Link>
          <Link
            to="/organization"
            className={`fmtm-uppercase fmtm-text-base fmtm-text-[#717171] hover:fmtm-text-[#3f3d3d] fmtm-duration-200 ${
              activeTab === 1 ? 'fmtm-border-[#706E6E]' : 'fmtm-border-white'
            } fmtm-pb-1 fmtm-border-b-2`}
          >
            Manage Organizations
          </Link>
        </div>
        <div className="fmtm-flex fmtm-items-center fmtm-gap-2">
          {authDetails ? (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="fmtm-outline-none fmtm-w-fit">
                  {authDetails.picture ? (
                    <img
                      src={authDetails.picture}
                      alt="Profile Picture"
                      className="fmtm-w-[2.25rem] fmtm-h-[2.25rem] fmtm-rounded-full fmtm-cursor-pointer"
                    />
                  ) : (
                    <div className="fmtm-w-[2.25rem] fmtm-h-[2.25rem] fmtm-rounded-full fmtm-bg-grey-600 fmtm-flex fmtm-items-center fmtm-justify-center fmtm-cursor-default">
                      <h5 className="fmtm-text-white">{authDetails.username[0]?.toUpperCase()}</h5>
                    </div>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent
                    className="fmtm-px-0 fmtm-py-2 fmtm-border-none fmtm-bg-white !fmtm-min-w-[17.5rem] !fmtm-shadow-[0px_0px_20px_4px_rgba(0,0,0,0.12)]"
                    align="end"
                  >
                    <div className="fmtm-flex fmtm-py-2 fmtm-px-3 fmtm-gap-3 fmtm-items-center fmtm-border-b fmtm-border-b-gray-300">
                      {authDetails.picture ? (
                        <img
                          src={authDetails.picture}
                          alt="Profile Picture"
                          className="fmtm-w-[2.25rem] fmtm-h-[2.25rem] fmtm-rounded-full fmtm-cursor-pointer"
                        />
                      ) : (
                        <div className="fmtm-w-[2.25rem] fmtm-h-[2.25rem] fmtm-rounded-full fmtm-bg-grey-600 fmtm-flex fmtm-items-center fmtm-justify-center fmtm-cursor-default">
                          <h5 className="fmtm-text-white">{authDetails.username[0]?.toUpperCase()}</h5>
                        </div>
                      )}
                      <div className="fmtm-flex fmtm-flex-col">
                        <h5>{authDetails.username}</h5>
                        <p className="fmtm-body-md">{authDetails.role}</p>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={handleOnSignOut}
                        className="fmtm-flex fmtm-px-3 fmtm-py-2 fmtm-gap-2 fmtm-text-red-medium hover:fmtm-bg-red-light fmtm-cursor-pointer fmtm-duration-200"
                      >
                        <AssetModules.LogoutOutlinedIcon />
                        <p>Sign Out</p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="secondary-red" onClick={() => dispatch(LoginActions.setLoginModalOpen(true))}>
              Login
            </Button>
          )}
          <div
            onClick={handleOpenDrawer}
            className="fmtm-rounded-full hover:fmtm-bg-grey-100 fmtm-cursor-pointer fmtm-duration-200 fmtm-w-9 fmtm-h-9 fmtm-flex fmtm-items-center fmtm-justify-center"
          >
            <AssetModules.MenuIcon className="fmtm-rounded-full fmtm-text-grey-800 !fmtm-text-[20px]" />
          </div>
        </div>
      </div>
    </>
  );
}
