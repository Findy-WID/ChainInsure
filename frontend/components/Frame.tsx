import { FrameMetadata } from "@coinbase/onchainkit/frame";

export default function FramePage() {
  return (
    <FrameMetadata
      buttons={[
        {
          label: "Tell me the story",
        },
        {
          action: "link",
          label: "Link to Google",
          target: "https://www.google.com",
        },
        {
          action: "post_redirect",
          label: "Redirect to cute pictures",
        },
      ]}
      image={{
        src: "https://zizzamia.xyz/park-3.png",
        aspectRatio: "1:1",
      }}
      input={{
        text: "Tell me a boat story",
      }}
      state={{
        counter: 1,
      }}
      postUrl="https://zizzamia.xyz/api/frame"
    />
  );
}
