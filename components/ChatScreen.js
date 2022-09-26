import styled from "styled-components";
import Message from "./Message";
import TimeAgo from "timeago-react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import "emoji-mart/css/emoji-mart.css";
import UIfx from "uifx";
// import moment from 'moment';
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/dist/client/router";
import { Avatar, IconButton } from "@material-ui/core";
import { useState, useRef } from "react";
import { Picker } from "emoji-mart";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import Router from "next/router";

function ChatScreen({ chat, messages }) {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = new window.SpeechRecognition();

  let emojiPicker;

  const inputElement = document.getElementById("inputField");

  // const [tempDate, setTempDate] = useState('');

  const [emojiPickerState, SetEmojiPicker] = useState(false);

  // const [temp, setTemp] = useState(false);

  // const [dual, setDual] = useState('');

  // const [nodeLength, setNodeLength] = useState();

  const [user] = useAuthState(auth);

  const [input, setInput] = useState("");

  const endOfMessagesRef = useRef(null);

  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  if (emojiPickerState) {
    emojiPicker = (
      <Picker
        title="Pick your emoji . . . "
        emoji="point_up"
        onSelect={(emoji) => setInput(input + emoji.native)}
      />
    );
  }

  function triggerPicker(event) {
    event.preventDefault();
    SetEmojiPicker(!emojiPickerState);
    if (emojiPickerState) {
      document.getElementById("inputField").focus();
    } else {
      document.getElementById("inputField").blur();
    }
  }

  // const groupMessageByDate = (messageDate) => {
  //   (messageDate) => setTempDate(messageDate);
  //   if (tempDate === messageDate) {
  //     // console.log(tempDate, messageDate);
  //     // console.log('true');
  //     return true;
  //   } else {
  //     // console.log('false');
  //     return false;
  //   }
  // };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <>
          {/* {groupMessageByDate(
            moment(message.data().timestamp?.toDate().getTime()).format('LL')
          ) ? (
            <DateIndictor>
              {moment(message.data().timestamp?.toDate().getTime()).format(
                'LL'
              )}
            </DateIndictor>
          ) : (
            ''
          )} */}

          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        </>
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    playMessageSentSound();
    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const surname = recipientEmail.split("@");

  // const finder = () => {
  //   if (messagesSnapshot) {
  //     messagesSnapshot.docs.map(
  //       (message) => () => setDual(message.data().user)
  //     );
  //   } else {
  //     JSON.parse(messages).map((message) => () => setDual(message.user));
  //   }
  // };

  // finder();

  // const TypeOfMessage = dual !== user.email ? 'Sender' : 'Reciever';

  const playMessageSentSound = () => {
    const sm = new UIfx("/send message.mp3");
    sm.play();
  };

  const openMenu = () => {
    // var x = e.clientX - e.target.offsetLeft + 10;
    // var y = e.clientY - e.target.offsetTop + 10;
    // // console.log(e.target);
    const menu = document.querySelector(".mc");
    // menu.style.bottom = `${y}px`;
    // menu.style.left = `${x}px`;
    const compStyles = getComputedStyle(menu);

    if (compStyles.display === "none") {
      menu.style.display = "flex";
      menu.style.justifyContent = "center";
      menu.style.alignItems = "center";
    } else {
      menu.style.display = "none";
    }
  };

  const deleteChat = async () => {
    db.collection("chats")
      .doc(`${chat.id}`)
      .delete()
      .then(() => {
        // console.log('Document successfully deleted!');
      })
      .catch((error) => {
        alert("Error removing chat: ", error);
      });

    router.push(`/`);
  };

  // () => {
  //   if (document.querySelectorAll('#msg').length > nodeLength) {
  //     const sm = new UIfx('/receive message.mp3');
  //     sm.play();
  //   }
  // };

  // const checkLength_and_CreateNewLine = (typeTerm) => {
  //   if (typeTerm.length > 75) {
  //     const inputElement = document.getElementById('inputField');
  //     inputElement.value = typeTerm + '\n';
  //     console.log(inputElement.value);
  //   }
  // };

  const startListening = () => {
    recognition.start();

    document.getElementById("stopper").style.display = "block";

    recognition.addEventListener("result", onSpeak);

    function onSpeak(e) {
      const msg = e.results[0][0].transcript;
      inputElement.value += msg;
    }

    recognition.addEventListener("onspeechend", () => recognition.end());
  };

  const stopListening = () => {
    recognition.stop();
    document.getElementById("stopper").style.display = "none";
  };

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
          {/* <Typing>
            {temp === true && TypeOfMessage !== 'Sender' ? 'Typing...' : ''}
          </Typing> */}
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton
            onClick={() => {
              Router.replace("/");
            }}
          >
            <HomeOutlinedIcon style={{ fontSize: 25 }} />
          </IconButton>
          <IconButton>
            <AttachFileIcon style={{ fontSize: 25 }} />
          </IconButton>
          <IconButton onClick={openMenu}>
            <MoreVertIcon style={{ fontSize: 25 }} />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconContainer>{emojiPicker}</IconContainer>
        <IconButton onClick={triggerPicker}>
          <InsertEmoticonIcon
            style={{ fontSize: 25 }}
            // onMouseLeave={triggerPicker1}
          />
        </IconButton>
        <Input
          // maxLength="75"
          id="inputField"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // onKeyDown={() => setTemp(true)}
          // onKeyUp={() => setTimeout(() => setTemp(false), 3100)}
          // onKeyDown={(e) => checkLength_and_CreateNewLine(e.target.value)}
          placeholder="Type a message..."
          autoFocus
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        {input == "" ? (
          <>
            <IconButton onClick={startListening}>
              <MicIcon style={{ fontSize: 25 }} />{" "}
            </IconButton>
            <IconButton
              onClick={stopListening}
              style={{ display: "none" }}
              id="stopper"
            >
              <StopRoundedIcon style={{ fontSize: 25 }} />{" "}
            </IconButton>
          </>
        ) : (
          <IconButton onClick={sendMessage}>
            <SendRoundedIcon style={{ fontSize: 25 }} />
          </IconButton>
        )}
      </InputContainer>
      <MenuContainer className="mc" onClick={deleteChat}>
        <p>Delete Chat</p>
      </MenuContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const DateIndictor = styled.div`
  background-color: lightblue;
  width: 8rem;
  height: 2rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;

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
  margin-bottom: 6.5rem;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 3rem;
  background-color: #e5ded8;
  min-height: 90vh;
  position: relative;
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
  padding: 1.3rem 3rem 1.3rem 1.3rem;
  font-size: 1.55rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  background-color: whitesmoke;
  inline-size: min-content;
`;

const Typing = styled.div`
  color: #25d366;
  font-weight: bold;
  font-size: 1.3rem;
  /* margin: 0.2rem 0; */
`;

const IconContainer = styled.div`
  position: absolute;
  top: -45rem;
  left: 2rem;
  right: 0;
`;

const MenuContainer = styled.div`
  height: 3rem;
  width: 11rem;
  cursor: pointer;
  background-color: #fff;
  padding: 1rem;
  font-size: 1.45rem;
  z-index: 1000;
  box-shadow: 0px 4px 10px -3px rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 5.5rem;
  right: 4.5rem;
  border-radius: 0.7rem;
  display: none;
`;
