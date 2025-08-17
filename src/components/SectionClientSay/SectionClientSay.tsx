import Glide from "@glidejs/glide";
import Heading from "components/Heading/Heading";
import React, { FC, useId, useState, useEffect } from "react";
import clientSayMain from "images/clientSayMain.png";
import clientSay1 from "images/clientSay1.png";
import clientSay2 from "images/clientSay2.png";
import clientSay3 from "images/clientSay3.png";
import clientSay4 from "images/clientSay4.png";
import clientSay5 from "images/clientSay5.png";
import clientSay6 from "images/clientSay6.png";
import quotationImg from "images/quotation.png";
import quotationImg2 from "images/quotation2.png";
import { StarIcon } from "@heroicons/react/24/solid";

export interface SectionClientSayProps {
  className?: string;
}

const SectionClientSay: FC<SectionClientSayProps> = ({ className = "" }) => {
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  // State for managing comments and loading/error states
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let slider: Glide;

    const initializeGlide = () => {
      // @ts-ignore
      const OPTIONS: Glide.Options = {
        perView: 1,
        type: "carousel",
        gap: 0,
        rewind: true,
      };

      slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
      slider.mount();
    };

    // Delay initialization to ensure the DOM is fully rendered
    const timeout = setTimeout(() => {
      initializeGlide();
    }, 50);

    return () => {
      clearTimeout(timeout);
      if (slider) {
        slider.destroy(); // Properly destroy the Glide.js instance
      }
    };
  }, [UNIQUE_CLASS]);

  const serverUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/configuration/getAllComments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();

        // Extract comments from the API response
        const formattedComments = data.comments.map((comment: any) => ({
          id: comment.comment_id,
          clientName: comment.clientName || "Anonymous",
          content: comment.content,
          clientImg: comment.clientImg || clientSayMain, // Default image if none provided
        }));

        setComments(formattedComments);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const renderBg = () => {
    return (
        <div className="hidden md:block">
          <img className="absolute top-9 -left-20" src={clientSay1} alt="" />
          <img
              className="absolute bottom-[100px] right-full mr-40"
              src={clientSay2}
              alt=""
          />
          <img
              className="absolute top-full left-[140px]"
              src={clientSay3}
              alt=""
          />
          <img
              className="absolute -bottom-10 right-[140px]"
              src={clientSay4}
              alt=""
          />
          <img
              className="absolute left-full ml-32 bottom-[80px]"
              src={clientSay5}
              alt=""
          />
          <img className="absolute -right-10 top-10 " src={clientSay6} alt="" />
        </div>
    );
  };

  return (
      <div
          className={`nc-SectionClientSay relative flow-root ${className}`}
          data-nc-id="SectionClientSay"
      >
        <Heading desc="Let's see what people think of Petal Pink" isCenter>
          Good news from far away 🥇
        </Heading>
        <div className="relative md:mb-16 max-w-2xl mx-auto">
          <div className={`mt-12 lg:mt-16 relative ${UNIQUE_CLASS}`}>
            <img
                className="opacity-50 md:opacity-100 absolute -mr-16 lg:mr-3 right-full top-1"
                src={quotationImg}
                alt=""
            />
            <img
                className="opacity-50 md:opacity-100 absolute -ml-16 lg:ml-3 left-full top-1"
                src={quotationImg2}
                alt=""
            />
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {loading && (
                    <li className="glide__slide text-center">Loading...</li>
                )}
                {error && (
                    <li className="glide__slide text-center">{error}</li>
                )}
                {comments.length > 0 &&
                    comments.map((item) => (
                        <li key={item.id} className="glide__slide text-center">
                          <img
                              src={item.clientImg}
                              alt={item.clientName}
                              className="w-24 h-24 rounded-full mx-auto mb-4"
                          />
                          <span className="block text-2xl">{item.content}</span>
                          <span className="block mt-4 text-2xl font-semibold">
                      {item.clientName}
                    </span>
                          <div className="flex justify-center space-x-1 mt-3 text-yellow-500">
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <StarIcon key={i} className="w-6 h-6" />
                                ))}
                          </div>
                        </li>
                    ))}
              </ul>
            </div>

            {/* Navigation Arrows */}
            <div
                className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between"
                data-glide-el="controls"
            >
              <button
                  className="glide__arrow glide__arrow--left bg-white rounded-full shadow-lg p-2 focus:outline-none"
                  data-glide-dir="<"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                  className="glide__arrow glide__arrow--right bg-white rounded-full shadow-lg p-2 focus:outline-none"
                  data-glide-dir=">"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Pagination Bullets */}
            <div
                className="mt-10 glide__bullets flex items-center justify-center"
                data-glide-el="controls[nav]"
            >
              {comments.map((item, index) => (
                  <button
                      key={item.id}
                      className="glide__bullet w-2 h-2 rounded-full bg-neutral-300 mx-1 focus:outline-none"
                      data-glide-dir={`=${index}`}
                  ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SectionClientSay;