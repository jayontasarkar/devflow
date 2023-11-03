import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import HomeFilters from '@/components/shared/home/HomeFilters';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';

const questions = [
  {
    _id: '1',
    title: 'Cascading Deletes in SQLAlchemy?',
    tags: [
      { _id: '1', name: 'python' },
      { _id: '2', name: 'sql' },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      picture: '/assets/icons/avatar.svg',
    },
    upvotes: 10,
    views: 1000000,
    answers: [],
    createdAt: new Date('2023-10-05T12:30:00.000Z'),
  },
  {
    _id: '2',
    title: 'How do I use express as a custom server in NextJS?',
    tags: [
      { _id: '3', name: 'express' },
      { _id: '4', name: 'react' },
      { _id: '5', name: 'next13' },
    ],
    author: {
      _id: '2',
      name: 'Jane Doe',
      picture: '/assets/icons/avatar.svg',
    },
    upvotes: 15,
    views: 12000,
    answers: [],
    createdAt: new Date('2023-10-01T12:30:00.000Z'),
  },
  {
    _id: '3',
    title: 'How to center a DIV perfectly in TailwindCSS?',
    tags: [
      { _id: '6', name: 'tailwindcss' },
      { _id: '4', name: 'react' },
      { _id: '7', name: 'css' },
    ],
    author: {
      _id: '3',
      name: 'Melinda Doe',
      picture: '/assets/icons/avatar.svg',
    },
    upvotes: 2,
    views: 1250,
    answers: [],
    createdAt: new Date('2023-09-25T12:30:00.000Z'),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href="/ask-question"
          className="flex justify-end max-sm:full-width"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence. 🚀 Ask a Question and kickstart the
        discussion. Our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
