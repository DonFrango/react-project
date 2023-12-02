const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(express.json());

const db = mysql2.createPool({
    host: "127.0.0.1",
    user: "root",
    port: "3307",
    password: "",
    database: "webia-react-app"
})

const promiseDb = db.promise();

//REGISTER ROUTE
app.post('/signup', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let phone = req.body.phone;
    // if (emailRegex.test(email)) {
    //     return res.status(400).send({message: "Wrong email format"})
    // }
    try{
    let sql1 = 'SELECT * FROM login WHERE email = ?';
    const [rows, fields] = await promiseDb.execute(sql1, [email])
    if (rows.length > 0) {
      return res.status(400).send({ message: "User already exists" });     
    }
} catch (error) {
    console.log(error);
}
 
    try{
    let sql2 = 'INSERT INTO login (email, password, name, phone) VALUES (?, ?, ?, ?)';

    const [rows2, fields2] = await promiseDb.execute(sql2, [email, password, name, phone]);

    return res.status(200).send({message : "User registered successfully" });

    } catch (error) {
        console.log(error);
    }
    });

// LOGIN ROUTE

app.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
        let sql = 'SELECT * FROM login WHERE email = ? AND password = ?';
        const [rows, fields] = await promiseDb.execute(sql, [email, password]);
        if (rows.length > 0) {
            return res.status(200).send({ message: "Login successful", user: rows[0] });
        } 
            return res.status(400).send({ message: "Invalid Credentials" });
        
    } catch (error) {
        console.log(error);
    }
});

app.get("/user/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let sql = 'SELECT * FROM login WHERE id = ?';
        const [rows, fields] = await promiseDb.execute(sql, [id]);
        if (rows.length > 0) {
            return res.status(200).send({ user: rows[0] });
        } else {
            return res.status(400).send({ message: "User not found" });
        }       
    } catch (error) {
        console.log(error);
    }
});

app.post("/user/update", async (req, res) => {
    let id = req.body.id;
    let email = req.body.email;
    let old_password = req.body.old_password;
    let new_password = req.body.new_password;
    let name = req.body.name;
    let phone = req.body.phone;

    // if (emailRegex.test(email)) {
    //     return res.status(400).send({message: "Wrong email format"})
    // }
    try{
        let sql="SELECT * FROM login WHERE id=?";
        const [rows1, fields] = await promiseDb.execute(sql, [id])
        if (old_password!= rows1[0].password){
            return res.status(404).send({message: "Wrong Password"}); 
        }
    }
    catch (error) {
        console.log(error);
    }

    try{
        let sql = "UPDATE login SET email= ?, password=? , name=?, phone=? WHERE id=? AND password=?";
        const [rows, field] = await promiseDb.execute(sql,[ 
            email,
            new_password,
            name, 
            phone,id,
            old_password]
            )

        return res.status(200).send({message: "User updaated succesfully"});
    } catch (error) {
        console.log(error);
    }
});

app.get("/type", async (req, res) => {
    try{
        let sql = "SELECT * FROM type";
        const [rows, fields] = await promiseDb.execute(sql);
        if (rows.length > 0) {
            return res.status(200).send ({ type: rows });
        } else {
            return res.status(400).send ({ message: "Type not found" });
        }
    }catch (error){}
});

app.get("/categories", async (req, res) => {
    try{
        let sql = "SELECT * FROM categories";
        const [rows, fields] = await promiseDb.execute(sql);
        if (rows.length > 0) {
            return res.status(200).send ({ categories: rows });
        } else {
            return res.status(400).send ({ message: "Category not found" });
        }
    }catch (error){}
});

const upload = multer({
    dest: `uploads`,
});

app.post("/upload", upload.single('file'),async(req, res)=>{
    console.log(req.body);
    console.log(req.file);
    let title= req.body.title;
    let keywords= req.body.keywords;
    let description= req.body.description;
    let isPublic= parseInt(req.body.public);
    let type= parseInt(req.body.type);
    let category= parseInt(req.body.category);
    let post= type !== 1 ? req.file.originalname : req.body.post;
    let user_id= parseInt(req.body.user_id);

    if( type==1){
        try{
        let sql = "INSERT INTO files(post, user_id, category_id, type, title, keywords, description, is_public, date) VALUES (?,?,?,?,?,?,?,?,?)";
        const [rows, fields] = await promiseDb.execute(sql, [
            post,
            user_id,
            category,
            type, 
            title,
            keywords, 
            description, 
            isPublic, 
            new Date(),
        ]);
        return res
        .status(200)
        .send({message: "created successfully"})
        }catch(error){
            console.log(error)
        }
    }
    else {
        const tempPath = req.file.path;
        const targetPath = path.join(
            __dirname, 
            './uploads/' + req.file.originalname
            );

        fs.rename(tempPath, targetPath, async (err)=>{
            if(err) return handleError(err);
            try{
            let sql = "INSERT INTO files(post, user_id, category_id, type, title, keywords, description, is_public, date) VALUES (?,?,?,?,?,?,?,?,?)";
            const [rows, fields] = await promiseDb.execute(sql, [
                post,
                user_id,
                category,
                type, 
                title,
                keywords, 
                description, 
                isPublic, 
                new Date(),
            ]);
            return res
            .status(200)
            .send({message: "File posted successfully"});

            }catch(error){
                console.log(error)
            }
        });
        // return res
        // .status(200)
        // .send({message: "file upload failed"})
        }
});

