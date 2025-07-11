// Sidebar.js
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/features/user/userSlice";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import GestureIcon from "@mui/icons-material/Gesture";
import {
  getAllChats,
  updateAllChats,
  updateChat,
} from "../../redux/features/chat/chatSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatService from "../../services/chatServices";
import { setGreetMsg } from "../../redux/features/app/appSlice";

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
  const navigate = useNavigate();

  const user = useSelector(getUser);
  const allChats = useSelector(getAllChats);
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === "/") {
      if (!user) dispatch(setGreetMsg("Hello! Welcome to MorphAR"));
      else dispatch(setGreetMsg(`Namaste, ${user.name}!!!`));
    } else if (pathname === "/tripo") {
      dispatch(setGreetMsg("Let's get started with Tripo! Image to 3D Model"));
    } else if (pathname === "/text") {
      dispatch(setGreetMsg("Text/Audio to 3D Model"));
    } else if (pathname === "/sketch") {
      dispatch(setGreetMsg("Sketch to 3D Model"));
    } else {
      dispatch(setGreetMsg("Page not found, but you're still awesome!"));
    }
  }, [location, user]);

  const handleToggleDrawer = () => {
    setOpen((preV) => !preV);
  };
  const handleOpenDrawer = () => {
    setOpen(true);
  };
  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const handleNewChat = () => {
    dispatch(updateChat(null));
    navigate("/");
  };

  const handleClickImgTo3D = () => {
    navigate("/tripo");
  };

  const handleClickTextAudioTo3D = () => {
    navigate("/text");
  };

  const handleClickSketchTo3D = () => {
    navigate("/sketch");
  };

  const handleClickChat = (chat_id) => {
    dispatch(updateChat(chat_id));
    navigate("/");
  };

  const deleteChat = async (chat_id) => {
    await ChatService.deleteChat(chat_id);
    const response = await ChatService.getChats({ clerk_id: user.clerk_id });
    dispatch(updateAllChats(response));
    handleNewChat();
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
      onMouseEnter={handleOpenDrawer}
      onMouseLeave={handleCloseDrawer}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggleDrawer} sx={{ paddingLeft: 1.5 }}>
          <MenuIcon fontSize="small" sx={{ color: "var(--text-color)" }} />
        </IconButton>
      </DrawerHeader>
      <Divider
        sx={{
          borderBottomWidth: 3,
          borderBottomColor: "var(--background-color)",
        }}
      />
      <Box p={1} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <IconButton
          onClick={handleNewChat}
          sx={{
            backgroundColor: "var(--background-color)",
            borderRadius: open ? 4 : 50,
            display: "inherit",
            justifyContent: "flex-start",
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
        <IconButton
          onClick={handleClickImgTo3D}
          sx={{
            backgroundColor: "var(--background-color)",
            borderRadius: open ? 4 : 50,
            display: "inherit",
            justifyContent: "flex-start",
            "&:hover": {
              backgroundColor: "var(--background-color)",
            },
          }}
        >
          <ImageIcon sx={{ color: "var(--secondary-color)" }} />
          {open && (
            <Typography
              variant="subtitle2"
              pl={1}
              color="var(--secondary-color)"
            >
              Image to 3D Model
            </Typography>
          )}
        </IconButton>
        <IconButton
          onClick={handleClickTextAudioTo3D}
          sx={{
            backgroundColor: "var(--background-color)",
            borderRadius: open ? 4 : 50,
            display: "inherit",
            justifyContent: "flex-start",
            "&:hover": {
              backgroundColor: "var(--background-color)",
            },
          }}
        >
          <AudiotrackIcon sx={{ color: "var(--secondary-color)" }} />
          {open && (
            <Typography
              variant="subtitle2"
              pl={1}
              color="var(--secondary-color)"
            >
              Text/Audio to 3D Model
            </Typography>
          )}
        </IconButton>
        <IconButton
          onClick={handleClickSketchTo3D}
          sx={{
            backgroundColor: "var(--background-color)",
            borderRadius: open ? 4 : 50,
            display: "inherit",
            justifyContent: "flex-start",
            "&:hover": {
              backgroundColor: "var(--background-color)",
            },
          }}
        >
          <GestureIcon sx={{ color: "var(--secondary-color)" }} />
          {open && (
            <Typography
              variant="subtitle2"
              pl={1}
              color="var(--secondary-color)"
            >
              Sketch to 3D Model
            </Typography>
          )}
        </IconButton>
      </Box>
      <Divider
        sx={{
          borderBottomWidth: 3,
          borderBottomColor: "var(--background-color)",
        }}
      />
      {allChats.length && open ? (
        <Box p={1} sx={{ flex: 1, overflow: "auto" }}>
          <Typography
            variant="subtitle2"
            pl={1}
            color="var(--secondary-color)"
            fontWeight={"bold"}
            mb={1}
          >
            Recent
          </Typography>
          {allChats.map((chat) => {
            console.log(chat);
            const heading = chat.chat_history[0].parts[0].text;
            return (
              <Typography
                key={chat.id}
                variant="subtitle2"
                pl={1}
                color="var(--secondary-color)"
                sx={{
                  borderRadius: 50,
                  marginBottom: 1,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box onClick={() => handleClickChat(chat.id)}>
                  {heading.length > 23
                    ? `${heading.substring(0, 23)} ...`
                    : heading}
                </Box>
                <IconButton onClick={() => deleteChat(chat.id)}>
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: "var(--secondary-color)" }}
                  />
                </IconButton>
              </Typography>
            );
          })}
        </Box>
      ) : null}
    </Drawer>
  );
}

export default SideBar;
