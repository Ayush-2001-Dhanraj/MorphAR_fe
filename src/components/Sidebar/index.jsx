// Sidebar.js
import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        // ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

function SideBar() {
  const [open, setOpen] = React.useState(false);

  const handleToggleDrawer = () => {
    setOpen((preV) => !preV);
  };

  const handleNewChat = () => {
    console.log("New Chat");
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          height: "100%",
          position: "relative",
          backgroundColor: "var(--primary-color)",
          color: "var(--text-color)",
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggleDrawer} sx={{ paddingLeft: 1.5 }}>
          <MenuIcon fontSize="small" sx={{ color: "var(--text-color)" }} />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        mt={4}
        p={1}
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <IconButton
          onClick={handleNewChat}
          sx={{
            backgroundColor: "var(--background-color)",
            borderRadius: open ? 4 : 50,
            display: "inherit",
            justifyContent: "flex-start",
            paddingLeft: 1.5,
            "&:hover": {
              backgroundColor: "var(--background-color)",
            },
          }}
        >
          <AddIcon sx={{ color: "var(--secondary-color)" }} />
          {open && (
            <Typography
              variant="subtitle2"
              pl={1}
              color="var(--secondary-color)"
            >
              New Chat
            </Typography>
          )}
        </IconButton>
      </Box>
    </Drawer>
  );
}

export default SideBar;
