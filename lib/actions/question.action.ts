"use server";

import Question from "@/database/models/question.model";
import Tag from "@/database/models/tag.model";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../../database/connection";
import { ICreateQuestionParams, IGetQuestionsParams } from "./shared.types";

export async function getQuestions(params: IGetQuestionsParams) {
  try {
    connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ "createdAt": -1 });

    return { questions };
  } catch (error) {
    
  }
}

export async function createQuestion(params: ICreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];
    for (let tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } }
      });

      revalidatePath(path);
    }
  } catch (error) {
    
  }
}