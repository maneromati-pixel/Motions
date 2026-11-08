import { Composition } from "remotion";
import { BestFriends } from "./BestFriends";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BestFriends"
        component={BestFriends}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
