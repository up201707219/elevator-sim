import { pool } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import {v4 as uuidv4} from "uuid";

async function insertDefaultExercise(id, courseId){
    try {
        const query = "INSERT INTO Question_dev (id, course_id, content, completion_time) \n" +
        "VALUES ($1, $2, 'Isto é uma avaria', 300);";

        const values = [id, courseId];

        await pool.query(query, values);
    } catch (error) {
        console.error(error)
    }
}

async function getQuestionById(id){
    try{
        const query = "SELECT qd.*, qi.IMAGE_NAME FROM Question_Dev qd " +
        "left join question_images qi on qd.id = qi.question_id " +
        "WHERE Course_id = '" + id + "';";
        const res = await pool.query(query);

        let val = [];

        res.rows.forEach(element => {
            let aux = {
                id: element.id,
                title: element.content,
                time: element.completion_time,
                image: element.image_name
            };
            val.push(aux);
        });
        return val;
    }catch (error){
        console.error(error);
    }
}

async function getQuestionMenu(id){
    try{
        const query = "SELECT qm.*, mi.IMAGE_NAME FROM Question_Menu qm " +
        "left join menu_images mi on qm.id = mi.menu_id " +
        "WHERE qm.Question_id = '" + id + "' " +
        "ORDER BY qm.ID ASC;";
        const res = await pool.query(query);
        let val = [];
        res.rows.forEach(element => {
            let option = {
                id: element.id,
                title: element.title,
                description: element.descript,
                response: element.response,
                parent: element.parent_id,
                points: element.points,
                image: element.image_name
            };
            val.push(option);
        });
        return val;
    }catch (error){
        console.error(error);
    }
}

async function getUserSubmissions(userId, questionID){
    try {
        let query = "SELECT *, extract ('epoch' from expires_at-now()) as time_remaining FROM user_question WHERE user_id = $1 and question_id = $2;"

        let values =[userId, questionID];
        let res = await pool.query(query, values);
        if(res.rows.length === 0){
            //todo: insert into table to start exercise
            query = "INSERT INTO user_question(user_id, question_id, expires_at) "+
            "SELECT $1, $2, (NOW()+interval '1 second' * completion_time) "+
            "from question_dev where id = $3;";
            values =[userId, questionID, questionID];
            await pool.query(query, values);
            return null;
        }

        let val = {
            time_remaining: res.rows[0].time_remaining < 0? 0:Math.floor(res.rows[0].time_remaining)
        }
        return val.time_remaining;
    } catch (error) {
        console.error(error);
    }
}

export async function load({cookies, params}){
    const user = {
        id: cookies.get('userId'),
        username: cookies.get('user'),
        isAdmin: cookies.get('userIsAdmin')
    };
    if(params.exercise_id === "0" && cookies.get('userIsAdmin') !== "false"){
        let id = uuidv4();
        insertDefaultExercise(id, params.id);
        throw redirect(302, "/lessons/"+params.id+"/exercise="+id+"/edit");
    }
    let aux = await getQuestionById(params.id);
    let exercise = {
        questions: aux,
        option: await getQuestionMenu(params.exercise_id)
    };
    if(user.isAdmin !== "true"){
       exercise.time = await getUserSubmissions(user.id, params.exercise_id);
       console.log(exercise.time);
    }
    //console.log(aux);
    //getImageByQuestionId(params.exercise_id);
    return exercise;

}
