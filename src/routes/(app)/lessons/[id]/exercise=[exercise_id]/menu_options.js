export const options = [
    {
        title: "Cabine do Ascensor",
        description: "Escolha uma componente da cabine",
        actions: [    
            {
                title: "Porta",
                description: "Escolha uma componente",
                actions:[
                    {
                        title: "Botões de cabine",
                        description: "Escolha uma ação",
                        actions: [
                            {
                                title: "Reparar",
                                actions: [],
                                input: 1
                            }
                        ],
                    },
                ]
            },
            {
                title: "Cortina fotoelétrica",
                description: "Escolha uma ação",
                actions: [
                    {
                        title: "Analisar cabos",
                        description: "Escolha uma ação",
                        actions: [
                            {
                                title: "Reparar",
                                actions: [],
                                input: 2
                            }
                        ],
                    },
                    {
                        title: "Placa de controlo da cortina",
                        description: "Escolha uma ação",
                        actions: [
                            {
                                title: "Reparar",
                                actions: [],
                                input: 5
                            }
                        ],
                        
                    },
                    {
                        title: "Substituir cortina fotoelétrica",
                        actions: [],
                        input: 3
                    },
                    {
                        title: "Alinhar",
                        actions: [],
                        input: 4
                    },
                    
                ],
            },
            {
                title: "Reparar botoneira",
                actions: [],
                input: 6
            }
        ]
    },
    {
        title: "Quadro de comandos",
        description: "Selecione uma compoente do quadro de comandos",
        actions:[
            {
                title: "Bater no quadro de comandos",
                actions:[],
                input: 7
                
            }
        ],
    }
];

import qc from "$lib/assets/img/quadro_de_comandos.png"
import c from "$lib/assets/img/cabine.jpg"

export const option = [
    {
        title: "Cabine do ascensor",
        description: "Escolha uma componente da cabine",
        response: "menu",
        parent: null,
        image: c,
        id:1
    },
    {
        title: "Porta",
        description: "Escolha uma componente",
        response: "menu",
        parent: 1,
        image: null,
        id: 2
    },
    {
        title: "Comando de portas",
        description: "Escolha uma ação",
        response: "menu",
        parent: 2,
        image: null,
        id: 3
    },
    {
        title: "Reparar comando de porta",
        description: "Reparar comando de porta",
        response: "answer",
        parent: 3,
        points: 50,
        id: 4     
    },
    {
        title: "Reparar motor",
        description: "Reparar motor do comando de porta",
        response: "answer",
        parent: 3,
        points: 0,
        id: 5   
    },
    {
        title: "Reparar encoder",
        description: "Reparar encoder do comando de porta",
        response: "answer",
        parent: 3,
        points: 0,
        id: 6 
    },
    {
        title: "Cortina fotoelétrica",
        description: "Escolha uma componente",
        response: "menu",
        parent: 1,
        image: null,
        id: 7
    },
    {
        title: "Analisar Cabos",
        description: "Escolha uma ação",
        response: "menu",
        parent: 7,
        image: null,
        id: 8
    },
    {
        title: "Reparar",
        description: "Reparar cabos da cortina",
        response: "answer",
        parent: 8,
        points: -10,
        id: 9
    },
    {
        title: "Placa de controlo da cortina",
        description: "Escolha uma ação",
        response: "menu",
        parent: 7,
        image: null,
        id: 10
    },
    {
        title: "Reparar",
        description: "Reparar placa de controlo da cortina",
        response: "answer",
        points: 0,
        parent: 10,
        id: 11
    },
    {
        title: "Reparar cortina fotoelétrica",
        response: "answer",
        points: 0,
        parent: 7,
        id: 12
    },
    {
        title: "Alinhar cortina fotoelétrica",
        response: "answer",
        points: 50,
        parent: 7,
        id: 13
    },
    {
        title: "Reparar botoneira",
        response: "answer",
        parent: 1,
        points: -20,
        id: 14
    },
    {
        title: "Quadro de comandos",
        description: "Escolha uma ação",
        response: "menu",
        parent: null,
        image: qc,
        id: 15
    },
    {
        title: "Bater no quadro de comandos",
        response: "answer",
        points: -100,
        parent: 15,
        id: 16
    },
];
