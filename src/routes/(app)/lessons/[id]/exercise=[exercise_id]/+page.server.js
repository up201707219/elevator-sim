import { pool } from "$lib/db";

export const actions = {
    submitAnswers: async ({cookies, request, params}) => {
        const data = await request.formData();
        let val = {
            userId: cookies.get('userId'),
            questionId: params.exercise_id
        };

        try {
            const query = "UPDATE user_question " + 
            "SET Finished_At = Now() " +
            "WHERE user_id = $1 and question_id =$2;";


            const values = [val.userId, val.questionId];
            await pool.query(query, values)
        } catch (error) {
            console.error(error);
        }
    },
    insertAnswer: async ({cookies, request, params}) => {
        const data = await request.formData();
        let val = {
            userId: cookies.get('userId'),
            questionId: params.exercise_id,
            answer: {
                id: data.get('answer-id'),
                points: data.get('answer-score')
            }
        };

        try {
            const query = "INSERT INTO user_answers (user_id, question_id, answer_id, score) "+
            "VALUES ($1, $2, $3, $4);";
            const values = [val.userId, val.questionId, val.answer.id, val.answer.points];

            await pool.query(query, values);
        } catch (error) {
            console.error(error);
        }
    }
}