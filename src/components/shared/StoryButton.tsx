import { useGetRecentStory } from '@/lib/react-query/queries';
import { Models } from 'appwrite';
import { useState } from 'react';
import { Loader, StoryModal } from '.';

const StoryButton = () => {
  //QUERIES
  const {
    data: history,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentStory();

  const [open, setOpen] = useState(false);

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isPostLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-row">
          <ul className="flex gap-3 w-full ">
            {history?.documents.map((story: Models.Document) => (
              <li
                key={story.$id}
                className="flex flex-col justify-center w-full cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <img
                  src={
                    story.creator?.imageUrl ||
                    '/assets/icons/profile-placeholder.svg'
                  }
                  alt="creator"
                  className={`w-16 lg:h-16 rounded-full ${
                    story.revised
                      ? 'border-2 border-solid	border-indigo-700 rounded-br-full'
                      : 'border-2 border-solid	border-gray-500 rounded-br-full'
                  }`}
                />
                <p className="flex justify-center">{story.creator.name}</p>
              </li>
            ))}
          </ul>
          <StoryModal open={open} setModalOpen={setOpen} />
        </div>
      )}
    </>
  );
};

export default StoryButton;
