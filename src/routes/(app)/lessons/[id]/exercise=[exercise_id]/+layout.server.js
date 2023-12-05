import { pool } from "$lib/db";


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

export async function load({params}){
    let aux = await getQuestionById(params.id);
    let exercise = {
        questions: aux,
        option: await getQuestionMenu(params.exercise_id)
    };
    //console.log(aux);
    //getImageByQuestionId(params.exercise_id);
    return exercise;

}

async function getImageByQuestionId(id){
    try {
        const query = 'SELECT * FROM Question_Images '+
        'WHERE question_id = $1 '+
        'LIMIT 1';

        const values = [id];
        
        const res = await pool.query(query, values);

        let image = {
            name: res.rows[0].image_name,
            type: res.rows[0].image_type,
            lastModified: res.rows[0].image_last_modified,
            size: res.rows[0].image_size,
            data: new Blob([res.rows[0].image_data], {type: res.rows[0].image_type})
        }
        
        //console.log(res.rows[0].image_data);
        return image;
    } catch(err) {
        console.error(err);
    }
}