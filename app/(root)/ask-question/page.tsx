import Question from '@/components/forms/Question';
import { getUserByClerkId } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const user = await getUserByClerkId({ clerkId: userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question userId={user._id.toString()} type="create" />
      </div>
    </div>
  );
};

export default Page;
