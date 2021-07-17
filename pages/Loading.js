import Image from 'next/image';
import { Circle } from 'better-react-spinkit';
import profilePic from '../public/580b57fcd9996e24bc43c543.png';

function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div>
        <Image
          src={profilePic}
          alt="whatsapp"
          style={{ marginBottom: 10 }}
          height={200}
          width={200}
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
