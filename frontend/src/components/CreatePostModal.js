import React, { useEffect, useState, useRef, useContext } from "react";
import { Modal, Box, Stack, Typography, TextField, MenuItem, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Input, Button } from '@mui/material';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


const ModalStyle = {
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%, -50%)",
    width:400,
    background:"white",
    padding: 2,
    borderRadius: "10px",
    outline: "none"
};

const CreatePostModal = ({ open, close }) => {
        const [typeId, setTypeId]= useState('');
        const [categoryId, setCategoryId]= useState('');
        const [type, setTypes]= useState([]);
        const [categories, setCategories] = useState([]);
        const keywords=useRef();
        const description=useRef();
        const [isPublic,setIsPublic]=useState(0);
        const file=useRef();
        const post=useRef();
        const title =useRef();
        let { user } = useContext(AuthContext);

        useEffect(() => {
            getPostTypes();
            getPostCategories();
        }, []);
        
        let getPostTypes=()=> {
            axios.get("http://localhost:8081/type")
            .then((response)=> {
                console.log(response.data)
                setTypes(response.data.type)
            })
            .catch((error) => {
                console.log(error);
            });
        };

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

        let handleTypeChange=(event) => {
            setTypeId(event.target.value);
        };

        let handleCategoryChange=(event) => {
            setCategoryId(event.target.value);
        };
        let handleChange = (event)=>{
            setIsPublic(event.target.value);
        };

        let CreatePost = async () => {
            const uploadData = new FormData();
            if (title.current.value.length===0)
            {   
                console.log("Post title is required");
                return;
            }
            if (keywords.current.value.length===0)
            {   
                console.log("Post keywords is required");
                return;
            }
            if (description.current.value.length===0)
            {   
                console.log("Post description is required");
                return;
            }
            if (typeId===``)
            {   
                console.log("Please select type");
                return;
            }
            if (categoryId===``)
            {   
                console.log("Select a category");
                return;
            }
            if(typeId === 1 && post.current.value.length===0)
            {
                console.log("Post is required");
                return;
            }
            if (file.current?.files[0]) {
                uploadData.append(
                    "file", 
                    file.current.files[0],
                    file.current.files[0].name
                    );
            }
            uploadData.append("title",title.current.value);
            uploadData.append("keywords",keywords.current.value);
            uploadData.append("description",description.current.value);
            uploadData.append("type",typeId);
            typeId === 1 && uploadData.append("post",post.current.value);
            uploadData.append("category",categoryId);
            uploadData.append("public",isPublic);
            uploadData.append("user_id", user.id);

            axios.post("http://localhost:8081/upload", uploadData)
            .then((response) =>{
                console.log(response);
                close();
            })
            .catch((error) => {
                console.log(error);
            });
        };
       

    return(
        <Modal 
        sx={{backgroynd:"rgba(48,152,213,0)"}}
        open={open}
        onClose={close}>
            <Box sx={ModalStyle}>
                <Stack gap={2}>
                <Box>
                <Typography fontWeight={"bold"}>Create post</Typography>
                </Box>
                <Box>
                    <TextField inputRef={title} sixe="small" label={"Post Title"} />
                </Box>
                <Box width={"50%"}>
                    <TextField fullWidth
                     select 
                     sixe="small" 
                     label={"Type"} 
                     value={typeId} 
                     onChange={handleTypeChange}>
                        <MenuItem value={''}>&nbsp;</MenuItem>
                        {type.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            {item.name}
                        </MenuItem>
                        ))}
                    </TextField>
                </Box>
                {typeId !==1 && typeId !=='' ?(
                    <Box>
                        <Input type="file" inputRef={file}/>
                    </Box>
                ):(
                    <Box width={"100%"}>
                        {typeId !=='' && (
                    <TextField
                     multiline
                     fullWidth
                      label={"Post"} 
                      rows={2} 
                      inputRef={post} />
                      )}
                </Box> 
                )}
                <Box width={"50%"}>
                    <TextField 
                    fullWidth 
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
                </Box>
               
                <Box>
                    <TextField label={"Key Words"} size={"small"} inputRef={keywords} />
                </Box>
                <Box width={"100%"}>
                    <TextField
                     multiline
                      label={"Description"} 
                      rows={2} 
                      inputRef={description} />
                </Box>
                <Box>
                    <FormControl>
                        <FormLabel>Would you like to make this post Public?</FormLabel>
                        <RadioGroup value={isPublic} onChange={handleChange}>
                            <FormControlLabel value={'0'} control={<Radio/>} label='No'/>
                            <FormControlLabel value={'1'} control={<Radio/>} label='Yes'/>
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Stack direction={"rows"}
                gap={2}
                justifyContent={"right"}
                width={"100%"}
                >
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={()=>CreatePost()}>Post</Button>
                </Stack>
                </Stack>
            </Box>
        </ Modal>
    )
};

export default CreatePostModal;