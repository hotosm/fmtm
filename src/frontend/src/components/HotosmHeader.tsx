import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CoreModules from '@/shared/CoreModules';
import { CommonActions } from '@/store/slices/CommonSlice';
import { LoginActions } from '@/store/slices/LoginSlice';
import { ProjectActions } from '@/store/slices/ProjectSlice';
import { revokeCookies } from '@/utilfunctions/login';
import hotLogo from '@/assets/images/favicon.svg';
import LoginPopup from '@/components/LoginPopup';
import { useAppDispatch } from '@/types/reduxTypes';
import { useIsAdmin } from '@/hooks/usePermissions';
import { user_roles } from '@/types/enums';

export default function HotosmHeader() {
  const isAdmin = useIsAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);

  const handleOnSignOut = async () => {
    setDrawerOpen(false);
    try {
      await revokeCookies();
      dispatch(LoginActions.signOut());
      dispatch(ProjectActions.clearProjects([]));
    } catch {
      dispatch(
        CommonActions.SetSnackBar({
          message: 'Failed to sign out.',
        }),
      );
    }
  };

  const menuItems = [
    {
      name: 'Explore Projects',
      path: '/',
      isExternalLink: false,
      isActive: true,
    },
    {
      name: 'Manage Users',
      path: '/manage/user',
      isExternalLink: false,
      isActive: authDetails?.role === user_roles.ADMIN,
    },
    {
      name: 'Manage Organizations',
      path: '/organization',
      isExternalLink: false,
      isActive: true,
    },
    {
      name: 'Learn',
      path: 'https://hotosm.github.io/fmtm',
      isExternalLink: true,
      isActive: true,
    },
    {
      name: 'About',
      path: 'https://docs.fmtm.dev/about/about/',
      isExternalLink: true,
      isActive: true,
    },
    {
      name: 'Support',
      path: 'https://github.com/hotosm/fmtm/issues/',
      isExternalLink: true,
      isActive: true,
    },
    {
      name: 'Download Custom ODK Collect',
      path: 'https://github.com/hotosm/odkcollect/releases/download/v2024.3.5-entity-select/ODK-Collect-v2024.3.5-HOTOSM-FMTM.apk',
      isExternalLink: true,
      isActive: true,
    },
  ];

  return (
    <>
      <div className="fmtm-px-5 fmtm-py-1">
        <p className="fmtm-body-sm-semibold fmtm-text-primaryRed">Mapping our world together</p>
      </div>

      <hot-header
        title="HOT OSM Tools"
        size="small"
        borderBottom={true}
        drawer={true}
        showLogin={true}
        loginProviders={JSON.stringify({
          "osm": {
            "icon": "https://www.openstreetmap.org/assets/osm_logo-4b074077c29e100f40ee64f5177886e36b570d4cc3ab10c7b263003d09642e3f.svg",
            "loginUrl": "https://www.openstreetmap.org/oauth2/authorize",
            "redirectUrl": "https://ui.hotosm.com/auth/callback",
            "name": "OpenStreetMap"
          },
          "google": {
            "icon": "https://developers.google.com/identity/images/g-logo.png",
            "loginUrl": "https://accounts.google.com/o/oauth2/auth",
            "redirectUrl": "https://ui.hotosm.com/auth/callback", 
            "name": "Google"
          }
        })}
        defaultLoginIcon="user"
        onLogin={() => {
          console.log('Login event dispatched');
        }}
      />


      
    </>
  );
} 