import pkg from 'pg';
const { Pool } = pkg;

// export const pool = new Pool({
//     user:'frm',
//     database:'sat',
//     password:'Sat#frm!',
//     port: 5432,
//     host: '10.230.100.97',
// })

export const pool = new Pool({
    user:'postgres',
    database:'postgres',
    password:'oscar123',
    port: 5432,
    host: 'localhost',
})
