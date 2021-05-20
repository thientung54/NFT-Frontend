import React from 'react';
import { hot } from 'react-hot-loader/root';

interface Props {
  src: string;
}

export const Video: React.FC<Props> = props => {
  return (
    <div className="m-video">
      <video controls autoPlay muted src={props.src}></video>
    </div>
  );
};

export default hot(Video);
