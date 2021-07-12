import Head from 'next/head';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar';
import { db } from '../../firebase';

function Chat() {
  return (
    <Container>
      <Head>
        <title>Chat</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id);

  const messagesRef = await ref
    .collection('messages')
    .order('timestamp', 'asc')
    .get();

  const messages = messagesRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-srollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
