--------------------------- CREATE QUERIES ----------------------

CREATE TABLE Users (
   id SERIAL PRIMARY KEY,
   username varchar(64),
   pass varchar(64),
   isAdmin boolean
);

CREATE TABLE Courses (
    ID varchar(128) PRIMARY KEY,
    Title varchar(100) NOT NULL,
    Descript varchar(65535),
    DurMin int,
    DurMax int,
    TimeType varchar(32) DEFAULT 'min',
    ImageID int,
    isDeleted boolean DEFAULT FALSE,
    CONSTRAINT duration_positive CHECK (DurMin > 0 AND DurMax > 0),
    CONSTRAINT course_title_notEmpty CHECK ( (Title = '') IS NOT TRUE)
);

CREATE TABLE User_Courses (
   User_ID Integer REFERENCES Users(id) ON DELETE CASCADE,
   Course_ID varchar(128) REFERENCES Courses(id) ON DELETE CASCADE,
   Completion Integer,
   PRIMARY KEY (User_ID, Course_ID)
);


CREATE TABLE Modules (
    ID varchar(128) PRIMARY KEY,
    Title varchar(100) NOT NULL,
    position SERIAL,
    CourseID varchar(128) NOT NULL,
    isDeleted boolean DEFAULT FALSE,
    CONSTRAINT fk_course
        FOREIGN KEY(CourseID)
            REFERENCES Courses(ID)
                ON DELETE CASCADE,
    CONSTRAINT module_title_notEmpty CHECK ( (Title = '') IS NOT TRUE)
);

CREATE TABLE User_Modules (
   User_ID Integer REFERENCES Users(id) ON DELETE CASCADE,
   Module_ID varchar(128) REFERENCES Modules(id) ON DELETE CASCADE,
   Completion Integer,
   PRIMARY KEY (User_ID, Module_ID)
);

CREATE TABLE Module_Content (
    ID varchar(128) PRIMARY KEY,
    title varchar(128),
    Content varchar(65535),
    Page_ind SERIAL,
    isDeleted boolean DEFAULT FALSE,
    ModuleID varchar(128) REFERENCES Modules(ID) ON DELETE CASCADE
);

CREATE TABLE Question_Dev (
    ID varchar(128) PRIMARY KEY,
    Course_ID varchar(128) REFERENCES Courses(ID) ON DELETE CASCADE,
    Content varchar(100),
    Completion_Time Integer,
    isDeleted boolean DEFAULT FALSE
);

CREATE TABLE Question_Menu (
    ID SERIAL PRIMARY KEY,
    question_id varchar(128) REFERENCES Question_Dev(ID) ON DELETE CASCADE,
    Title varchar(100),
    Descript varchar(100),
    Response varchar(64),
    Parent_ID INTEGER REFERENCES Question_Menu(ID) ON DELETE CASCADE,
    Points Integer
);

CREATE TABLE Menu_Images (
   Menu_ID INTEGER PRIMARY KEY REFERENCES Question_Menu(ID) ON DELETE CASCADE,
   IMAGE_NAME Varchar(128) NOT NULL,
   IMAGE_TYPE Varchar(128) NOT NULL,
   IMAGE_LAST_MODIFIED INTEGER NOT NULL DEFAULT date_part('epoch', now()), 
   IMAGE_SIZE INTEGER NOT NULL,
   IMAGE_DATA BYTEA NOT NULL
);

CREATE TABLE Question_Images (
   Question_ID varchar(128) PRIMARY KEY REFERENCES Question_Dev(ID) ON DELETE CASCADE,
   IMAGE_NAME Varchar(128) NOT NULL,
   IMAGE_TYPE Varchar(128) NOT NULL,
   IMAGE_LAST_MODIFIED INTEGER NOT NULL DEFAULT date_part('epoch', now()), 
   IMAGE_SIZE INTEGER NOT NULL,
   IMAGE_DATA BYTEA NOT NULL
);

