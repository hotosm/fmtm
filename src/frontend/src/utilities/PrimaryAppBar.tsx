import * as React from 'react';
import windowDimention from '@/hooks/WindowDimension';
import DrawerComponent from '@/utilities/CustomDrawer';
import CustomizedImage from '@/utilities/CustomizedImage';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';
import { CommonActions } from '@/store/slices/CommonSlice';
import { LoginActions } from '@/store/slices/LoginSlice';
import { ProjectActions } from '@/store/slices/ProjectSlice';
import { createLoginWindow, revokeCookie } from '@/utilfunctions/login';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PrimaryAppBar() {
  const location = useLocation();
  const [open, setOpen] = React.useState<boolean>(false);
  const dispatch = CoreModules.useAppDispatch();
  const defaultTheme: any = CoreModules.useAppSelector((state) => state.theme.hotTheme);
  const token = CoreModules.useAppSelector((state) => state.login.loginToken);
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

  const appBarInnerStyles = {
    logo: {
      width: 111,
      height: 32,
    },
    btnLogin: {
      fontSize: defaultTheme.typography.h3.fontSize,
    },
  };

  const handleOnSignOut = async () => {
    setOpen(false);
    try {
      await revokeCookie();
      dispatch(LoginActions.signOut(null));
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
    <CoreModules.Stack sx={{ flexGrow: 0 }}>
      <DrawerComponent
        open={open}
        placement={'right'}
        onClose={handleOnCloseDrawer}
        size={windowSize}
        type={type}
        onSignOut={handleOnSignOut}
        setOpen={setOpen}
      />
      <CoreModules.AppBar
        position="static"
        sx={{ boxShadow: 0, borderBottom: '1px solid #e1e0e0', borderTop: '1px solid #e1e0e0' }}
      >
        <CoreModules.Toolbar>
          <CoreModules.Link to={'/'}>
            <CustomizedImage status={'logo'} style={appBarInnerStyles.logo} />
          </CoreModules.Link>

          {/* Tabs switch added */}
          <CoreModules.Tabs
            sx={{
              marginLeft: '2%',
              flexGrow: 20,
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block',
                lg: 'block',
              },
            }}
            className="header-tabs"
          >
            <CoreModules.Link to={'/'} style={{ color: defaultTheme.palette.black }}>
              <CoreModules.Tab
                label="EXPLORE PROJECTS"
                sx={{
                  borderBottom: activeTab === 0 ? '2.5px solid #2c3038' : 'none',
                  '&:hover': { backgroundColor: '#ffff' },
                  fontSize: 16,
                }}
                onClick={() => setActiveTab(0)}
              />
            </CoreModules.Link>
            <CoreModules.Link to={'/organisation'} style={{ color: defaultTheme.palette.black }}>
              <CoreModules.Tab
                label="MANAGE ORGANIZATIONS"
                sx={{
                  borderBottom: activeTab === 1 ? '2.5px solid #2c3038' : 'none',
                  '&:hover': { backgroundColor: '#fff' },
                  fontSize: 16,
                }}
                onClick={() => setActiveTab(1)}
              />
            </CoreModules.Link>
          </CoreModules.Tabs>
          {/* position changed */}
          {token != null && (
            <CoreModules.Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
              {token['picture'] !== 'null' && token['picture'] ? (
                <CoreModules.Stack
                  className="fmtm-w-7 fmtm-h-7 fmtm-flex fmtm-items-center fmtm-justify-center fmtm-overflow-hidden fmtm-rounded-full fmtm-border-[1px]"
                  sx={{ display: { xs: 'none', md: 'block' }, mt: '3%' }}
                >
                  <img src={token['picture']} alt="Profile Picture" />
                </CoreModules.Stack>
              ) : (
                <AssetModules.PersonIcon color="success" sx={{ display: { xs: 'none', md: 'block' }, mt: '3%' }} />
              )}
              <CoreModules.Typography
                variant="typography"
                color={'info'}
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {token['username']}
              </CoreModules.Typography>
            </CoreModules.Stack>
          )}

          <CoreModules.Stack sx={{ flexGrow: 1 }} />
          <CoreModules.Stack direction={'row'} sx={{ display: { md: 'flex', xs: 'none' } }}>
            {token != null ? (
              <CoreModules.Link style={{ textDecoration: 'none' }} to={'/'}>
                <CoreModules.Button
                  className="btnLogin fmtm-truncate"
                  style={appBarInnerStyles.btnLogin}
                  color="error"
                  onClick={handleOnSignOut}
                >
                  Sign Out
                </CoreModules.Button>
              </CoreModules.Link>
            ) : (
              <CoreModules.Button
                className="btnLogin fmtm-truncate"
                style={appBarInnerStyles.btnLogin}
                color="info"
                onClick={() => createLoginWindow('/')}
              >
                Sign in
              </CoreModules.Button>
            )}
          </CoreModules.Stack>
          <CoreModules.Stack>
            <CoreModules.IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleOpenDrawer}
              color="inherit"
            >
              <AssetModules.MenuIcon />
            </CoreModules.IconButton>
          </CoreModules.Stack>
        </CoreModules.Toolbar>
      </CoreModules.AppBar>
    </CoreModules.Stack>
  );
}
