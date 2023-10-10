import { json } from "@sveltejs/kit";
import { pool } from "$lib/db";

/** @type {import{'./$types'}.RequestHandler} */

export async function POST({ request }) {
    const { inputVar, ind } = await request.json();
    try{
        const query = "UPDATE frm.Courses "+
        "SET Title = " + inputVar + " " +
        "WHERE ID = " + ind + ";";
    }
    catch (err){
        console.error(err);
        const message = "Update query went wrong";
        return message;
    }
}