------------------------ INSERT QUERIES ----------------------
--USERS
INSERT INTO Users (Username, Pass, isAdmin)
VALUES (
    'NoAdmin', 
    'pass123',
    FALSE
 );

INSERT INTO Users (Username, Pass, isAdmin)
VALUES (
    'Admin', 
    'pass123',
    True
 );

-- COURSES
INSERT INTO Courses (ID, Title, Descript, DurMin, DurMax)
VALUES (
    '1', 
    'Comando do Ascensor',
    'Uma descrição muito grande para efeito real.<p> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>',
    150,
    180
 );

INSERT INTO Courses (ID, Title, Descript, DurMin, DurMax)
VALUES (
    '2', 
    'Cabina',
    'Uma descrição',
    15,
    30
 );

 --USER COURSE PROGRESSION

 INSERT INTO User_Courses (User_ID, Course_id, completion)
VALUES (
    1, 
    '1',
    1
 );

INSERT INTO User_Courses (User_ID, Course_id, completion)
VALUES (
    2, 
    '2',
    0
 );

-- MODULES
INSERT INTO Modules (ID, Title, CourseID)
VALUES (
    '1',
    'Introdução',
    '1'
 );

INSERT INTO Modules (ID, Title, CourseID)
VALUES (
    '2',
    'Mover o ascensor de andar',
    '1'
 );
 
-- USER MODULE PROGRESSION
 INSERT INTO User_Modules (User_ID, Module_id, completion)
VALUES (
    1, 
    '1',
    2
 );

-- MODULE CONTENT
INSERT INTO Module_Content (ID, title, Content, ModuleID)
VALUES (
    '1',
    'Para Começar',
    'Este comando é o MC12',
    '1'
 );

INSERT INTO Module_Content (ID, Title, Content, ModuleID)
VALUES (
    '2',
    'Setup inicial',
    'Este continua a ser o MC12',
    '1'
 );

 INSERT INTO Module_Content (ID, Title, Content, ModuleID)
VALUES (
    '3',
    'Botão de ascender',
    'Este continua a ser o MC12',
    '2'
 );

INSERT INTO Question_Dev (ID, Content, Completion_Time)
VALUES (
    '0',
    'Apesar de interromper o feixe da cortina fotoelétrica, a porta fecha.',
    120
 );

 ----------------------- MENU INSERTION ----------------------------

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Cabine do ascensor',
    '0',
    'Escolha uma componente da cabine',
    'menu',
    null,
    null
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Porta',
    '0',
    'Escolha uma componente',
    'menu',
    1,
    null
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Comando de portas',
    '0',
    'Escolha uma ação',
    'menu',
    2,
    null
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar comando de porta',
    '0',
    'Reparar comando de porta',
    'answer',
    3,
    50
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar motor',
    '0',
    'Reparar motor do comando de porta',
    'answer',
    3,
    0
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar encoder',
    '0',
    'Reparar encoder do comando de porta',
    'answer',
    3,
    0
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Cortina fotoelétrica',
    '0',
    'Escolha uma componente',
    'menu',
    1,
    null
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Analisar Cabos',
    '0',
    'Escolha uma ação',
    'menu',
    7,
    null
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar',
    '0',
    null,
    'answer',
    8,
    -10
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Placa de controlo da cortina',
    '0',
    'Escolha uma ação',
    'menu',
    7,
    null
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar',
    '0',
    'Reparar placa de controlo da cortina',
    'answer',
    10,
    0
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar cortina fotoelétrica',
    '0',
    null,
    'answer',
    7,
    0
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Alinhar cortina fotoelétrica',
    '0',
    null,
    'answer',
    7,
    50
 );

INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Reparar botoneira',
    '0',
    null,
    'answer',
    1,
    -20
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Quadro de comandos',
    '0',
    'Escolha uma ação',
    'menu',
    null,
    null
 );

 INSERT INTO Question_Menu(Title, Question_id, Descript, Response, Parent_ID, Points)
 VALUES (
    'Bater no quadro de comandos',
    '0',
    null,
    'answer',
    15,
    -100
 );


