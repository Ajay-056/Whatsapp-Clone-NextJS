import styled from 'styled-components';
import Message from './Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { useRouter } from 'next/dist/client/router';
import { Avatar, IconButton } from '@material-ui/core';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase';
import { useState, useRef } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
  const [temp, setTemp] = useState(false);

  const [dual, setDual] = useState('');

  const [user] = useAuthState(auth);

  const [input, setInput] = useState('');

  const endOfMessagesRef = useRef(null);

  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
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
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput('');
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const surname = recipientEmail.split('@');

  const finder = () => {
    if (messagesSnapshot) {
      messagesSnapshot.docs.map(
        (message) => () => setDual(message.data().user)
      );
    } else {
      JSON.parse(messages).map((message) => () => setDual(message.user));
    }
  };

  finder();

  const TypeOfMessage = dual === user.email ? 'Sender' : 'Reciever';

  console.log(TypeOfMessage);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h3>{surname[0]}</h3>
          <Typing>
            {temp === true && TypeOfMessage !== 'Sender' ? 'Typing...' : ''}
          </Typing>
          {recipientSnapshot ? (
            <p>
              Last Active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon style={{ fontSize: 25 }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ fontSize: 25 }} />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon style={{ fontSize: 25 }} />
        </IconButton>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={() => setTemp(true)}
          onKeyUp={() => setTimeout(() => setTemp(false), 3100)}
          placeholder="Type a message..."
          autoFocus
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <IconButton>
          <MicIcon style={{ fontSize: 25 }} />
        </IconButton>
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
  height: 7rem;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 1.5rem;
  flex: 1;

  > h3 {
    margin-bottom: 0.3rem;
    color: #495057;
    font-size: 1.35rem;
  }

  > p {
    font-size: 1.2rem;
    color: gray;
  }
`;

const EndOfMessage = styled.div`
  margin-bottom: 5rem;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 3rem;
  background-color: #e5ded8;
  min-height: 90vh;
`;

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
  outline: none;
  border-radius: 3rem;
  align-items: center;
  padding: 1.3rem;
  font-size: 1.55rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  background-color: whitesmoke;
`;

const Typing = styled.div`
  color: #25d366;
  font-weight: bold;
  font-size: 1.3rem;
  /* margin: 0.2rem 0; */
`;
