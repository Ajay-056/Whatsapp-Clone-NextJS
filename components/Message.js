import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  // console.log(moment(message.timestamp).format('LL'));

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  const msgt = user === userLoggedIn.email ? 'sender' : 'receiver';

  const isURL = (str) => {
    // var pattern = new RegExp(
    //   '^(https?:\\/\\/)?' + // protocol
    //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    //     '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    //     '(\\#[-a-z\\d_]*)?$',
    //   'i'
    // ); // fragment locator
    // return !!pattern.test(str);

    const regexp =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Container data-msgType={msgt} id="msg">
      <TypeOfMessage>
        {isURL(message.message) ? (
          <a
            rel="noreferrer"
            target="_blank"
            style={{ color: '#006aff', cursor: 'pointer' }}
            href={
              message.message.indexOf('https://') !== -1 ||
              message.message.indexOf('http://') !== -1
                ? message.message
                : 'https://' + message.message
            }
          >
            {message.message}
          </a>
        ) : (
          message.message
        )}
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
