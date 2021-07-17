import { Button } from '@material-ui/core';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import { auth, provider } from '../firebase';
import googleIcon from '../public/icons8-google.svg';

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
        <Button onClick={signIn} variant="outlined">
          <Image src={googleIcon} alt="Google Icon" width={25} height={25} />
          <ButtonText>SignIn with Google</ButtonText>
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10rem;
  align-items: center;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const ButtonText = styled.span`
  margin-left: 1rem;
  font-size: 1.2rem;
  font-family: 'Inter', sans-serif;
`;

const Logo = styled.img`
  height: 20rem;
  width: 20rem;
  margin-bottom: 5rem;
`;
