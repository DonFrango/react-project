import React from "react";
import { Box, Button, Card, Stack, Switch, Typography} from "@mui/material";
import axios from "axios";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentField from "./CommentField";
import { Dashboard } from "@mui/icons-material";



const Post = (props) => {
    let { post, user, posts, setPosts, reactions, page, reactPost } = props;

    let deletePost = (post_id) => {
        var raw = {
          post_id: post_id,
          user_id: user.id    
        }
        axios
        .post("http://localhost:8081/post/delete/", raw)
        .then((response)=> {
          console.log(response.data);
          setPosts(posts.filter((item) => item.id !== post_id));
        })
        .catch((error) => {
          console.log(error);
        });
      };
    
      let changeIsPublic = (post_id) => {
        var raw = {
          post_id: post_id,
          user_id: user.id
        };
        axios
        .post("http://localhost:8081/post/public/", raw)
        .then((response)=> {
          console.log(response.data);
          if (page==="dashboard") {
          setPosts(posts.filter((item) => item.id !== post_id));
          }
          if (page==="profile") {
            setPosts(
              posts.map((post) =>
               post.id === post_id ? 
              {...post, is_public: !post.is_public===1 ? 0 : 1 }
              : post
              )
            );
          }
        //   else{
        //       setPosts(posts.map((post) => post.id === post_id ? 
        //       {...post, is_public: !post.is_public===1 ? 0:1} 
        //       : post
        //       )
        //     );
        //   }
         })
        .catch((err) => {
          console.log(err);
        });
      };

      
    return (
        <Card sx={{ 
            borderLeft: post.status===2 && "5px solid red",
            padding: 2, 
            width: "100%",
            maxWidth: "500px",
            minWidth: "300px",
            
        }} 
            key={post.id}>
          <Stack gap={1}>
              <Stack 
              direction={"row"}
              justifyContent={"space-between"}>
                <Typography 
                fontSize={"20px"} 
                fontWeight={"bold"}>
                  {post.title}
                </Typography>
            
               {user.id===post.user_id && (
               <Stack direction={"row"} gap={1}>
                  <Switch onChange={() => changeIsPublic(post.id)} defaultChecked/>
                  <Button onClick={() => deletePost(post.id)}>X</Button>
                </Stack>
                )}
            
              </Stack>
              <Box>
              <Typography 
              fontSize={"14px"}>
                {post.description}
              </Typography>
              </Box>
              <Box textAlign={"right"}>
              <Typography 
              fontSize={"14px"}>
                {post.keywords}
              </Typography>
              </Box>
              <Box textAlign={post.type!==1 && "center"}>
              {post.type ===1 ? (
              <Typography>{post.post}</Typography>
              ) : post.type ===2 ? (
              <Box 
              component={"img"} 
              sx={{ width: "320px", height: "240px"}}
              src={"http://localhost:8081/" + post.post}/>
              ) : post.type === 3 ? (
                      <video width="320" height={"240"} muted autoPlay loop controls>
                      <source src={"http://localhost:8081/"+post.post} />
                      </video>
              ) : (
                <Box>
                  <object
                    width="320px"
                    height="240px"
                    type="application/pdf"
                    data={"http://localhost:8081/"+post.post}>
                  </object>
                </Box>
                )}
              </Box>
              <Stack direction={'row'} gap={1} justifyContent={"space-between"} alignItems={"center"}>
                <Stack direction={"row"} gap={2}>
                  <Stack direction={"row"} gap={2}>
                    <ThumbUpOffAltIcon color="info"/>
                    {post.likes}
                    </Stack>
                    <Stack direction={"row"} gap={1}>
                    <ThumbDownOffAltIcon color="info"/>
                    {post.dislikes}
                    </Stack>
                  </Stack> 
              {page==="dashboard" && (
             <Stack direction={"row"} gap={1}>
                <Button
                  onClick={() => reactPost(post.id, 1)} 
                  variant={reactions.filter((reaction)=>reaction.post_id === post.id
                    )[0]?.reaction_id === 1 ? "contained" : "outlined"} 
                  >Like
                 </Button>
                <Button
                 onClick={() => reactPost(post.id, 2)}
                 variant={reactions.filter((reaction)=>reaction.post_id === post.id
                  )[0]?.reaction_id === 2 ? "contained" : "outlined"} 
                 >
                 Dislike
                </Button>
                </Stack>
                )}
              </Stack>
              <Typography fontFamily={"monospace"} fontSize={"12px"}>
                Comments
                </Typography>
                <Stack gap={1}>
                  {post.comments.map((post) => (
                    <Stack key={post.id}>
                      <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Typography fontWeight={"bold"}>{post.user}</Typography>
                        <Typography fontSize={"10px"}>
                          {[post.created_at]}
                        </Typography>
                      </Stack>
                        <Typography>{post.comment}</Typography>
                    </Stack>
                  ))}
               {page === "dashboard" &&
                <CommentField 
                post_id={post.id} 
                user={user} 
                setPosts={setPosts} 
                posts={posts}
                />  }
              </Stack>
            </Stack>
          </Card>
    )
}

export default Post;