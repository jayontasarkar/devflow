import { connectToDatabase } from "@/database/connection";
import { IViewQuestionParams } from "./shared.types";
import Interaction from "@/database/models/interaction.model";
import Question from "@/database/models/question.model";

export async function viewQuestion(params: IViewQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 }
    });
    if (userId) {
      const existingInteraction = await Interaction.findOne({ 
        user: userId, 
        action: 'view', 
        question: questionId
      });
      if (existingInteraction) return;

      await Interaction.create({
        user: userId,
        action: 'view',
        question: questionId
      });
    }

    
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
}