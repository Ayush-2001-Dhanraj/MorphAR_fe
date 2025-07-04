import { IconButton, styled, Typography } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import GradientTxt from "../GradientTxt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";

const DrawerHeader = styled("Box")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Header() {
  const navigate = useNavigate();

  const handleNameClick = () => {
    navigate("/");
  };

  return (
    <DrawerHeader sx={{ justifyContent: "space-between" }}>
      <Typography
        variant="h6"
        sx={{ cursor: "pointer" }}
        onClick={handleNameClick}
      >
        <GradientTxt
          txt="Areisis"
          extraStyles={{
            fontWeight: "bold",
          }}
        />
      </Typography>
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
    </DrawerHeader>
  );
}

export default Header;
