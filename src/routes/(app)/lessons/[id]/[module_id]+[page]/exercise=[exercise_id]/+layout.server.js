import { pool } from "$lib/db";


async function getQuestionById(id){
    try{
        const query = "SELECT * FROM Question_Dev " +
        "WHERE ID = '" + id + "';";
        const res = await pool.query(query);

        let val = {
            title: res.rows[0].content,
            time: res.rows[0].completion_time,
        };
        return val;
    }catch (error){
        console.error(error);
    }
}

async function getQuestionMenu(id){
    try{
        const query = "SELECT * FROM Question_Menu " +
        "WHERE Question_id = '" + id + "' " +
        "ORDER BY ID;";
        const res = await pool.query(query);
        let val = [];
        let image = [];
        res.rows.forEach(element => {
            let option = {
                id: element.id,
                title: element.title,
                description: element.descript,
                response: element.response,
                parent: element.parent_id,
                points: element.points,
            };
            image.push(element.image_arr);
            val.push(option);
        });
        return val;
    }catch (error){
        console.error(error);
    }
}

export async function load({params}){
    let aux = await getQuestionById(params.exercise_id);
    let exercise = {
        title: aux.title,
        time: aux.time,
        option: await getQuestionMenu(params.exercise_id)
    };

    return exercise;

}