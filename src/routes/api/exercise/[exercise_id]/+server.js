import { error } from "@sveltejs/kit"
import { pool } from "$lib/db";

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
        return image;
    } catch(err) {
        console.error(err);
    }
}

export const GET = (async ({params, setHeaders}) => {

    if(!params.exercise_id){
        throw error(404, {
            message: 'Opção não encontrada'
        });
    }

    const img = await getImageByQuestionId(params.exercise_id);
    if(!img || !img.data){
        throw error(404, 'Imagem não encontrada');
    }
    setHeaders({
        'Content-Type': img.type,
        'Content-Length': img.size.toString(),
        'Last-Modified': new Date(img.lastModified).toUTCString(),
        'Cache-Control': 'public, no-cache'
    });

    return new Response(img.data);
})