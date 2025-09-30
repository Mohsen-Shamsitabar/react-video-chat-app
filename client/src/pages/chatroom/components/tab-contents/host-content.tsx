import ContentHeader from "./content-header.tsx";

type Props = {
  setIsTabContentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HostContent = (props: Props) => {
  const { setIsTabContentOpen } = props;

  return (
    <div className="flex flex-col">
      <ContentHeader
        title="Host controls"
        setIsTabContentOpen={setIsTabContentOpen}
      />

      <div className="px-4">
        <div className="text-wrap h-19 overflow-hidden">
          Use these host settings to keep control of your meeting. Only hosts
          have access to these controls.
        </div>

        <div className="text-wrap h-24 overflow-hidden">
          WE MIGHT NOT NEED THIS!
        </div>
      </div>
    </div>
  );
};

export default HostContent;
