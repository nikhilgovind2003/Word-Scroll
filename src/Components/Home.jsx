import { useEffect, useState } from "react";
import debounce from "lodash.debounce"; // Import debounce from lodash

const Home = () => {
  const text =
    "That's the average time you'll spend on your phone today — often without realizing. It's time to fight back.";
  const words = text.split(" "); // Split the text into individual words

  const [revealIndex, setRevealIndex] = useState(0); // Tracks the number of revealed words
  const [translateY, setTranslateY] = useState(0); // Tracks the upward translation of the text container

  const SCROLL_SPEED = 100; // Adjust this value for container movement speed
  const WORD_REVEAL_SPEED = 1; // Controls how many words are revealed/faded per scroll event

  useEffect(() => {
    const handleScroll = debounce((event) => {
      if (event.deltaY > 0) {
        // Scrolling down
        if (revealIndex < words.length) {
          // Reveal words first
          setRevealIndex((prev) => Math.min(prev + WORD_REVEAL_SPEED, words.length));
        } else {
          // Move the container up after all words are revealed
          setTranslateY((prevY) => prevY - SCROLL_SPEED);
        }
      } else {
        // Scrolling up
        if (translateY < 0) {
          // Move the container back down
          setTranslateY((prevY) => Math.min(prevY + SCROLL_SPEED, 0));
        } else {
          // Fade out words after container is back at the original position
          setRevealIndex((prev) => Math.max(prev - WORD_REVEAL_SPEED, 0));
        }
      }
    }, 50); // Debounce for smooth performance

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [revealIndex, translateY, words.length]);

  return (
    <div className="h-[400vh] bg-black">
      {/* Text Container */}
      <div
        className="fixed text-center text-gray-500 top-1/2 left-1/2 transform -translate-x-1/2"
        style={{
          transform: `translate(-50%, calc(-50% + ${translateY}px))`,
          transition: "transform 0.2s ease-out", // Smooth transition for container movement
        }}
      >
        <div className="lg:text-6xl md:text-3xl font-normal flex flex-wrap justify-center leading-snug">
          <span className="text-white block mb-6">5 to 6 hours.</span>
          {words.map((word, index) => (
            <span
              key={index}
              className={`mx-2 transition-opacity duration-500 ease-in-out ${
                index < revealIndex ? "opacity-100 text-white" : "opacity-25"
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
