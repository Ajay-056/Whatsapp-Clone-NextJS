import { Avatar, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from './Chat';
import { useRouter } from 'next/dist/client/router';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useState } from 'react';

function Sidebar() {
  const [user] = useAuthState(auth);

  const [match, setMatch] = useState('');

  const router = useRouter();

  const chatSearchObj = {};

  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const userEmailInput = prompt('Enter the gmail of the user to chat with: ');

    if (!userEmailInput) return null;

    if (
      EmailValidator.validate(userEmailInput) &&
      !chatAlreadyExsists(userEmailInput) &&
      userEmailInput !== user.email
    ) {
      db.collection('chats').add({
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

        <IconsContainer>
          <IconButton>
            <HomeOutlinedIcon style={{ fontSize: 25 }} onClick={goToHome} />
          </IconButton>
          {/* <IconButton>
            <MoreVertIcon style={{ fontSize: 22 }} />
          </IconButton> */}
          <IconButton>
            <ExitToAppIcon
              style={{ fontSize: 25 }}
              onClick={() => auth.signOut()}
            />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon style={{ fontSize: 22, marginRight: '1rem' }} />
        <SearchInput
          placeholder="Search for chats..."
          onInput={(e) => searchChats(e.target.value)}
        />
        {/* or Add Chat (s) by Gmail */}
      </Search>

      <SidebarButton>
        {/* <IconButton> */}
        <AddCircleRoundedIcon
          style={{ fontSize: 58, color: '#25D366' }}
          onClick={createChat}
        />
        {/* </IconButton> */}
      </SidebarButton>

      {/* List of Chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} mh={match} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 30rem;
  max-width: 35rem;
  overflow-y: scroll;
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  border-radius: 0.2rem;
`;

const SidebarButton = styled.button`
  position: absolute;
  bottom: 1.85rem;
  right: 2rem;
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
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
