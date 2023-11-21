interface IModalProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialStory: React.FC<IModalProps> = ({ setModalOpen }) => {
  return (
    <div className="flex justify-start w-full">
      <div
        className="w-16 h-16 rounded-full flex justify-center content-center bg-neutral-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <img src="/assets/icons/add.svg" alt="add" width={32} height={32} />
      </div>
    </div>
  );
};

export default SocialStory;
