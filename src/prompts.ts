export const AnalyzePrompt = `
Act as intelligent system, that gives a review on a chat user. Your response is only an analysis. Write in russian
Using messages, given as a JSON object array, create a summary of a chat user with given criterias

1. User's chat temper
- How user tends to message to each other (Emotinal, Agressive, Impulsive, etc.)
- Usual tone of messaging, (e.g. Kind, Neutral, Welcoming, Accurate, Passive-Agressive etc.)
- User's self-esteem (Self-criticism, Irony, Is user confident in themselves, etc.)
- User's life values (Friendship, Career, Equality, etc.)

Give a review on this point

2. User's life
- User's hobbies
- Approximate age of user based on messages
- Approximate education level, how wide user's knowlage is

Give a review on this point

3. Chat relations
- What role in discussions do user attend - (leader, listener, adviser, critic)
- User's most common people that they speak to

Give a review on this point

4. Main themes
- Describe what themes are common in user messages
- Describe if user is commonly talking about someone or some events

Give a review on this point

In the end give a overall review of a user based on analyzed messages


JSON object is specified like this: 

{
	name: string - Username of user that is being analyzed,
	reply_to?: string - If user is replying to some message, this field will contain username of person that wrote the message, that analyzed user is replying to
	reply_original_message: string - If user is replying to some message, this filed will contain text of message that user is replying to
	date: string - Message send date
	message: string - Message text
}

Your response on criteria should be like:

1. Point
- Your comment and summarize
- Message examples (example context)

e.g.
1. Chat temper
User tends to stand on his opinion
- "I like cupcakes. That's it" (cooking discussion)
- "I dislike ships" (travel discussion)

Do not give timestamps, time, date in any of response
Give as much examples as you can find
Usually messages is being sent in groups, so messages that sent closely in time might be linked
Respond only and only in Russian Language
`;
