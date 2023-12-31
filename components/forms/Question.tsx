'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/validations';

import { useTheme } from '@/context/ThemeProvider';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';

const type: string = 'create';

interface IProps {
  userId: string;
  question?: string;
  type?: string;
}

const Question = ({ type = 'create', question, userId }: IProps) => {
  const router = useRouter();
  const path = usePathname();

  const parsedQuestion = question && JSON.parse(question || '');
  const parsedTags = parsedQuestion?.tags?.map((tag: any) => tag.name);

  const { mode } = useTheme();
  const editorRef: any = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //   Initialize the question form
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestion?.title || '',
      explanation: parsedQuestion?.content || '',
      tags: parsedTags || [],
    },
  });

  // Define a submit handler for form.
  const onSubmit = async (values: z.infer<typeof QuestionsSchema>) => {
    setIsSubmitting(true);
    try {
      if (type === 'create') {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: userId,
          path,
        });
        toast({
          title: 'Question created.',
          description: 'Your question has created successfully.',
        });
        router.push('/');
      } else {
        await editQuestion({
          questionId: parsedQuestion._id,
          title: values.title,
          content: values.explanation,
          path: path,
        });
        toast({
          title: 'Question updated.',
          description: 'Your question has updated successfully.',
        });
        router.push(`/question/${parsedQuestion._id.toString()}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (type === 'edit') return;

    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters',
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = '';
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue('tags', newTags);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Title
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Be specific and image you're asking a question to another
                  person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Detailed explanation of your problem
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(content: string) =>
                      field.onChange(content)
                    }
                    initialValue={parsedQuestion?.content || ''}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                      ],
                      toolbar:
                        'undo redo | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist',
                      content_style:
                        'body { font-family:Inter,sans-serif; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      placeholder="Add tags..."
                      disabled={type === 'edit'}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag) => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_dark500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          >
                            {tag}
                            {type === 'create' && (
                              <Image
                                src="/assets/icons/close.svg"
                                height={12}
                                width={12}
                                alt="close icon"
                                className="cursor-pointer object-contain invert-0 dark:invert"
                                onClick={() => handleTagRemove(tag, field)}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            type="submit"
            className="primary-gradient w-fit !text-light-900"
          >
            {isSubmitting
              ? type === 'edit'
                ? 'Editing...'
                : 'Posting...'
              : type === 'edit'
              ? 'Edit Question'
              : 'Ask a Question'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Question;
