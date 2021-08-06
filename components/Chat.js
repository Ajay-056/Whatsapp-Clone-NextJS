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

  // const openMenu = (e) => {
  //   var x = e.clientX - e.target.offsetLeft + 10;
  //   var y = e.clientY - e.target.offsetTop + 10;
  //   // console.log(e.target);
  //   const menu = document.querySelector('.mc');
  //   menu.style.bottom = `${y}px`;
  //   menu.style.left = `${x}px`;
  //   if (menu.style.display === 'none') {
  //     menu.style.display = 'flex';
  //   } else {
  //     menu.style.display = 'none';
  //   }
  // };

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
        {/* onClick={(e) => openMenu(e)} */}
      </ArrowContainer>

      <MenuContainer className="mc">
        <p>Delete</p>
      </MenuContainer>
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

const MenuContainer = styled.div`
  height: 3rem;
  width: 8rem;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0px 4px 10px -3px rgba(0, 0, 0, 0.7);
  position: absolute;
  bottom: -2.5rem;
  right: 1.7rem;
  border-radius: 0.7rem;
  z-index: 1000;
  display: none;
  justify-content: center;
  align-items: center;
`;
