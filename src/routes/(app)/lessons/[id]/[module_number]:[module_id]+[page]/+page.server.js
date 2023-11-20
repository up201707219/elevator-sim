import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";
import { error, redirect } from "@sveltejs/kit";
import * as converter from "$lib/stringHtmlConverter";

let addNew = {
    moduleId: 0,
    courseId: 0,
    moduleTitle: "Título do módulo",
    content:[
        {
            id: 0,
            title: "Título",
            context: "Aqui fica o conteúdo do módulo da 1ª página é possivel adicionar mais páginas",
            page_ind: 1
        }
    ]
}

async function insertDefaultModule(){
    try{
        const query = "INSERT INTO Modules (ID, Title, CourseID)"+
        "VALUES ('" + addNew.moduleId + "', '" +addNew.moduleTitle + "', '" + addNew.courseId +"');";
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

async function insertDefaultContent(){
    
        try{
            const query = "INSERT INTO Module_Content (ID, Title, Content, ModuleID)"+
            "VALUES ('" + addNew.content[0].id + "', '"+ addNew.content[0].title+"', '" +addNew.content[0].context + "', '" + addNew.moduleId +"');";
            
            await pool.query(query);
        }
        catch (error){
            console.error(error);
        }
}

async function getCourseTitle(id){
    try{
        const query = "SELECT Courses.title FROM Courses "+
        "WHERE Courses.ID = '" + id + "' ;";
        const res = await pool.query(query);
        let title = res.rows[0].title;
        return title;
    }catch (error){
        console.error(error);
    }
}

async function getContentByModuleID(id){
    try{
        const query = "SELECT Module_Content.id, Module_Content.content, Module_Content.page_ind, Modules.ID as moduleid, Modules.title FROM Modules "+
        "LEFT JOIN Module_Content ON Modules.ID = Module_Content.ModuleID  AND Module_Content.isDeleted IS NOT TRUE " +
        "WHERE Modules.ID = '" + id + "' "+
        "ORDER BY Module_Content.Page_ind ASC;";
        const res = await pool.query(query);

        let val = {
            courseTitle: "",
            moduleId: res.rows[0].moduleid,
            moduleTitle: res.rows[0].title,
            content: []
        }
        res.rows.forEach(element => {
            let content = {
                id: element.id,
                context: element.content,
                page_ind: element.page_ind
            };
            val.content.push(content);
        });
        return val;
    }catch (error){
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
    if(parseInt(params.module_id) === 0){
        addNew.courseId = params.id;
        addNew.moduleId = uuidv4();
        addNew.content[0].id = uuidv4();
        await insertDefaultModule();
        await insertDefaultContent();
        throw redirect(302, "/lessons/"+params.id+"/"+addNew.moduleId+"+"+"0");
    }
    let module = await getContentByModuleID(params.module_id);
    module.courseTitle = await getCourseTitle(params.id);
    module.user = user;
    return module;
}

export const actions = {
    updateContent: async ({request}) => {
        const data = await request.formData();
        let val = {
            moduleId: data.get('module-id'),
            id: data.get('content-id'),
            content: data.get('module-content')
        };
        
        val.content = converter.stringToHtml(val.content);

        if(val.id === ""){
            try{
                let query = "INSERT INTO Module_Content (ID, Content, ModuleID) "+
            "Values( '" + uuidv4() + "', '" + val.content + "', '" + val.moduleId + "');" 

            await pool.query(query);
            }
            catch(err){
                console.error(err);
            }
        }
        else{
            try{
                let query = "UPDATE Module_content "+
                "SET content = '" + val.content + "' " +
                "WHERE ID = '" + val.id + "';";
    
                await pool.query(query);
            }
            catch(err){
                console.error(err);
            }        
        }
    },
    insertContent: async ({request}) => {
        const data = await request.formData();
        const val = {
            id: uuidv4(),
            moduleId: data.get('module-id'),
            content: "Esta é a nova página predefinida"
        };
        const nextPage = data.get('next-page');
        try{
            let query = "INSERT INTO Module_Content (ID, title, Content, ModuleID) "+
            "Values( '" + val.id + "', 'Titulo Exemplo', '" + val.content + "', '" + val.moduleId + "');" 

            console.log(query);
            await pool.query(query);
        }
        catch(err){
            console.error(err);
        }
        throw redirect(302, nextPage);   
    },

}