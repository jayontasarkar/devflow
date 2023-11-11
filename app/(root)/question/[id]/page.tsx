import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Votes from '@/components/shared/Votes';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserByClerkId } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  params: {
    id: string;
  };
  searchParams?: any;
}

const Page = async ({ params, searchParams }: IProps) => {
  const { userId: clerkId } = auth();

  let user;

  if (clerkId) {
    user = await getUserByClerkId({ clerkId });
  }

  await viewQuestion({
    questionId: params.id,
    userId: user ? user._id.toString() : undefined,
  });

  const question = await getQuestionById(params.id);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          {user && (
            <div className="flex justify-end">
              <Votes
                type="Question"
                itemId={question._id.toString()}
                userId={user._id.toString()}
                upvotes={question.upvotes.length}
                downvotes={question.downvotes.length}
                hasupVoted={question.upvotes.includes(user._id)}
                hasdownVoted={question.downvotes.includes(user._id)}
                hasSaved={user?.saved.includes(question._id)}
              />
            </div>
          )}
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=" Asked"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question.answers.length)}
          title=" Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question.views)}
          title=" Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            name={tag.name}
            id={tag._id}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={question._id.toString()}
        userId={user ? user._id.toString() : null}
        totalAnswers={question.answers.length}
        filter={searchParams?.filter}
        page={searchParams?.page}
      />

      {user && (
        <Answer
          question={{
            _id: question._id.toString(),
            title: question.title,
            content: question.content,
          }}
          questionId={question._id.toString()}
          authorId={user._id.toString()}
        />
      )}
    </>
  );
};

export default Page;
