import UserCard from "@client/components/common/user-card.tsx";
import { type UserData } from "@shared/types.ts";
import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
  connectedUsersData: UserData[];
};

const UsersContent = (props: Props) => {
  const { handleTabContentOpen, connectedUsersData } = props;

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
        handleTabContentOpen={handleTabContentOpen}
      />

      <ol className="p-4">{renderUsers()}</ol>
    </div>
  );
};

export default UsersContent;
