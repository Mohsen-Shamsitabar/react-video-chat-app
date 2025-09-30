import UserCard from "@client/components/common/user-card.tsx";
import { type UserData } from "@shared/types.ts";
import ContentHeader from "./content-header.tsx";

type Props = {
  setIsTabContentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  connectedUsersData: UserData[];
};

const UsersContent = (props: Props) => {
  const { setIsTabContentOpen, connectedUsersData } = props;

  const renderUsers = () => {
    return connectedUsersData.map(user => (
      <li key={user.username}>
        <UserCard {...user} />
      </li>
    ));
  };

  return (
    <div className="flex flex-col">
      <ContentHeader
        title="Connected users"
        setIsTabContentOpen={setIsTabContentOpen}
      />

      <ol className="p-4">{renderUsers()}</ol>
    </div>
  );
};

export default UsersContent;
