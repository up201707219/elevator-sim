import { lessonModules } from "./data";
import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";
import { error, redirect } from "@sveltejs/kit";

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

async function getCourseByID(id){
    try{
        const query = 'SELECT * FROM' + 
            "(SELECT frm.Courses.*, frm.Modules.Title AS module, frm.Modules.ID AS module_id FROM frm.Courses "+
            "LEFT JOIN frm.Modules "+
            "ON frm.Courses.ID = frm.Modules.CourseID) AS course "+
            "WHERE course.ID = '" + id + "' "+
            "ORDER BY course.module_id;";
        const res = await pool.query(query);
        let course = {
            id: res.rows[0].id,
            name: res.rows[0].title,
            description: res.rows[0].descript,
            dur_min: res.rows[0].durmin,
            dur_max: res.rows[0].durmax,
            timeType: res.rows[0].timetype,
            lessons: [],
            //image: res.rows[0].imageid,
            image: lessonModules[0].image,
        }
        res.rows.forEach(element => {
            if(element.module !== null){
                let aux = {
                    title: element.module,
                    id: element.module_id
                }
                course.lessons.push(aux);
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
        const query = "INSERT INTO frm.Courses (ID, Title, Descript, DurMin, DurMax) "+
        "VALUES ('" + addNew.id + "', '" +addNew.name + "', '" + addNew.description + "', " + addNew.dur_min +", " + addNew.dur_max +");"
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

export async function load({params}){
    if(parseInt(params.id) === 0){
        addNew.id = uuidv4();
        console.log(addNew.id);
        await insertDefaultCourse();
        throw redirect(302, "/lessons/"+addNew.id);
    }
    //let module = lessonModules.find((element) => element.id === parseInt(params.id));
    let module = await getCourseByID(params.id);
    return module;
}

function stringToHtml(str){
    let res = str.replace(/\r\n([ \t]*\r\n)+/, '<p>');
    res = res.replaceAll(/\r\n([ \t]*\r\n)+/g, '</p><p>').replaceAll('\r\n', '<br />');
    
    if(str.indexOf('\r\n\r\n')>-1){
        res += '</p>';
    }
    
    return res;
}

//console.log(stringToHtml("fui \r\n às\r\n\r\n\r\n compras"));

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
        val.description = stringToHtml(val.description);
        // console.log(val);
        try{
            let query = "UPDATE frm.Courses "+
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
}