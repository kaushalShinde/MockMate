import React from "react";
import { Skeleton, Stack, Avatar } from "@mui/material";

function ChatListLoader({ w = "100%" }) {
  console.log("Rendered Component: ChatListLoader.jsx");

  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <Stack
          key={index}
          direction="row"
          spacing={2}
          alignItems="center"
          width={w}
          padding={1}
          sx={{ border: "1px solid #ccc" }}
        >
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ backgroundColor: "#ccc" }}
          >
            <Avatar />
          </Skeleton>
          <Skeleton
            animation="wave"
            variant="rounded"
            height={20}
            width="70%"
            sx={{ backgroundColor: "#ccc" }}
          />
        </Stack>
      ))}
    </>
  );
}

export default ChatListLoader;
