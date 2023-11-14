import { pool } from "$lib/db";

export const actions = {
    insertNewButton: async ({request}) => {
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

        let validImage = (val.image?.size !== 0 && val.image);
 
        let arrayBuffer;
        if(validImage){
            arrayBuffer = await val.image.arrayBuffer();
        }
        //console.log(val);

        try{
            let query;

            if(val.id !== 0){
                query = "UPDATE Question_Menu " +
                "SET descript = '" + val.description + "', " +
                "response = '" + val.response + "', " +
                "points = " + (isNaN(val.points)?"NULL":val.points) + ", " +
                "title = '" + val.title + "' ";
                
                if(validImage){
                    query += ", Image_Arr = '" + arrayBuffer + "' ";
                }

                query += "WHERE ID = '" + val.id + "';";
            }
            else{
                query = "INSERT INTO Question_Menu (Title, Question_Id, Descript, Response, Parent_ID, Points" + (!validImage ? ") \n": ", Image_Arr) \n") +
                "Values('" + val.title + "', '" + "0" +"', '" + val.description + "', '" + val.response + "', " + (val.parent??"NULL") + ", " + (isNaN(val.points)?"NULL":val.points) + (!validImage ? ");": ", '"+arrayBuffer+"' );");
            }
            //console.log(query);

            await pool.query(query);
        }
        catch(err){
            console.error(err);
        }  
    },



}