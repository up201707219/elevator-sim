import example1 from "$lib/assets/img/example1.jpg"
import example2 from "$lib/assets/img/example2.jpg"
import example3 from "$lib/assets/img/example3.jpg"

export const lessonModules = [
    {
        id:1,
        name:"Comando do ascensor",
        image: example2,
        lessonsDone: 0,
        lessonsTotal: 4
    },    
    {
        id:2,
        name:"Cabina",
        image: example1,
        lessonsDone: 50,
        lessonsTotal: 100
    },
    {
        id:3,
        name:"Poço",
        image: example3,
        lessonsDone: 4,
        lessonsTotal: 15
    },
    // {
    //     name:"Caixa de Máquinas",
    //     image: example2,
    //     lessonsDone: 20,
    //     lessonsTotal: 25
    // },
    // {
    //     name:"Lição 5",
    //     image: example2,
    //     lessonsDone: 28,
    //     lessonsTotal: 28
    // }
];