import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import { getTimestamp } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Filter from './Filter';
import ParseHTML from './ParseHTML';
import Votes from './Votes';

interface IProps {
  questionId: string;
  userId: string | null;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: IProps) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page: page ? +page : 1,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {result.answers &&
          result.answers.length > 0 &&
          result.answers.map((answer) => (
            <article
              className="light-border border-b py-10"
              key={answer._id.toString()}
            >
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>

                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                {userId && (
                  <div className="flex justify-end">
                    <Votes
                      type="Answer"
                      itemId={answer._id.toString()}
                      userId={userId as string}
                      upvotes={answer.upvotes.length}
                      hasupVoted={answer.upvotes.includes(userId)}
                      downvotes={answer.downvotes.length}
                      hasdownVoted={answer.downvotes.includes(userId)}
                    />
                  </div>
                )}
              </div>
              <ParseHTML data={answer.content} />
            </article>
          ))}
      </div>
    </div>
  );
};

export default AllAnswers;
