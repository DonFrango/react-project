import React, { useRef } from "react";
import axios from "axios";
import { TextField } from "@mui/material";

const CommentField = ({ post_id, user, setPosts, posts}) => {
    const comment = useRef();

    let commentPost = () => {
        if (comment.current.value.length <= 0) {
         return;
        }

        var raw = {
            post_id: post_id,
            user_id: user.id,
            comment: comment.current.value
        };
        axios
        .post("http://localhost:8081/comment/insert", raw)
        .then((response)=> {
            console.log(response.data);
            setPosts(
                posts.map((item) =>
                item.id=== post_id
                ? {
                    ...item,
                     comments: [
                      ...item.comments,
                      {
                        comment: comment.current.value,
                        created_at: new Date().getDate(),
                        user: user.name,
                      },
                    ],
                  }
                : item
            )
        );
        comment.current.value = "";
    })
        .catch((err) => {
            console.log(err);
        });
};

return (
        <TextField 
        inputRef={comment}
        size="large"
        onKeyDown={(ev) => {
            if (ev.key === "Enter") {
                commentPost();
            }
        }}
        label={"Add comment"}
        />
    );
};

export default CommentField;