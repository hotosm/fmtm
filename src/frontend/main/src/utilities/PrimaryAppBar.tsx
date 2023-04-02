import * as React from 'react';
import windowDimention from '../hooks/WindowDimension';
import DrawerComponent from './CustomDrawer';
import CustomizedImage from '../utilities/CustomizedImage';
import { ThemeActions } from '../store/slices/ThemeSlice';
import CoreModules from '../shared/CoreModules';
import AssetModules from '../shared/AssetModules';
import { LoginActions } from '../store/slices/LoginSlice';
import { ProjectActions } from '../store/slices/ProjectSlice';

export default function PrimaryAppBar() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [brightness, setBrightness] = React.useState<boolean>(true)
  const dispatch = CoreModules.useDispatch();
  const defaultTheme: any = CoreModules.useSelector<any>(state => state.theme.hotTheme);
  const token = CoreModules.useSelector<any>(state=>state.login.loginToken)
  const handleOpenDrawer = () => {
    setOpen(true)
  }

  const handleOnCloseDrawer = () => {
    setOpen(false)
  }

  const handleLightToggle = () => {
    setBrightness(!brightness)

    const newTheme = {
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        mode: !brightness == true ? 'light' : 'dark'
      }
    }
    dispatch(ThemeActions.UpdateBrightness(newTheme))
  }

  const appBarInnerStyles = {
    logo: {
      width: 111,
      height: 32
    },
    btnLogin: {
      fontSize: defaultTheme.typography.h3.fontSize,
    }
  }

  const handleOnSignOut = ()=>{
    setOpen(false)
    dispatch(LoginActions.signOut(null))
    dispatch(ProjectActions.clearProjects([]))
  }

  const { type } = windowDimention();

  return (
    <CoreModules.Stack sx={{ flexGrow: 1 }}>
      <DrawerComponent
        open={open}
        placement={'right'}
        onClose={handleOnCloseDrawer}
        size={type == 'xs' ? 'full' : 'xs'}
        onSignOut={handleOnSignOut}
      />
      <CoreModules.AppBar position="static">
        <CoreModules.Toolbar>

          <CoreModules.Link to={'/'}>
            <CustomizedImage status={'logo'} style={appBarInnerStyles.logo} />
          </CoreModules.Link>

          <CoreModules.Link style={
            {
              marginLeft: '3%',
              textDecoration: 'none',
              color: defaultTheme.palette.info.main
            }
          } to={'/'}>
            <CoreModules.Typography
              variant="subtitle2"
              color={'info'}
              noWrap
              sx={{ display: { xs: 'none', sm: 'block', } }}
              ml={'3%'}
            >
              EXPLORE PROJECTS
            </CoreModules.Typography>
          </CoreModules.Link>

          {
            token != null && 
            <CoreModules.Stack direction={'row'}  ml={'3%'} spacing={1}>
                <AssetModules.PersonIcon color='success' sx={{ display: { xs: 'none', md: 'block'},mt:'3%' }} />
                <CoreModules.Typography
                    variant="subtitle2"
                    color={'info'}
                    noWrap
                    sx={{ display: { xs: 'none', md: 'block', } }}
                  
                  >
                    {token['username']}
                  </CoreModules.Typography>
           </CoreModules.Stack>
          }

          <CoreModules.Stack sx={{ flexGrow: 1 }} />

          <CoreModules.Stack >
            <CoreModules.IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleLightToggle}
              color="inherit"
            >
              {brightness != true ? <AssetModules.LightModeIcon /> :
                <AssetModules.DarkModeIcon />
              }
            </CoreModules.IconButton>
          </CoreModules.Stack>

          <CoreModules.Stack direction={'row'} sx={{ display: { md: 'flex', xs: 'none' } }}>

              {
                token != null ?
                 <CoreModules.Link  style={{textDecoration:'none'}} to={"/"}>
                    <CoreModules.Button
                      className='btnLogin'
                      style={appBarInnerStyles.btnLogin}
                      color="error"
                      onClick={handleOnSignOut}
                    > 
                    Sign Out
                 </CoreModules.Button>
                 </CoreModules.Link>:
                       <CoreModules.Link  style={{textDecoration:'none'}} to={"/login"}>
                        <CoreModules.Button
                            className='btnLogin'
                            style={appBarInnerStyles.btnLogin}
                            color="info"
                            > 
                            Sign in
                        </CoreModules.Button>
                  </CoreModules.Link>
              }


              <CoreModules.Link  style={{textDecoration:'none'}} to={"/signup"}>
                  <CoreModules.Button
                  className='btnLogin'
                  style={appBarInnerStyles.btnLogin}
                  color="info"
                  > 
                  Sign up
                </CoreModules.Button>
              </CoreModules.Link>

          </CoreModules.Stack>
          <CoreModules.Stack >
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
