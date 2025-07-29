// App.jsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "./redux/features/user/userSlice";
import UserService from "./services/userServices";
import ChatService from "./services/chatServices";
import { updateAllChats } from "./redux/features/chat/chatSlice";
import { getIsLoading, setIsLoading } from "./redux/features/app/appSlice";
import LoadingOverlay from "./components/LoadingOverlay";
import { ToastContainer, toast } from "react-toastify";
import AppRouter from "./layout/AppRouter";

function App() {
  const { user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const isLoading = useSelector(getIsLoading);

  const updateUserData = async (clerkUser) => {
    dispatch(setIsLoading(true));
    const formattedEvent = {
      email: clerkUser.primaryEmailAddress.emailAddress,
      clerk_id: clerkUser.id,
      name: clerkUser.fullName,
    };
    const result = await UserService.registerUser(formattedEvent);
    dispatch(updateUser(result));
    dispatch(setIsLoading(false));
  };

  const getAllChats = async (user) => {
    dispatch(setIsLoading(true));
    const response = await ChatService.getChats({ clerk_id: user.clerk_id });
    dispatch(updateAllChats(response));
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (clerkUser) {
      updateUserData(clerkUser);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      toast(`Welcome ${user.name}!`);
      getAllChats(user);
    }
  }, [user]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <RouterProvider router={AppRouter} />
      <ToastContainer />
    </>
  );
}

export default App;
