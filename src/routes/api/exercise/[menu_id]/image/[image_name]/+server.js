import { error } from "@sveltejs/kit"
import { pool } from "$lib/db";

async function getImageByMenuId(id){
    try {
        const query = 'SELECT * FROM Menu_Images '+
        'WHERE menu_id = $1 '+
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
    if(!params.menu_id || isNaN(parseInt(params.menu_id))){
        throw error(404, {
            message: 'Opção não encontrada'
        });
    }

    const img = await getImageByMenuId(params.menu_id);
    if(!img || !img.data){
        throw error(404, 'Imagem não encontrada');
    }

    setHeaders({
        'Content-Type': img.type,
        'Content-Length': img.size.toString(),
        'Last-Modified': new Date(img.lastModified).toUTCString(),
        'Cache-Control': 'public, max-age=600'
    });

    return new Response(img.data);
})