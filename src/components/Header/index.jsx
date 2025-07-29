import { Box, Button, IconButton, styled, Typography } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import GradientTxt from "../GradientTxt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation, useNavigate } from "react-router";

const DrawerHeader = styled("Box")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNameClick = () => {
    navigate("/");
  };

  return (
    <DrawerHeader sx={{ justifyContent: "space-between", zIndex: 1 }}>
      <Typography
        variant="h6"
        sx={{ cursor: "pointer" }}
        onClick={handleNameClick}
      >
        <GradientTxt
          txt="MorphAI"
          extraStyles={{
            fontWeight: "bold",
          }}
        />
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        {location.pathname === "/" && (
          <Button variant="contained" onClick={() => navigate("/Home")}>
            Try now!
          </Button>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <IconButton>
              <AccountCircleIcon
                fontSize="large"
                sx={{ color: "var(--text-color)" }}
              />
            </IconButton>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Box>
    </DrawerHeader>
  );
}

export default Header;
