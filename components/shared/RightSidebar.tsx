import Image from 'next/image';
import Link from 'next/link';
import RenderTag from './RenderTag';

const RightSidebar = () => {
  const hotQuestions = [
    { _id: 1, title: 'How do I use express as a custom server in NextJS?' },
    { _id: 2, title: 'Cascading Deletes in SQLAlchemy?' },
    { _id: 3, title: 'How to Perfectly Center a Div with Tailwind CSS?' },
    {
      _id: 4,
      title:
        'Best Practices for data fetching in a Next.js with Server Side Rendering (SSR)?',
    },
    { _id: 5, title: 'Redux Toolkit Not Updating States as Expected?' },
  ];
  const popularTags = [
    { _id: 1, name: 'javascript', totalQuestions: 5 },
    { _id: 2, name: 'react', totalQuestions: 5 },
    { _id: 3, name: 'nextjs', totalQuestions: 5 },
    { _id: 4, name: 'vue', totalQuestions: 5 },
    { _id: 5, name: 'mongodb', totalQuestions: 5 },
    { _id: 6, name: 'nodejs', totalQuestions: 5 },
  ];

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden max-xl:hidden w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                height={20}
                width={20}
                className="invert-colors"
                alt="chevron right"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
