import { lessonModules } from "./data";
import { pool } from "$lib/db";
import { fail } from "@sveltejs/kit";

async function getCourses(){
    try{
        const query = 'SELECT frm.Courses.ID, frm.Courses.Title, lessonCount.Total FROM frm.Courses, ' + 
        '(SELECT COUNT(frm.Modules.Title) AS Total, frm.Courses.ID FROM frm.Courses ' +
        'LEFT JOIN frm.Modules ' +
        'ON frm.Modules.courseID = frm.Courses.ID AND frm.Modules.isDeleted is NOT TRUE ' +
        'GROUP BY Courses.ID) AS LessonCount ' +
        'WHERE lessonCount.ID = frm.Courses.ID '+
        'ORDER BY ID';
        
        const res = await pool.query(query);
        let courses = [];
        res.rows.forEach(element => {
            
            courses.push({
                id: element.id,
                name: element.title,
                image: lessonModules[0].image,
                lessonsDone: 0,
                lessonsTotal: element.total
            });
        });
        //console.log(courses);
        return courses;
    }catch (error){
        console.error(error);
    }
}

export async function load({}){
    
    let modules = await getCourses();

    return {
        lessonModules: modules.map((module)=>({
            id: module.id,
            name: module.name,
            image: module.image,
            lessonsDone: module.lessonsDone,
            lessonsTotal: module.lessonsTotal
        }))
    };
}

export const actions = {
    changeTitle: async ({request}) => {
        const data = await request.formData();
        const val = {
            id: data.get('id'),
            name: data.get('lesson-name')
        };
        try{
            const query = "UPDATE frm.Courses " +
            "SET Title = '" + val.name + "' " +
            "WHERE ID = '" + val.id + "';";
            
            await pool.query(query);
        }
        catch(err){
            console.error(err);
            return fail(422, {
                error: err.message
            });           
        }
    },
    delete: async ({request}) => {
        const data = await request.formData();
        const lessonId = data.get('id');
        try{
            let query = "UPDATE frm.Courses " +
            "SET isDeleted = TRUE"
            "WHERE ID = '" + lessonId + "';";
            await pool.query(query);
            console.log("deleted " + lessonId + " lesson");
        }
        catch(err){
            console.error(err);
        }
    }
}