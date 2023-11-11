"use server";

import { connectToDatabase } from "@/database/connection";
import Question from "@/database/models/question.model";
import Tag from "@/database/models/tag.model";
import User from "@/database/models/user.model";
import { FilterQuery } from "mongoose";
import { IGetAllTagsParams, IGetQuestionsByTagIdParams, IGetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: IGetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    return [
      {
        _id: 'dfaf343wrwef',
        name: 'tag1',
      },
      {
        _id: 'dfaf343wrion',
        name: 'tag2',
      },
      {
        _id: 'dfaf349ndfijo',
        name: 'tag3',
      },
    ];
  } catch (error) {
    
  }
}

export async function getAllTags(
  params: IGetAllTagsParams
) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { name: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    let sortOptions: any = {};
    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;
        
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;

      case 'name':
        sortOptions = { name: 1 };
        break;

      case 'old':
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const skipAmount = (page - 1) * pageSize;

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const countDocuments = await Tag.countDocuments(query);

    return { tags, isNext: countDocuments > skipAmount + tags.length };
  } catch (error) {}
}

export async function getQuestionsByTagId(params: IGetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 20, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tag = await Tag.findById(tagId).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if there is next page
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, noOfQuestions: { $size: "$questions" } } },
      { $sort: { noOfQuestions: -1 } },
      { $limit: 5 }
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}