app.get("/posts", async (req, res) => {
    console.log("Getting posts...")
    try{
        let sql = "SELECT * FROM files WHERE is_public = 1 ORDER BY id DESC";
        const [rows, fields] = await promiseDb.execute(sql);
        if (rows.length > 0) {
            for(const row of rows){
                let cat_sql = "SELECT name FROM categories WHERE id=?";
                const [catrows, catfields] = await promiseDb.execute(cat_sql, [
                    row.category_id
                ]);

                let user_sql = "SELECT name FROM login WHERE id=?";
                const [userrows, userfields] = await promiseDb.execute(user_sql, [
                    row.user_id
                ]);

                let type_sql = "SELECT name FROM type WHERE id=?";
                const [typerows, typefields] = await promiseDb.execute(type_sql, [
                    row.type
                ]);
                
                row["category"] = catrows[0].name;
                row["user"] = userrows[0].name;
                row["type"] = typerows[0].name;

                let comment_sql = "SELECT * FROM comments WHERE post_id=?";
                const [comments, commentfields] = await promiseDb.execute(comment_sql, [
                    row.id
                ]);

                    for (const comment of comments) {
                        let _sql = "SELECT name FROM login WHERE id=?";
                        const [rows, fields] = await promiseDb.execute(_sql, [
                            comment.user_id
                        ]);
                        comment['user']=rows[0].name;
                    }               
                    row["comments"] = comments;

                    let like_sql = "SELECT  COUNT (reaction_id) as count FROM post_reactions WHERE post_id=? and reaction_id=?";
                    const [likerows, likefields] = await promiseDb.execute(like_sql, [
                        row.id,
                        1
                    ]);
                    row["likes"] = likerows[0].count;

                    const [dislikerows, dislikefields] = await promiseDb.execute(like_sql, [
                        row.id,
                        2
                    ])
                    row["dislikes"] = dislikerows[0].count;


            }
            return res.status(200).send ({ posts: rows });
        } else {
            return res.status(400).send ({ message: "Post not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
    
});

app.get("/posts/user/:id", async (req, res) => {
    console.log("Getting user's posts...")
    let user_id= req.params.id;
    try{
        let sql = "SELECT * FROM files WHERE user_id=?";
        const [rows, fields] = await promiseDb.execute(sql, [user_id]);
        if (rows.length > 0) {
            for(const row of rows){
                let cat_sql = "SELECT name FROM categories WHERE id=?";
                const [catrows, catfields] = await promiseDb.execute(cat_sql, [
                    row.category_id
                ]);

                let user_sql = "SELECT name FROM login WHERE id=?";
                const [userrows, userfields] = await promiseDb.execute(user_sql, [
                    row.user_id
                ]);

                let type_sql = "SELECT name FROM type WHERE id=?";
                const [typerows, typefields] = await promiseDb.execute(type_sql, [
                    row.type
                ]);
                
                row["category"] = catrows[0].name;
                row["user"] = userrows[0].name;
                row["type"] = typerows[0].name;

                let comment_sql = "SELECT * FROM comments WHERE post_id=?";
                const [comments, commentfields] = await promiseDb.execute(comment_sql, [
                    row.id
                ]);

                    for (const comment of comments) {
                        let _sql = "SELECT name FROM login WHERE id=?";
                        const [rows, fields] = await promiseDb.execute(_sql, [
                            comment.user_id
                        ]);
                        comment['user']=rows[0].name;
                    }               
                    row["comments"] = comments;

                    let like_sql = "SELECT  COUNT (reaction_id) as count FROM post_reactions WHERE post_id=? and reaction_id=?";
                    const [likerows, likefields] = await promiseDb.execute(like_sql, [
                        row.id,
                        1
                    ]);
                    row["likes"] = likerows[0].count;

                    const [dislikerows, dislikefields] = await promiseDb.execute(like_sql, [
                        row.id,
                        2
                    ])
                    row["dislikes"] = dislikerows[0].count;


            }
            return res.status(200).send ({ posts: rows });
        } else {
            return res.status(400).send ({ message: "Post not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
    
});

app.post("/post/delete/", async (req, res) => {
    let post_id= req.body.post_id;
    let user_id= req.body.user_id;
    console.log("Deleting post..." + post_id);
    try {
        let sql= "SELECT * FROM files WHERE id=?";
        const [rows, fields] = await promiseDb.execute(sql, [post_id]);
        if (rows[0].user_id == user_id) {
            let sql2 = "DELETE FROM files WHERE id=? AND user_id=?";
            const [rows2, fields2] = await promiseDb.execute(sql2, [
                 post_id,
                 user_id
                ]);
            return res.status(200).send({message : "Post deleted successfully" });
        }else {
            return res.status(401).send({message : "Authentication failed" });
        }
    }catch (error) {
        console.log(error);
        return res.status(500).send({message : "Server Error" });
    }
});

app.post("/post/public/", async (req, res) => {
    let post_id= req.body.post_id;
    let user_id= req.body.user_id;
    console.log("Changing status" + post_id);
    try{
        let sql= "SELECT * FROM files WHERE id=?";
        const [rows, fields] = await promiseDb.execute(sql, [post_id]);
        let new_public = (rows[0].is_public === 1) ? 0 : 1;
        console.log(new_public);
        if (rows[0].user_id == user_id) {
            let sql3 =
             "UPDATE files SET is_public = ? WHERE id=? AND user_id=?";
            const [rows3, fields3] = await promiseDb.execute(sql3, [
                 new_public,
                 post_id,
                 user_id
                ]);
            return res.status(200).send({message : "Post public successfully", is_public: new_public });
        }else {
            return res.status(401).send({message : "Authentication failed" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message : "Server Error" });
        
    }
});

app.post("/post/reaction/", async (req, res) => {
    let post_id= req.body.post_id;
    let user_id= req.body.user_id;
    let reaction_id = req.body.reaction;

    try{
        let sql="SELECT * FROM post_reactions WHERE post_id=? AND user_id=?";
        const [rows, fields] = await promiseDb.execute(sql, [post_id, user_id]);
        if(rows.length){
            if(rows[0].reaction_id == reaction_id){
                let delete_sql = "DELETE FROM post_reactions WHERE post_id=?";
                const [deleterows, deletefields] = await promiseDb.execute(delete_sql, [post_id]);

                var action = "delete"
            } else {
                let update_sql = "UPDATE post_reactions SET reaction_id = ? WHERE post_id=?";
                const [updaterows, updatefields] = await promiseDb.execute(update_sql, [reaction_id, post_id]);

                var action = "update"
            }
        }
        else {
            let insert_sql = 
            "INSERT INTO post_reactions(post_id, user_id, reaction_id) VALUES (?,?,?)";
            const [insertrows, insertfields] = await promiseDb.execute(insert_sql, [
                post_id, 
                user_id, 
                reaction_id]);

            var action = "insert";
        }

        let like_sql = "SELECT COUNT(*) as count FROM post_reactions WHERE post_id=? AND reaction_id=?";
        const [likes, likefields] = await promiseDb.execute(like_sql, [
            post_id,
            1
        ]);

        const [dislikes, dislikefields] = await promiseDb.execute(like_sql, [
            post_id,
            2
        ]);

        let reactions = likes[0].count+dislikes[0].count;
        if(reactions>10){
            if (likes[0].count!=0){
                let coefficient = likes[0].count/ dislikes[0].count;
            
            if (coefficient>0.7){

                let update_sql = "UPDATE files SET is_public = ? WHERE id=?";
                const [update, updatefields] = await promiseDb.execute(update_sql, [2, post_id]);
            }
        }
        else{
            let update_sql = "UPDATE files SET is_public = ? WHERE id=?";
            const [update, updatefields] = await promiseDb.execute(update_sql, [2, post_id]);
        }
    }
    



        return res.status(200).send({message : "Reaction registerd successfully", action:action });
    }catch(error){
        console.log(error);
        return res.status(500).send({message : "Server Error" });
    }
});

app.get("/reactions/:user_id", async (req, res) => {
    let user_id = req.params.user_id;
    try {
        let sql = "SELECT post_id, reaction_id FROM post_reactions WHERE user_id=?";
        const [rows, fields] = await promiseDb.execute(sql, [user_id]);
        if(rows.length>0){
            return res.status(200).send({ reactions: rows });
        }
        else {
            return res.status(200).send({ reactions: [], message: "No reactions found" });
        }
        
    } catch (error) {
        console.log(error);
    }
});

app.post("/comment/insert", async (req, res) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let comment = req.body.comment;

    try {
        let sql = "INSERT INTO comments(user_id, post_id, comment_text, created_at) VALUES (?,?,?,?)";
        const [rows, fields] = await promiseDb.execute(sql, [
            user_id, 
            post_id, 
            comment,
            new Date()
        ]);
        return res.status(200).send({message : "Comment posted successfully" });
    } catch (error) {
        return res.status(500).send({message : error });
    }
});

app.get("/statistics", async (req, res) => {
    console.log("Getting statistics...");
    try{
        let user_sql= "SELECT COUNT(id) AS users FROM login";
        const [user, userfields] = await promiseDb.execute(user_sql);
        console.log(user[0].users);

        let post_sql= "SELECT COUNT(id) AS posts FROM files WHERE is_public = ?";
        const [posts, postfields] = await promiseDb.execute(post_sql, [1]);
        console.log("posts", posts[0].posts);

        let categories_sql= "SELECT * FROM categories";
        const [categories, categoriesfields] = await promiseDb.execute(categories_sql);
        console.log(categories);
        let category_stats = [];
        for (const category of categories)
        {
            let count_sql= "SELECT COUNT(category_id) as count FROM files WHERE category_id = ? AND is_public = ?";
            const [posts, postfields] = await promiseDb.execute(count_sql, [category.id, 1]);
          
            category_stats.push({
                category: category.name,
                count: posts[0].count
            })
            console.log(category_stats);
           
        }

        return res.status(200).send({message : "Stats retrived successfully",
        users: user[0].users,
        posts: posts[0].posts,
        categories: category_stats});
    } catch (error) {
        return res.status(500).send({message : error });
    }
    
})

app.post("/posts/search", async (req, res) => {
    let category_id = req.body.category;
    let keyword= req.body.keyword;
    let start_date= req.body.start_date;
    let end_date= req.body.end_date;
    var values = [ ];

    let search_sql = "SELECT * FROM files WHERE "
    if (category_id !==''){
        values.push(category_id);
        console.log(values);
        search_sql=search_sql + "category_id = ? ";
    }

    if (start_date !==''){
        values.push(start_date);
        if(category_id !==''){
            search_sql=search_sql + "AND ";
        }
        console.log(values);
        search_sql=search_sql + "date >= ? ";
    }
    
    if (end_date !==''){
        values.push(end_date);
        if(category_id !=='' || start_date !==''){
            search_sql=search_sql + " AND ";
        }
        console.log(values);
        search_sql=search_sql + "date <= ? ";
    }

    if(keyword !==''){
        values.push(keyword);
        values.push(keyword);
        values.push(keyword);
        if(category_id !=='' || start_date !=='' || end_date !==''){
            search_sql=search_sql + "AND ";
        }
        search_sql=
        search_sql + "description LIKE CONCAT('%', ? ,'%') OR keywords LIKE CONCAT('%', ? ,'%') OR title LIKE CONCAT('%', ? ,'%') ";

        console.log(values);
        
    }

    console.log(search_sql);
    if(values.length >0) {
    const [posts, postfields] = await promiseDb.execute(search_sql, values);
    
    let sql = "SELECT * FROM files WHERE is_public = 1 ORDER BY id DESC";
    const [rows, fields] = await promiseDb.execute(sql);
    if (posts.length > 0) {
        for(const row of posts){
            let cat_sql = "SELECT name FROM categories WHERE id=?";
            const [catrows, catfields] = await promiseDb.execute(cat_sql, [
                row.category_id
            ]);

            let user_sql = "SELECT name FROM login WHERE id=?";
            const [userrows, userfields] = await promiseDb.execute(user_sql, [
                row.user_id
            ]);

            let type_sql = "SELECT name FROM type WHERE id=?";
            const [typerows, typefields] = await promiseDb.execute(type_sql, [
                row.type
            ]);
            
            row["category"] = catrows[0].name;
            row["user"] = userrows[0].name;
            row["type"] = typerows[0].name;

            let comment_sql = "SELECT * FROM comments WHERE post_id=?";
            const [comments, commentfields] = await promiseDb.execute(comment_sql, [
                row.id
            ]);

                for (const comment of comments) {
                    let _sql = "SELECT name FROM login WHERE id=?";
                    const [rows, fields] = await promiseDb.execute(_sql, [
                        comment.user_id
                    ]);
                    comment['user']=rows[0].name;
                }               
                row["comments"] = comments;

                let like_sql = "SELECT  COUNT (reaction_id) as count FROM post_reactions WHERE post_id=? and reaction_id=?";
                const [likerows, likefields] = await promiseDb.execute(like_sql, [
                    row.id,
                    1
                ]);
                row["likes"] = likerows[0].count;

                const [dislikerows, dislikefields] = await promiseDb.execute(like_sql, [
                    row.id,
                    2
                ])
                row["dislikes"] = dislikerows[0].count;


        }
        return res.status(200).send ({ posts: posts });
    } else {
        return res.status(400).send ({ message: "Post not found", posts: [] });
    }
  }
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
})