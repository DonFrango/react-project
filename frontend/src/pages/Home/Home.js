import React, { useEffect, useState, useContext, useRef} from "react"; 
import axios from "axios";
import { Box, Stack, TextField, MenuItem, Button} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import Post from "../../components/Post";


const Home = () => {
  const [posts, setPosts]= useState([]);
  const [reactions, setReactions] = useState([]);
  let { user } = useContext(AuthContext);  
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId]= useState('');
  const keyword=useRef();
  const [startDate, setStartDate]= useState('');
  const [endDate, setEndDate]= useState('');

  useEffect(() => {
    getPosts();
    getReactions();
    getPostCategories();
    }, []);

    let getPostCategories=()=> {
      axios.get("http://localhost:8081/categories")
      .then((response)=> {
          console.log(response.data)
          setCategories(response.data.categories)
      })
      .catch((error) => {
          console.log(error);
      });
  };

  let handleCategoryChange=(event) => {
    setCategoryId(event.target.value);
};
let handleStartDate=(event) => {
  setStartDate(new Date(event.target.value));
};

let handleEndDate=(event) => {
  setEndDate(new Date(event.target.value));
};

  let getPosts = async () => {
    axios
    .get("http://localhost:8081/posts")
    .then((response)=> {
      console.log(response.data.posts);
      setPosts(response.data.posts);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  let getReactions = async () => {
    axios
    .get("http://localhost:8081/reactions/" + user.id)
    .then((response)=> {
      console.log(response.data.reactions);
      setReactions(response.data.reactions);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  let reactPost = async (post_id, reaction) => {
    var raw = {
      post_id: post_id,
      user_id: user.id,
      reaction: reaction
    };
    axios
    .post("http://localhost:8081/post/reaction/", raw)
    .then((response)=> {
      console.log(response.data);
      if(response.data.action === "insert") {
        setReactions([
           ...reactions,
           {post_id: post_id, reaction_id: reaction}
        ]);
        if (reaction === 1) {
          setPosts(
            posts.map((item) =>
             item.id === post_id ? {...item, likes: item.likes + 1} : item
          )
          );
        } else {
          setPosts(
            posts.map((item) =>
             item.id === post_id ? {...item, dislikes: item.dislikes + 1} : item
          )
          );
        }
      }
      if(response.data.action === "delete"){
        setReactions(reactions.filter((item) => item.post_id !== post_id));
        if (reaction === 1) {
          setPosts(
            posts.map((item) =>
             item.id === post_id ? {...item, likes: item.likes - 1} : item
          )
          );
        } else {
          setPosts(
            posts.map((item) =>
             item.id === post_id 
             ? {...item, dislikes: item.dislikes - 1} 
             : item
           )
          );
        }
      }

      if(response.data.action === "update"){
        setReactions(
          reactions.map((item) =>
           item.post_id === post_id
           ? {...item, reaction_id: reaction}
           : item
           )
        );
        if (reaction === 1) {
          setPosts(
            posts.map((item) =>
             item.id === post_id 
             ? {
              ...item,
              likes: item.likes + 1,
              dislikes: item.dislikes - 1,
            } 
             : item
          )
          );
        } else {
          setPosts(
            posts.map((item) =>
             item.id === post_id 
             ? {
              ...item, 
              dislikes: item.dislikes + 1, 
              likes: item.likes - 1,
            } 
             : item
          )
          );
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  let searchPosts = async () => {
    var raw = {
      category: categoryId,
      start_date: startDate,
      end_date: endDate,
      keyword: keyword.current.value
    };

    axios.post("http://localhost:8081/posts/search", raw)
    .then((response) => {
      setPosts(response.data.posts)
    })
    .then((error) => {
      console.log(error)
    });
    
  }

  return (
   
    <Box width={"100%"} height={"100%"}>
      
      <Stack gap={2} alignItems={"center"}>
            <Stack 
            gap={2}
            width={"40%"} 
            direction={'row'}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{background: "white", borderRadius: "16px", padding: "5px"}}
            >
                <TextField inputRef={keyword} label={"Keyboard"} size={"small"}/>
                <input style={{height: "30px"}} type="datetime-local" onChange={handleStartDate}/>
                <input style={{height: "30px"}} type="datetime-local" onChange={handleEndDate} />
                <TextField 
                    sx={{width: "30%"}}
                    select sixe="small" 
                    label={"Category"} 
                    value={categoryId}
                    onChange={handleCategoryChange}
                    >
                    <MenuItem value={''}>&nbsp;</MenuItem>
                        {categories.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                            {item.name}
                    </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="outlined" onClick={() => searchPosts()}>Search</Button>
            </Stack>
            <Stack 
            gap={2} 
            alignItems={"center"}>
              {posts.map((post) =>(
                <Post 
                key={post.id}
                post={post}
                user={user}
                posts={posts}
                reactions={reactions}
                setReactions={setReactions}
                setPosts={setPosts}
                reactPost={reactPost}
                page={"dashboard"}
                />            
              ))}
            </Stack>
      </Stack>
      
    </Box>
  );
};

export default Home;