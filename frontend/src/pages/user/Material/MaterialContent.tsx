import 'katex/dist/katex.min.css';
import React, { useState } from "react";
import Latex from 'react-latex-next';
import { Button } from "../../../component/Button/button";
import YouTubeEmbed from '../../../component/Youtube';

interface IMatContent {
    material: {
        explanation: string,
        audio: string,
        image: string,
        text: string,
        video: string
    }[]
    compact?: boolean;
}

export const MaterialContent: React.FC<IMatContent> = ({
    material,
    compact
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < material.length - 1) {
        setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        }
    };

    const item = material[currentIndex];
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return(
        <div className="flex flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)]">
            <div className={`${compact ? "w-[30dvw]" : "md:w-full w-[65dvw]"}`}>
                <div className="flex flex-col">
                    {item?.text && (
                        <div className={`flex flex-row ${compact?"w-[49dvw]":"w-full"} items-center justify-center border border-gray-400/50 rounded-lg p-3 bg-white shadow-[0px_2px_4px_-2px_rgba(16,24,40,0.06),0px_4px_8px_-2px_rgba(16,24,40,0.10)]`}>
                            <div className="w-full overflow-x-auto my-5">
                                <div className="inline-block min-w-full text-center text-lg md:text-2xl px-2">
                                    <Latex>{`$${item?.text.replace(/ /g, '\\ ')}$`}</Latex>
                                </div>
                            </div>
                        </div>
                    )}
                    <p className="text-sm mt-2 ml-0.5"> {item?.explanation?.split("~")[0]?.split(";")
                                .map((line, index) => (
                                <span key={index}>
                                    {line.trim()}
                                    <br />
                                </span>
                            )
                        )}
                    </p>
                    
                    {item?.image && (
                        <div className={`flex flex-col  w-full  ${compact ? "md:max-w-[30dvw] md:max-h-[50dvh]" : "md:max-h-[80dvh] md:max-w-[70dvw]" }items-center justify-center mt-4 relative`}>
                            {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm text-gray-500">Loading image...</span>
                                {/* Bisa diganti dengan spinner kalau ada */}
                            </div>
                            )}

                            {imageError ? (
                            <div className="text-red-500 text-sm mt-2">Gambar gagal dimuat.</div>
                            ) : (
                            <img
                                src={item.image}
                                alt="Ilustrasi"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                                className={`max-w-[30dvw] max-h-[60dvh] object-contain mb-5 ${
                                !imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
                                }`}
                            />
                            )}

                            {!imageError && imageLoaded && (
                            <p className="text-sm mt-2 ml-0.5 w-full">
                                {item?.explanation
                                .split("~")[1]
                                ?.split(";")
                                .map((line, index) => (
                                    <span key={index}>
                                    {line.trim()}
                                    <br />
                                    </span>
                                ))}
                            </p>
                            )}
                        </div>
                        )}


                    {item?.video && (
                        <div className='w-[30dvw]'>
                            <YouTubeEmbed youtubeUrl={item?.video} />
                        </div>
                    )}
                </div>

                {material.length > 1 && (
                    <div className="flex justify-between mt-5">
                        <Button variant={"outline"} onClick={handleBack} disabled={currentIndex === 0}>Back</Button>
                        <Button onClick={handleNext} disabled={currentIndex === material.length - 1}>Next</Button>
                    </div>
                )}
            </div>

        </div>
    )
}