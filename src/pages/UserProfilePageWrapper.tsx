import { useParams } from "react-router-dom";
import UserProfilePage from "./UserProfilePage";

export default function UserProfilePageWrapper() {
  const { handle } = useParams<{ handle: string }>();

  if (!handle) {
    return null;
  }

  return <UserProfilePage handle={handle} />;
}
