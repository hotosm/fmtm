import React, { useState } from 'react';
import CoreModules from '@/shared/CoreModules';
import { Modal } from '@/components/common/Modal';
import { useDispatch } from 'react-redux';
import { LoginActions } from '@/store/slices/LoginSlice';
import Button from './common/Button';
import { createLoginWindow } from '@/utilfunctions/login';
import { TemporaryLoginService } from '@/api/Login';

type loginOptionsType = {
  id: string;
  name: string;
};

const loginOptions: loginOptionsType[] = [
  { id: 'osm_account', name: 'OSM Account' },
  { id: 'temp_account', name: 'Temporary Account' },
];

const LoginPopup = () => {
  const dispatch = useDispatch();

  const [activeLogin, setActiveLogin] = useState('');
  const loginModalOpen = CoreModules.useAppSelector((state) => state.login.loginModalOpen);

  const updateStatus = (currentOption: string) => {
    if (currentOption === activeLogin) {
      setActiveLogin('');
    } else {
      setActiveLogin(currentOption);
    }
  };

  const handleSignIn = () => {
    if (activeLogin === 'osm_account') {
      createLoginWindow('/');
    } else {
      dispatch(TemporaryLoginService(`${import.meta.env.VITE_API_URL}/auth/login/`));
    }
  };

  const LoginDescription = () => {
    return (
      <div className="fmtm-flex fmtm-items-start fmtm-flex-col">
        <h2 className="fmtm-text-2xl fmtm-font-bold fmtm-mb-1">Sign In</h2>
        <p className="fmtm-text-base fmtm-mb-5 fmtm-text-gray-700">Sign In with any of the accounts</p>
        <div className="fmtm-grid fmtm-grid-cols-1 sm:fmtm-grid-cols-2 fmtm-w-full fmtm-gap-6 fmtm-justify-items-center">
          {loginOptions?.map((option) => (
            <div
              key={option.id}
              onClick={() => updateStatus(option.id)}
              className={`${
                activeLogin === option.id
                  ? 'fmtm-bg-red-50 fmtm-text-primaryRed fmtm-border-primaryRed'
                  : 'fmtm-bg-white fmtm-border-gray-300 fmtm-text-gray-700'
              } fmtm-col-span-1 fmtm-w-full fmtm-max-w-[15rem] fmtm-py-3 fmtm-px-4 fmtm-rounded-md fmtm-duration-300 hover:fmtm-border-primaryRed hover:fmtm-text-primaryRed fmtm-border-[1px] fmtm-cursor-pointer fmtm-text-sm fmtm-flex fmtm-items-center fmtm-gap-3 fmtm-group`}
            >
              <div
                className={`fmtm-border-[1px] ${
                  activeLogin === option.id ? 'fmtm-border-primaryRed' : 'fmtm-border-gray-400'
                } fmtm-rounded-full fmtm-w-3 fmtm-h-3 fmtm-flex fmtm-justify-center fmtm-items-center group-hover:fmtm-border-primaryRed fmtm-duration-300`}
              >
                <div
                  className={`fmtm-h-[8px] fmtm-w-[8px] fmtm-rounded-full fmtm-duration-300 group-hover:fmtm-bg-primaryRed group-hover:fmtm-border-primaryRed ${
                    activeLogin === option.id ? 'fmtm-bg-primaryRed' : 'fmtm-bg-gray-400'
                  }`}
                ></div>
              </div>
              <p className="fmtm-text-base">{option.name}</p>
            </div>
          ))}
        </div>
        {activeLogin && (
          <div className="fmtm-w-full fmtm-flex fmtm-justify-center fmtm-mt-10">
            <Button
              btnText="Sign In"
              btnType="primary"
              onClick={handleSignIn}
              className="!fmtm-py-1 !fmtm-px-6 !fmtm-rounded-md"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Modal
        open={loginModalOpen}
        description={<LoginDescription />}
        onOpenChange={(openStatus) => {
          dispatch(LoginActions.setLoginModalOpen(openStatus));
        }}
        className=""
      />
    </div>
  );
};

export default LoginPopup;
