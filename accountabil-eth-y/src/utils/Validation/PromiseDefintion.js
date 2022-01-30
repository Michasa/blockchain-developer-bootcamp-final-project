import Joi from "joi";

export const userResponseSchema = Joi.object({
  userCommitments: Joi.array().items(Joi.string()).min(1).required(),
  deadlineAsDaysAway: Joi.number().less(31).positive().required(),
  dailyWager: Joi.number().greater(0).positive().required(),
});

export const transactionArgumentSchema = Joi.object({
  userCommitments: Joi.array().items(Joi.string().hex()),
  deadline: Joi.number().positive(),
  dailyWager: Joi.number().greater(0).positive(),
  pledgePot: Joi.number(),
});
