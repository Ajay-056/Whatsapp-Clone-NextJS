import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useRouter } from 'next/dist/client/router';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

function Chat({ id, users, mh }) {
  const router = useRouter();

  const falseArray = [];

  const keys = Object.keys(mh);

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

  keys.forEach((key) => {
    if (mh[key] === false) {
      falseArray.push(key);
    }
  });

  return (
    <Container
      onClick={enterChat}
      style={falseArray.includes(recipientEmail) ? hide : show}
    >
      {recipientData ? (
        <UserAvatar src={recipientData?.photoURL} />
      ) : (
        <UserAvatar src={recipientEmail[0]} />
      )}
      <p>{recipientEmail}</p>
      <ArrowContainer className="ac">
        <KeyboardArrowDownRoundedIcon
          style={{
            fontSize: 25,
            opacity: '0.6',
          }}
        />
      </ArrowContainer>
    </Container>
  );
}

export default Chat;

const hide = {
  display: 'none',
};
const show = {
  display: 'flex',
};
const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5rem;
  word-break: break-word;
  font-size: 1.35rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  position: relative;

  :hover {
    background-color: #e9eaeb;

    & > .ac {
      display: flex;
    }
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 0.5rem;
  margin-right: 1.5rem;
`;

const ArrowContainer = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.8rem;
  display: none;
  height: 2.3rem;
  width: 2.3rem;
  background-color: #fff;
  border-radius: 50%;
  display: none;
  justify-content: center;
  align-items: center;
`;
