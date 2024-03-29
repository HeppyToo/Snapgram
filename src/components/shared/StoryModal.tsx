import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '.';
import { useGetRecentStory } from '@/lib/react-query/queries';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

interface IModalProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoryModal: React.FC<IModalProps> = ({ open, setModalOpen }) => {
  const [progress, setProgress] = useState(0);

  //QUERIES
  const {
    data: history,
    isLoading: isStoryLoading,
    isError: isErrorPosts,
  } = useGetRecentStory();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 100 ? prevProgress + 1 : 100
      );
    }, 100);

    setTimeout(() => {
      setProgress(0);
      clearInterval(intervalId);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [open]);

  if (isStoryLoading) {
    return <Loader />;
  }

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
          className="w-screen h-screen bg-black/40 fixed top-0 left-0 z-40 flex justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div>
            <div
              className="h-full flex flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: `${progress}%`,
                }}
                className={`min-w-[500px] max-w-[500px] bg-white h-1 rounded-md absolute top-0 z-50`}
              />
              <Carousel
                className="h-full min-w-[500px] max-w-[500px] m-auto"
                autoPlay
                infiniteLoop
                centerMode
                interval={10000}
              >
                {history?.documents.map((story) => (
                  <div
                    className="min-w-[450px] max-w-[450px] h-[100vh] bg-cover bg-center bg-no-repeat mr-40"
                    style={{
                      backgroundImage: `url(${
                        story.imgUrl || '/assets/icons/profile-placeholder.svg'
                      })`,
                    }}
                    key={story.$id}
                  >
                    <div className="h-full flex flex-col">
                      <div className="h-full flex flex-col justify-between">
                        <div className="h-[75px] w-full bg-black/5">
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
                              <p className="base-medium lg:body-bold text-light-1 shadow-black">
                                {story.creator.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="small-medium lg:base-medium pb-5 pl-6">
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
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryModal;
