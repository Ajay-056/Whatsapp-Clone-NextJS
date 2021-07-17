import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useRouter } from 'next/dist/client/router';

function Chat({ id, users }) {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const recipientEmail = getRecipientEmail(users, user);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const userChatRef = db
    .collection('users')
    .where('email', '==', getRecipientEmail(users, user));

  const [recipientSnapshot] = useCollection(userChatRef);

  const recipientData = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container onClick={enterChat}>
      {recipientData ? (
        <UserAvatar src={recipientData?.photoURL} />
      ) : (
        <UserAvatar src={recipientEmail[0]} />
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5rem;
  word-break: break-word;
  font-size: 1.35rem;
  color: #495057;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 0.5rem;
  margin-right: 1.5rem;
`;
