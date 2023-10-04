import { Pool } from 'pg';

export const pool = new Pool({
    user:'frm',
    database:'sat',
    password:'Sat#frm!',
    port: 5432,
    host: '10.230.100.97',
})