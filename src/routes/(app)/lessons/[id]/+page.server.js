import { lessonModules } from "./data";
import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";
import { error, redirect } from "@sveltejs/kit";
import * as converter from "$lib/stringHtmlConverter";

//const reload;

let addNew = {
    id: 0,
    name:"Título do curso",
    description: "<p>Uma descrição sobre o curso\r<br /> olá</p>",
    dur_min: 1,
    dur_max: 1,
    timeType: "min",
    lessons: [],
    image: null,
};

async function getCourseByID(userId, id){
    try{
        
        let query = "SELECT * FROM Courses " +
        "WHERE ID = '" + id +"';";
        let res = await pool.query(query);
        let course = {
            id: res.rows[0].id,
            name: res.rows[0].title,
            description: res.rows[0].descript,
            dur_min: res.rows[0].durmin,
            dur_max: res.rows[0].durmax,
            timeType: res.rows[0].timetype,
            lessons: [],
            quiz: [],
            //image: res.rows[0].imageid,
            image: lessonModules[0].image,
        };

        query = 'SELECT fc.*, cnt.total FROM \n' +
        '(SELECT modules.id, modules.title, ac.completion, ac.user_id FROM Modules \n' +
        'LEFT JOIN (SELECT co.id, co.title, uc.completion, uc.user_id FROM Modules co \n' +
        'left JOIN User_Modules uc \n' +
        'ON co.ID = uc.module_id \n' +
        'Where uc.user_id = $1) as ac \n' +
        'ON ac.id=modules.id \n'+
        'WHERE modules.isDeleted is false and modules.courseID = $2) as fc \n' +
        'LEFT JOIN (SELECT COUNT(Module_Content.Title) AS Total, Modules.ID FROM Modules \n'+
        'LEFT JOIN Module_Content '+
        'ON Module_content.ModuleID = Modules.ID \n' +
        'GROUP BY Modules.ID) as cnt \n' +
        'ON cnt.id = fc.id '+
        'ORDER BY fc.id;';
        
        let values = [userId, id]
        res = await pool.query(query, values);
        res.rows.forEach(element => {
            if(element.module !== null){
                let aux = {
                    title: element.title,
                    id: element.id,
                    completion: (element.completion??0),
                    total: parseInt(element.total)
                }
                course.lessons.push(aux);
            }
        });

        // TODO: Check quiz completion and create quiz table(?)
        query = 'SELECT * FROM Question_Dev '+
        'WHERE course_id = $1;';
        
        values = [id];

        res = await pool.query(query, values);
        res.rows.forEach(element => {
            if(element.id !== null){
                let aux = {
                    content: element.content,
                    id: element.id,
                    completionTime: element.completion_time
                }
                course.quiz.push(aux);
            }
        });

        return course;
    }
    catch (error){
        console.error(error);
    }
}

async function insertDefaultCourse(){
    try{
        const query = "INSERT INTO Courses (ID, Title, Descript, DurMin, DurMax) "+
        "VALUES ('" + addNew.id + "', '" +addNew.name + "', '" + addNew.description + "', " + addNew.dur_min +", " + addNew.dur_max +");"
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

async function updateVisited(userId, courseId){
    try{
        const query = 'INSERT INTO User_Courses (User_ID, Course_ID, Completion) '+
        'VALUES ($1, $2, 0) '+
        'ON CONFLICT DO NOTHING;';
        
        const values = [userId, courseId]
        await pool.query(query, values);
    }
    catch (error){
        console.error(error);
    }
}

export async function load({cookies, params}){
    const user = {
        id: cookies.get('userId'),
        username: cookies.get('user'),
        isAdmin: cookies.get('userIsAdmin')
    };
    if(!user.id){
        throw redirect(307, '/')
    }

    if(params.id === '0'){
        addNew.id = uuidv4();
        await insertDefaultCourse();
        throw redirect(302, "/lessons/"+addNew.id);
    }

    await updateVisited(user.id, params.id);
    let module = await getCourseByID(user.id, params.id);
    return module;
}

export const actions = {
    updateCourse: async ({request}) => {
        const data = await request.formData();
        const val = {
            id: data.get('id'),
            name: data.get('title'),
            description: data.get('description'),
            dur_min: data.get('duration-min'),
            dur_max: data.get('duration-max'),
            timeType: data.get('time-type')
        };
        val.description = converter.stringToHtml(val.description);
        try{
            let query = "UPDATE Courses "+
            "SET Title = '" + val.name + "', " +
            "Descript = '" + val.description + "', " +
            "DurMin = " + val.dur_min + ", " +
            "DurMax = " + val.dur_max + ", " +
            "TimeType = '" +val.timeType + "' " +
            "WHERE ID = '" + val.id + "';";

            await pool.query(query);
        }
        catch(err){
            console.error(err);
        }        
    },
    updateModule: async ({request}) => {
        const data = await request.formData();
        const val = {
            id: data.get('module-id'),
            name: data.get('module-title'),
        };
        try{
            let query = "UPDATE Modules "+
            "SET Title = '" + val.name + "' " +
            "WHERE ID = '" + val.id + "';";

            await pool.query(query);
        }
        catch(err){
            console.error(err);
        }        
    },
    deleteModule: async ({request}) => {
        const data = await request.formData();
        const moduleId = data.get('module-id-delete');
        try{
            let query = "UPDATE Modules " +
            "SET isDeleted = TRUE " +
            "WHERE ID = '" + moduleId + "';";
            await pool.query(query);
            console.log("deleted lesson " + moduleId);
        }
        catch(err){
            console.error(err);
        }
    }
}