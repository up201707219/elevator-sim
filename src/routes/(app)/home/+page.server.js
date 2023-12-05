import { lessonModules } from "./data";
import { pool } from "$lib/db";
import { fail, redirect } from "@sveltejs/kit";

async function getCourses(userId){
    try{

        const query = 'SELECT fc.*, cnt.total FROM \n' +
        '(SELECT courses.id, courses.title, ac.completion, ac.user_id FROM Courses \n' +
        'LEFT JOIN (SELECT co.id, co.title, uc.completion, uc.user_id FROM Courses co \n' +
        'left JOIN User_Courses uc \n' +
        'ON co.ID = uc.course_id \n' +
        'Where uc.user_id = $1) as ac \n' +
        'ON ac.id=courses.id \n'+
        'WHERE courses.isDeleted is false) as fc \n' +
        'LEFT JOIN (SELECT COUNT(Modules.Title) AS Total, Courses.ID FROM Courses \n'+
        'LEFT JOIN Modules '+
        'ON Modules.courseID = Courses.ID \n' +
        'GROUP BY Courses.ID) as cnt \n' +
        'ON cnt.id = fc.id '+
        'WHERE fc.completion is null '
        'ORDER BY fc.completion;';
        
        const values = [userId];
        const res = await pool.query(query, values);
        let courses = [];
        res.rows.forEach(element => {
            
            courses.push({
                id: element.id,
                name: element.title,
                image: lessonModules[0].image,
                lessonsDone: element.completion,
                lessonsTotal: element.total
            });
        });
        return courses;
    }catch (error){
        console.error(error);
    }
}


export async function load({cookies}){
    const user = {
        id: cookies.get('userId'),
        username: cookies.get('user'),
        isAdmin: cookies.get('userIsAdmin')
    };
    if(!user.id){
        throw redirect(307, '/')
    }

    let modules = await getCourses(user.id);

    return {
        lessonModules: modules.map((module)=>({
            id: module.id,
            name: module.name,
            image: module.image,
            lessonsDone: module.lessonsDone,
            lessonsTotal: module.lessonsTotal,
            user: user
        }))
    };
    
}