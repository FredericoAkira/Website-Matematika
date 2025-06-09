import { InboxIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/button";

interface Material {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CarouselProps {
  materials: Material[];
}

const RecommendedCarousel: React.FC<CarouselProps> = ({ materials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % materials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [materials.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const currentMaterial = materials[currentIndex];

  return (
    <>
      {materials.length > 0 ? (
        <>
          <div
            className="relative w-full h-64 bg-cover bg-center rounded-lg shadow-md flex flex-col justify-between transition-all duration-500 ease-in-out"
            style={{
                backgroundImage: `url(${currentMaterial?.imageUrl})`,
            }}
          >
              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center text-white">
                  <div className="bg-black/70 rounded-lg p-4 md:p-6 max-w-xl w-full">
                      <h2 className="text-2xl font-bold mb-2">{currentMaterial?.title}</h2>
                      <p className="text-sm md:text-base">{currentMaterial?.description}</p>
                      <Button onClick={() => navigate(`../learn/${currentMaterial.description}`)}>Pelajari</Button>
                  </div>
              </div>
          </div>
          {/* Navigation */}
          <div className="relative z-10 w-full flex items-center px-4 py-2">
              <div className="flex-1 mx-4 flex gap-2 justify-center">
              {materials?.map((_, index) => (
                  <div
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-y-[200%]  ${
                      currentIndex === index ? "bg-[#0291E5]" : "bg-gray-400"
                  }`}
                  style={{
                      width: `calc((100% - ${(materials.length - 1) * 0.5}rem) / ${materials.length})`,
                  }}
                  />
              ))}
              </div>
          </div>
        </>
      ) : (
        <div
          className={
            "flex flex-col items-center justify-center gap-1 text-md text-neutral-tertiary py-4 transition mt-5"
          }
        >
          <InboxIcon />
          <p>Kami masih mengembangkan materi lainnya.</p>
        </div>
      )}
    </>
  );
};

export default RecommendedCarousel;
