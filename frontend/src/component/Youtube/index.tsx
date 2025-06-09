/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

interface Props {
  youtubeUrl: string;
}

const YouTubeEmbed: React.FC<Props> = ({ youtubeUrl }) => {
  const getEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);

      if (parsed.hostname === "youtu.be") {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(youtubeUrl);

  if (!embedUrl) return <p>Invalid YouTube URL</p>;

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={embedUrl}
        title="YouTube video"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
