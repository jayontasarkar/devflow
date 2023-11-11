import Question from '@/components/forms/Question';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserByClerkId } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

interface IProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: IProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const user = await getUserByClerkId({ clerkId: userId });
  if (!user) throw new Error('User not found');

  const result = await getQuestionById(params.id);
  if (!result || result?.author?._id.toString() !== user.id.toString()) {
    return new Error('Question not found!');
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
          userId={user._id.toString()}
          question={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