------------------------ IMPORTANT SELECTS ----------------------

-- GET COURSE DETAILS + MODULES
SELECT * FROM 
(SELECT Courses.*, Modules.Title AS module, Modules.ID AS module_id FROM Courses
LEFT JOIN Modules
ON Courses.ID = Modules.CourseID
ORDER BY Modules.position) AS course
WHERE course.ID = '1';


-- GET COURSES OVERALL DETAILS
SELECT Courses.ID, Courses.Title, lessonCount.Total FROM Courses, 
(SELECT COUNT(Modules.Title) AS Total, Courses.ID FROM Courses
LEFT JOIN Modules
ON Modules.courseID = Courses.ID
GROUP BY Courses.ID) AS LessonCount
WHERE lessonCount.ID = Courses.ID  AND Courses.isDeleted IS NOT TRUE 


-- GET MODULE CONTENT
SELECT Module_Content.id, Module_Content.content, Module_Content.page_ind, Modules.ID as moduleid, Modules.title FROM Modules
LEFT JOIN Module_Content ON Modules.ID = Module_Content.ModuleID
WHERE Modules.ID = '2';


-- GET COURSES FINISHED AND UNFINISHED
SELECT courses.id, courses.title, ac.completion, ac.user_id FROM Courses
LEFT JOIN (SELECT co.id, co.title, uc.completion, uc.user_id FROM Courses co
left JOIN User_Courses uc
ON co.ID = uc.course_id
Where uc.user_id = 1) as ac
ON ac.id=courses.id;

-- OVERALL COURSE STATS

SELECT fc.*, cnt.total FROM
(SELECT courses.id, courses.title, ac.completion, ac.user_id FROM Courses 
LEFT JOIN (SELECT co.id, co.title, uc.completion, uc.user_id FROM Courses co
left JOIN User_Courses uc
ON co.ID = uc.course_id
Where uc.user_id = 1) as ac
ON ac.id=courses.id
WHERE courses.isDeleted is false) as fc
left join (SELECT COUNT(Modules.Title) AS Total, Courses.ID FROM Courses
LEFT JOIN Modules
ON Modules.courseID = Courses.ID
WHERE Modules.isDeleted is false
GROUP BY Courses.ID) as cnt
ON cnt.id = fc.id;

-- OVERALL MODULES STATS

SELECT fc.*, cnt.total FROM
(SELECT modules.id, modules.title, ac.completion, ac.user_id FROM Modules 
LEFT JOIN (SELECT co.id, co.title, uc.completion, uc.user_id FROM Modules co
left JOIN User_Modules uc
ON co.ID = uc.module_id
Where uc.user_id = 1) as ac
ON ac.id=modules.id
WHERE modules.isDeleted is false) as fc
left join (SELECT COUNT(Module_Content.Title) AS Total, Modules.ID FROM Modules
LEFT JOIN Module_Content
ON Module_content.ModuleID = Modules.ID
GROUP BY Modules.ID) as cnt
ON cnt.id = fc.id;
------------------------ IMPORTANT UPDATES ----------------------------

UPDATE Courses
SET Title = 'Comando do Ascensor'
WHERE ID = '1';

UPDATE Courses
SET Title = 'Cabine 1',
    Descript = 'Uma descrição diferente',
    DurMin = 16,
    DurMax = 31,
    TimeType = 'h'
WHERE ID = '2';

UPDATE Module_content
SET content = 'algo',
    page_ind = 1,
WHERE ID = '1';

------------------------ IMPORTANT DELETES ----------------------------

DELETE FROM Courses
WHERE ID = 1;

 ----------------------- DROP TABLES ------------------------
 DROP TABLE IF EXISTS Courses, Modules, Users, User_Courses, User_Modules, Module_Content, Question_Dev, Question_Menu, Menu_Images, Question_Images; 