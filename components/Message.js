import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';
import UIfx from 'uifx';

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  // console.log(moment(message.timestamp).format('LL'));

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  const msgt = user === userLoggedIn.email ? 'sender' : 'receiver';

  return (
    <Container data-msgType={msgt} id="msg">
      <TypeOfMessage>
        {message.message}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.div`
  width: fit-content;
  max-width: 70ch;
  line-height: 1.5;
  padding: 1.5rem;
  border-radius: 0.8rem;
  margin: 1rem;
  min-width: 6rem;
  padding-bottom: 2.6rem;
  position: relative;
  text-align: right;
  font-size: 1.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  text-align: left;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 1rem;
  font-size: 0.9rem;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;
