import * as React from "react";
import { Drawer } from "rsuite";
import { Box } from "@mui/system";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const CustomDrawer = ({ open, placement, size, onClose }) => {
  const defaultTheme: any = useSelector<any>((state) => state.theme.hotTheme);
  const onMouseEnter = (event) => {
    const element: any = document.getElementById(`text${event.target.id}`);
    element != null
      ? (element.style.color = `${defaultTheme.palette.error["main"]}`)
      : null;
  };

  const onMouseLeave = (event) => {
    const element: any = document.getElementById(`text${event.target.id}`);
    element != null
      ? (element.style.color = `${defaultTheme.palette.info["main"]}`)
      : null;
  };

  const MenuItems = [
    {
      name: "Explore Projects",
      ref: "/explore",
      isExternalLink: false,
      isActive: true,
    },
    {
      name: "My Contributions",
      ref: "TBD",
      isExternalLink: false,
      isActive: false,
    },
    {
      name: "Learn",
      ref: "https://github.com/hotosm/fmtm/wiki",
      isExternalLink: true,
      isActive: true,
    },
    {
      name: "About",
      ref: "https://github.com/hotosm/fmtm/wiki",
      isExternalLink: true,
      isActive: true,
    },
    {
      name: "Support",
      ref: "https://github.com/hotosm/fmtm/issues/",
      isExternalLink: true,
      isActive: true,
    },
  ];

  const Drawerstyles = {
    list: {
      width: "100%",
      bgcolor: "background.paper",
    },
    outlineBtn: {
      padding: 8,
      width: "100%",
      marginTop: "4%",
      borderRadius: 7,
      fontFamily: defaultTheme.typography.subtitle2.fontFamily,
    },
    containedBtn: {
      padding: 8,
      width: "100%",
      marginTop: "0.7%",
      borderRadius: 7,
      fontFamily: defaultTheme.typography.subtitle2.fontFamily,
    },
  };

  return (
    <>
      <Drawer
        style={size == "full" ? { width: "100%" } : { opacity: 1 }}
        size={size}
        placement={placement}
        open={open}
        onClose={onClose}
      >
        <Box sx={{ display: "flex", flexDirection: "column", padding: 3 }}>
          <Box sx={{ width: 50, borderRadius: "50%", marginLeft: "0.7%" }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={onClose}
              color="info"
            >
              <AssetModules.CloseIcon />
            </CoreModules.IconButton>
          </CoreModules.Stack>

          <Divider />
          <List
            sx={Drawerstyles.list}
            component="nav"
            aria-label="mailbox folders"
          >
            {MenuItems.filter((menuItem) => menuItem.isActive).map(
              (menuDetails, index) =>
                menuDetails.isExternalLink ? (
                  <a
                    href={menuDetails.ref}
                    style={{
                      textDecoration: "inherit",
                      color: "inherit",
                      fontFamily: "inherit",
                      fontWeight: 400,
                      fontSize: "1.01587rem",
                      background: "#000000",
                      opacity: 0.8,
                    }}
                  >
                    <ListItem
                      id={index.toString()}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      key={index}
                    >
                      <ListItemText
                        id={`text${index}`}
                        primary={menuDetails.name}
                      />
                    </ListItem>
                  </a>
                ) : (
                  <NavLink
                    to={menuDetails.ref}
                    style={{
                      textDecoration: "inherit",
                      color: "inherit",
                      fontFamily: "inherit",
                      fontSize: "1.01587rem",
                      background: "#000000",
                      opacity: 0.8,
                    }}
                  >
                    <ListItem
                      id={index.toString()}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      key={index}
                    >
                      <ListItemText
                        id={`text${index}`}
                        primary={menuDetails.name}
                      />
                    </ListItem>
                  </NavLink>
                )
            )}
          </List>
          <Button
            variant="contained"
            color="error"
            startIcon={<AssetModules.LoginIcon />}
            style={Drawerstyles.containedBtn}
            href="/login"
          >
            Sign in
          </CoreModules.Button>
          <CoreModules.Button
            variant="outlined"
            color="error"
            startIcon={<AssetModules.PersonIcon />}
            style={Drawerstyles.outlineBtn}
            href="/signup"
          >
            Sign up
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
