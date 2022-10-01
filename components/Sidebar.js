import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";
import { useRouter } from "next/dist/client/router";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useState } from "react";

function Sidebar() {
  const [user] = useAuthState(auth);

  const [match, setMatch] = useState("");

  const router = useRouter();

  const chatSearchObj = {};

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const userEmailInput = prompt("Enter the gmail of the user to chat with: ");

    if (!userEmailInput) return null;

    if (
      EmailValidator.validate(userEmailInput) &&
      !chatAlreadyExsists(userEmailInput) &&
      userEmailInput !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, userEmailInput],
      });
    }
  };

  const chatAlreadyExsists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  chatsSnapshot?.docs.map((chat) => {
    chatSearchObj[getRecipientEmail(chat.data().users, user)] = true;
  });

  const goToHome = () => {
    router.push(`/`);
  };

  const searchChats = (searchTerm) => {
    const LCST = searchTerm.toLowerCase();

    for (const key in chatSearchObj) {
      if (key.indexOf(LCST) > -1) {
        chatSearchObj[key] = true;
        setMatch(chatSearchObj);
      } else {
        chatSearchObj[key] = false;
        setMatch(chatSearchObj);
      }
    }
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} />
        {/* <h3 style={{ fontSize: 17, color: '#495057' }}>{user?.displayName}</h3> */}
        <IconsContainer>
          <IconButton onClick={goToHome}>
            <HomeOutlinedIcon style={{ fontSize: 25 }} />
          </IconButton>
          {/* <IconButton>
            <MoreVertIcon style={{ fontSize: 22 }} />
          </IconButton> */}
          <IconButton
            onClick={() => {
              auth.signOut();
              router.push("/");
            }}
          >
            <ExitToAppIcon style={{ fontSize: 25 }} />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon style={{ fontSize: 22, marginRight: "1rem" }} />
        <SearchInput
          placeholder="Search for chats..."
          onInput={(e) => searchChats(e.target.value)}
        />
        {/* or Add Chat (s) by Gmail */}
      </Search>

      <ChatList
      // style={Object.keys(chatSearchObj).length > 6 ? yscroll : yhidden}
      >
        {/* List of Chats */}
        {chatsSnapshot?.docs.map((chat) => (
          <Chat
            key={chat.id}
            id={chat.id}
            users={chat.data().users}
            mh={match}
          />
        ))}
      </ChatList>
      <SidebarButton>
        {/* <IconButton> */}
        <AddCircleRoundedIcon
          style={{ fontSize: 58, color: "#25D366" }}
          onClick={createChat}
        />
        {/* </IconButton> */}
      </SidebarButton>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 2.5px solid whitesmoke;
  height: 100vh;
  min-width: 30rem;
  max-width: 40rem;
  overflow-y: hidden;
  position: relative;

  @media (max-width: 768px) {
    min-width: 100vw;
    max-width: 100vw;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 1.4rem;
  border-radius: 0.2rem;
  background-color: #f1f3f5;
`;

const SidebarButton = styled.button`
  position: absolute;
  bottom: 1.85rem;
  right: 3.5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  border: none;
  outline: none;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
  font-size: 1.5rem;
  padding: 1rem;
  border-radius: 1rem;
`;

const ChatList = styled.div`
  height: calc(100vh - 147.6px);
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  height: 7rem;
  border-bottom: 2.5px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)``;

const IconsContainer = styled.div``;

const yhidden = {
  overflowY: "hidden",
};

const yscroll = {
  overflowY: "scroll",
};
