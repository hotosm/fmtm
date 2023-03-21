import * as React from 'react';
import { Drawer } from 'rsuite';
import CoreModules from '../shared/CoreModules';
import AssetModules from '../shared/AssetModules';




import * as React from 'react';
import clsx from 'clsx';
import { Drawer } from 'rsuite';
import { Button, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { useSelector } from 'react-redux';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { styled, Box, Theme } from '@mui/system';
import  CustomizedImage from '../utilities/CustomizedImage';
import osm from '../utilities/CustomizedImage';
import axios from 'axios';

// import cors from 'cors';

//const cors = require("cors");
//app.options("*", cors({ origin: 'http://localhost:8000', optionsSuccessStatus: 200 }));
//app.use(cors({ origin: "http://localhost:8000", optionsSuccessStatus: 200 }));

//   https://github.com/okteto/react-oauth2-login






      const CustomDrawer = ({ open, placement, size, onClose }) => {
        const defaultTheme: any = useSelector<any>(state => state.theme.hotTheme)
        const onMouseEnter = (event) => {
          const element: any = document.getElementById(`text${event.target.id}`);
          element != null ? element.style.color = `${defaultTheme.palette.error['main']}` : null
        }

        const onMouseLeave = (event) => {
          const element: any = document.getElementById(`text${event.target.id}`);
          element != null ? element.style.color = `${defaultTheme.palette.info['main']}` : null

        }


        const BackdropUnstyled = React.forwardRef<
        HTMLDivElement,
        { openmo?: boolean; className: string }
      >((props, ref) => {
        const { openmo, className, ...other } = props;
        return (
          <div
            className={clsx({ 'MuiBackdrop-open': openmo }, className)}
            ref={ref}
            {...other}
          />
        );
      });

      const Modal = styled(ModalUnstyled)`
        position: fixed;
        z-index: 1300;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const Backdrop = styled(BackdropUnstyled)`
        z-index: -1;
        position: fixed;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-tap-highlight-color: transparent;
      `;

      const style = (theme: Theme) => ({
        width: 400,
        bgcolor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
        border: '2px solid currentColor',
        padding: '16px 32px 24px 32px',
      });


      const Drawerstyles = {
        logo: {
          margin: '0 0 0 0',
        },
        list: {
          width: '100%',
          bgcolor: 'background.paper',
        },
        outlineBtn: {
          padding: 8,
          width: '100%',
          marginTop: '4%',
          borderRadius: 7,
          fontFamily: defaultTheme.typography.subtitle2.fontFamily
        },
        containedBtn: {
          padding: 8,
          width: '100%',
          marginTop: '0.7%',
          borderRadius: 7,
          fontFamily: defaultTheme.typography.subtitle2.fontFamily
        }
      };



    
  function GetOSMAuthOkButton()   { 

    return (
          <div className='GetOSMAuthOkButton'>
            <Button variant="contained" 
            color="primary"> Authorize OSM
            </Button>
          </div>
          )
  }





    const [openmo, setOpenmo] = React.useState(false);
    const handleClose = () => setOpenmo(false);
    const handleOpen = () => {setOpenmo(true);

    const clientId = "exTHbAF3HuyDknpsLPQ9WeLlIvXeUbQIIEZJhtcOoJ0"
    const clientSecret = "b0qeqlLrY1B3jaW5XijlDTbtMo90jWF4do47XFQZLSE"

 
        const options = {
          method: 'GET',
          headers: { 'accept': 'application/json' },

        // Production:    
           // Auth URL: https://www.openstreetmap.org/oauth2/authorize
           // Access Token URL: https://www.openstreetmap.org/oauth2/token
        // Development:
          //  Auth URL: https://master.apis.dev.openstreetmap.org/oauth2/authorize
          //  Access Token URL: https://master.apis.dev.openstreetmap.org/oauth2/token
        
//          url: 'https://master.apis.dev.openstreetmap.org/oauth2/authorize',
//            url: 'https://master.apis.dev.openstreetmap.org/oauth2/authorize',  
 //           url: 'https://master.apis.dev.openstreetmap.org/oauth2/token',      
          url: 'https://fmtm-api.hotosm.org/auth/osm_login/',
          }         
          console.log( options );  
          
  
          axios.request(options).then(function(res) {
            console.log(" response ");  
            console.log(res);

          // reply to auth server 

          //const authorization_code = res.data.login_url.split("code=").pop().split("&state=").shift();

          // console.log(  authorization_code );  

          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          
          };

          https://fmtm-api.hotosm.org/auth/callback/
          // ?code=BeKC3KoDsFCr8P9UCOVK8BN7MCwCFs0D11BLU8LLfns
          // &state=u1hd5h6JS16km6IuaXfiFGWFVGRFNR


// https://fmtm-api.hotosm.org/auth/callback/
//? code=Vg2Zzw72-VK-upYjbYEGWzZKRn_pW_Bo8aQa41zeCi0
// &state=u1hd5h6JS16km6IuaXfiFGWFVGRFNR

            var form = document.createElement('form');
            form.setAttribute('method', 'GET');
            form.setAttribute('action', res.data.login_url  );

            var idInput = document.createElement('input');
            idInput.setAttribute('type', 'hidden');
            idInput.setAttribute('name', 'client_id');
            idInput.setAttribute('value', 'u1hd5h6JS16km6IuaXfiFGWFVGRFNR');
            form.appendChild(idInput);

            //.. all other parameters (input elements) I need in my request.

            document.body.appendChild(form);
            form.submit();





        fetch( res.data.login_url, requestOptions)
            .then(response => response.json());

        // it wants to load a new page here - to forward to the 
        //  fmtm page , so this is  often done in a popup

             //
             // console.log(  response.json() );    
 
 
          }).catch(function(err) {
                console.log("error = " + err);
              }); 
        
        

    }



  return (
    <>



      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openmo}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
      >
        <Box sx={style}>
          <Grid  >
           <CustomizedImage status={'osm'} style={Drawerstyles.logo}/>

           <CustomizedImage status={'logo'} style={Drawerstyles.logo}/>
           </Grid>

        <GetOSMAuthOkButton></GetOSMAuthOkButton>

          <Button id="unstyled-modal-title">Authorize FMTM Access</Button>
        </Box>
      </Modal>

      <Drawer
        style={size == 'full' ? { width: '100%' } : { opacity: 1 }}
        size={size}
        placement={placement}
        open={open}
        onClose={onClose}

      >

        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
          <Box sx={{ width: 50, borderRadius: '50%', marginLeft: '0.7%' }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={onClose}
              color="info"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />
          <List sx={Drawerstyles.list} component="nav" aria-label="mailbox folders">
            {
              ['Explore Projects', 'My Contributions', 'Learn', 'About', 'Support'].map((value, index) => {
                return (
                  <ListItem
                    id={index.toString()}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    key={index}
                  >
                    <ListItemText
                      id={`text${index}`}
                      primary={value}

                    />
                  </ListItem>
                )
              })
            }
          </List>

          <Button
            variant="contained"
            color="error"
            startIcon={<LoginIcon />}
            onClick={handleOpen}
            style={Drawerstyles.containedBtn}
          >
            Sign in
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PersonIcon />}
            onClick={handleOpen}
            style={Drawerstyles.outlineBtn}
          >
            Sign up
          </Button>

        </Box>
      </Drawer>
    </>
  )
}


export default CustomDrawer;
