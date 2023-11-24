import { pool } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import {v4 as uuidv4} from "uuid";

async function insertImage(menuId, image){
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
        const query = 'INSERT INTO Menu_Images (Menu_ID, IMAGE_NAME, IMAGE_TYPE, IMAGE_SIZE, IMAGE_DATA)' +
        'VALUES ($1, $2, $3, $4, $5) '+
        'ON CONFLICT (Menu_ID) DO UPDATE '+
        'SET IMAGE_NAME = $2, '+
        'IMAGE_TYPE = $3, ' +
        'IMAGE_SIZE = $4, ' +
        'IMAGE_DATA = $5;';

        const values = [menuId, image.name, image.type, image.size, buffer];

        await pool.query(query, values);
    } catch(err) {
        console.error(err);
    }
}

async function insertImageExercise(QuestionId, image){
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(buffer);
    try {
        const query = 'INSERT INTO Question_Images (Question_ID, IMAGE_NAME, IMAGE_TYPE, IMAGE_SIZE, IMAGE_DATA)' +
        'VALUES ($1, $2, $3, $4, $5) '+
        'ON CONFLICT (Question_ID) DO UPDATE '+
        'SET IMAGE_NAME = $2, '+
        'IMAGE_TYPE = $3, ' +
        'IMAGE_SIZE = $4, ' +
        'IMAGE_DATA = $5;';

        const values = [QuestionId, image.name, image.type, image.size, buffer];

        await pool.query(query, values);
    } catch(err) {
        console.error(err);
    }
}

export const actions = {
    insertNewButton: async ({request, params}) => {
        const data = await request.formData();
        let val = {
            id: parseInt(data.get('id').valueOf()),
            parent: (data.get('parent-id').valueOf() === 'undefined' ? null:data.get('parent-id').valueOf()),
            title: data.get('title').valueOf(),
            description: data.get('description')?.valueOf(),
            response: data.get('response').valueOf(),
            image: data.get('image')?.valueOf(),
            points: parseInt(data.get('points')?.valueOf())
        };
    
        if(val.image){
            if(val.image?.size !== 0){
                insertImage(val.id, val.image);
            }
        }

        try{
            let query;
            let values;

            if(val.id !== 0){
                query = 'UPDATE Question_Menu '+
                'SET descript = $1, '+
                'response = $2, '+
                'points = $3, '+
                'title = $4 '+
                'WHERE ID = $5';

                values = [val.description, val.response, (isNaN(val.points) ? null : val.points), val.title, val.id];
            }
            else{
                query = 'INSERT INTO Question_Menu (Title, Question_Id, Descript, Response, Parent_ID, Points)' +
                'Values($1, $2, $3, $4, $5, $6);';
                values = [val.title, params.exercise_id, val.description, val.response, val.parent, (isNaN(val.points) ? null : val.points)];
            }
            //console.log(query);

            await pool.query(query, values);
        }
        catch(err){
            console.error(err);
        }  
    },

    deleteButton: async ({request}) => {
        const data = await request.formData();
        let val = {
            id: parseInt(data.get('id').valueOf()),
        };
        try{
            const query = 'DELETE FROM Question_Menu '+
                'WHERE ID = $1';

            const values = [val.id];

            await pool.query(query, values);
        }
        catch(err){
            console.error(err);
        }  

    },
    updateExercise: async ({request}) => {
        const data = await request.formData();
        let val = {
            id: data.get('id').valueOf(),
            title: data.get('title').valueOf(),
            image: data.get('image')?.valueOf(),
        };
        console.log(val.image);
        if(val.image.size !== 0){
            insertImageExercise(val.id, val.image);
        }
        //console.log(buffer);
        try{
            const query = 'UPDATE Question_Dev '+
            'SET content = $1 '+
            'WHERE ID = $2;';

            const values = [val.title, val.id];
            //console.log(query);

            await pool.query(query, values);
        }
        catch(err){
            console.error(err);
        }  
    },
    copyExercise: async ({request, params}) => {
        const exerciseId = uuidv4();
        try {
            let query = 'insert into question_dev (ID, Course_ID, Content, Completion_Time) \n'+
            'SELECT $1, course_id, content, completion_time from question_dev where ID= $2; ';
            
            
            let values =[exerciseId, params.exercise_id];

            // console.log(query);
            // console.log(values);

            await pool.query(query, values);

            query = 'insert into question_menu(question_id, title, descript, response, parent_id, points) ' +
            'select $1 , title, descript, response, parent_id, points from question_menu where question_id = $2 ;';

            // console.log(query);
            // console.log(values);

            await pool.query(query, values);
        } catch (error) {
            console.error(error);   
        }

        throw redirect(302, "/lessons/"+params.id+"/exercise="+exerciseId+"/edit");        
    }
}