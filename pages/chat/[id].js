import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useRef } from "react";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
      <Head>
        <title>
          Chat{" "}
          {getRecipientEmail(chat.users, user) !== undefined
            ? "With " + getRecipientEmail(chat.users, user)
            : ""}
        </title>
      </Head>
      <div className="mdHidden">
        <Sidebar />
      </div>
      <ChatContainer onLoad={scrollToBottom}>
        <ChatScreen chat={chat} messages={messages} />
        <EndOfMessage ref={endOfMessagesRef} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const messagesRef = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
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

  const chatRef = await ref.get();

  const chat = {
    id: chatRef.id,
    ...chatRef.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;

  ::-webkit-srollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const EndOfMessage = styled.div``;
