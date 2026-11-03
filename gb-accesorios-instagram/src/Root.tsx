import {Composition} from 'remotion';
import {GBInstagram} from './GBInstagram';
import timeline from './timeline.json';
import {loadFonts} from './fonts';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="GBInstagram"
    component={GBInstagram}
    durationInFrames={timeline.durationInFrames}
    fps={timeline.fps}
    width={1080}
    height={1920}
  />
);
