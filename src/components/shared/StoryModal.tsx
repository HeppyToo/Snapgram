import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '.';
import { useGetRecentStory } from '@/lib/react-query/queries';

interface IModalProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoryModal: React.FC<IModalProps> = ({ open, setModalOpen }) => {
  const PAGE_WIDTH = 450;

  const handleLeftArrowClick = () => {};

  const handleRightArrowClick = () => {};

  //QUERIES
  const {
    data: history,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentStory();

  if (isErrorPosts) {
    return (
      <div
        className="w-screen h-screen bg-black/40 fixed top-0 left-0 z-50 flex justify-center"
        onClick={() => setModalOpen(false)}
      >
        <p className="body-medium text-light-1">Something bad happened</p>
      </div>
    );
  }

  return (
    <>
      {open && (
        <div
          className="w-screen h-screen bg-black/40 fixed top-0 left-0 z-40 flex justify-center "
          onClick={() => setModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <div
              className="absolute left-0 top-1/2 z-50 pl-5 cursor-pointer"
              onClick={handleLeftArrowClick}
            >
              <img
                src="/assets/icons/arrowLeft.svg"
                alt="add"
                width={32}
                height={32}
              />
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <div
              className="absolute right-0 top-1/2 z-50 pr-5 cursor-pointer"
              onClick={handleRightArrowClick}
            >
              <img
                src="/assets/icons/arrowRight.svg"
                alt="arrow"
                width={32}
                height={32}
              />
            </div>
          </div>

          <div>
            <div className="min-w-[450px] max-w-[450px] overflow-hidden flex flex-row ">
              {history?.documents.map((story) => (
                <div className="bg-dark-3 min-w-[450px] max-w-[450px] flex flex-col justify-between gap-5 my-10 ">
                  <div className="flex-between">
                    <div className="flex items-center gap-3 pl-6 pt-6">
                      <Link to={`/profile/${story.creator.$id}`}>
                        <img
                          src={
                            story.creator?.imageUrl ||
                            '/assets/icons/profile-placeholder.svg'
                          }
                          alt="creator"
                          className="w-12 lg:h-12 rounded-full"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                          {story.creator.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src={
                      story.imgUrl || '/assets/icons/profile-placeholder.svg'
                    }
                    alt="story image"
                    className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"
                  />
                  <div className="small-medium lg:base-medium pt-5">
                    <p>{story.caption}</p>
                    <ul className="flex gap-1 mt-2">
                      {story.tags.map((tag: string, index: string) => (
                        <li
                          key={`${tag}${index}`}
                          className="text-light-3 small-regular"
                        >
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryModal;
