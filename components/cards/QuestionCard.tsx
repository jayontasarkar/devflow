import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import Link from 'next/link';
import Metric from '../shared/Metric';
import RenderTag from '../shared/RenderTag';

interface IProps {
  id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: IProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            <Link href={`/question/${id}`}>{title}</Link>
          </h3>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture || '/assets/icons/avatar.svg'}
          alt="author"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyle="small-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Votes"
          value={formatAndDivideNumber(upvotes)}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={formatAndDivideNumber(answers.length)}
          title="Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(views)}
          title="Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
