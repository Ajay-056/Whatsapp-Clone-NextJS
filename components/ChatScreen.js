import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/dist/client/router';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import { InsertEmoticonIcon } from '@material-ui/icons/InsertEmoticon';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
  };

  return (
    <Container>
      <Header>
        <Avatar />

        <HeaderInfo>
          <h3>Recipient Email</h3>
          <p>Last Seen...</p>
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: #fff;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 1.1rem;
  height: 8rem;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 1.5rem;
  flex: 1;

  > h3 {
    margin-bottom: 0.3rem;
  }

  > p {
    font-size: 1.4rem;
    color: gray;
  }
`;

const EndOfMessage = styled.div``;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  border-radius: 1rem;
  align-items: center;
  padding: 2rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  background-color: whitesmoke;
`;
