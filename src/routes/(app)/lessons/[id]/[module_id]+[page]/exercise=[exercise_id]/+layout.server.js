import { pool } from "$lib/db";


async function getQuestionById(id){
    try{
        const query = "SELECT qd.*, qi.IMAGE_NAME FROM Question_Dev qd " +
        "left join question_images qi on qd.id = qi.question_id " +
        "WHERE ID = '" + id + "';";
        const res = await pool.query(query);

        let val = {
            title: res.rows[0].content,
            time: res.rows[0].completion_time,
            image: res.rows[0].image_name
        };
        
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
        // let decImage = new Blob([image[0].arr], {type: image[0].type});
        // console.log(decImage);
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
        image: aux.image,
        option: await getQuestionMenu(params.exercise_id)
    };

    return exercise;

}