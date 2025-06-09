/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import useGetLOV from "../../../api/useGetLOV";

interface AddAttendeesProps {
  dataAttendee: {
    id: number | string | null;
    name: string;
  }[];
  setDataAttendee: React.Dispatch<
    React.SetStateAction<
      {
        id: number | string | null;
        name: string;
      }[]
    >
  >;
  handleRemoveAttendee: (e: React.MouseEvent, index: number) => void;
  title?: string;
  text: string;
  type: string;
  optionalOption?: {
    id: string;
    name: string;
  }[];
  user?: boolean;
  availStudent?: string[]
}

type Attendee = {
  id: string;
  name: string;
  // other fields if needed
};

const AddMore: React.FC<AddAttendeesProps> = ({
  dataAttendee,
  setDataAttendee,
  handleRemoveAttendee,
  title,
  text,
  type,
  optionalOption,
  user,
  availStudent
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAttendee, setNewAttendee] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const optionTopic = useGetLOV();
  const optionQuiz = useGetLOV();
  const optionStudent = useGetLOV();

  useEffect(() => {
    optionTopic.mutate({
      type: "topiclov",
      search: newAttendee
    })
  }, [newAttendee]);

  useEffect(() => {
    optionQuiz.mutate({
      type: "quizlov",
      search: newAttendee
    })
  }, [newAttendee]);

  useEffect(() => {
    optionStudent.mutate({
      type: "studentlov",
      search: newAttendee
    })
  }, [newAttendee]);

  const handleAddClick = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  let option: Attendee[] = optionalOption ? optionalOption : [];
  switch (type) {
    case "topic":
      option = optionTopic.data?.data.data.map(item => (
        {
          id: item.id,
          name: item.name ?? ""
        }
      )) ?? [];
      break;
    case "quiz":
      option = optionQuiz.data?.data.data.map(item => (
        {
          id: item.id,
          name: item.name ?? ""
        }
      )) ?? [];
      break;
    case "student":
        option = optionStudent.data?.data.data.filter(item => !availStudent?.includes(item.name)).map(item => (
          {
            id: item.id,
            name: item.name ?? ""
          }
        )) ?? [];
        break;
    default:
      option = optionalOption ? optionalOption : [];
  }

  return (
    <div>
      {title && (
        <p className={`${user ? "text-xs" : ""}`}>
          {title}<span className="text-red-700">*</span>
        </p>
      )}
      <div
        className={`relative flex flex-row gap-4 p-2 border ${
          isAdding ? "rounded-t-md" : "rounded-md"
        } font-helvetica-14px bg-white border border-gray-300`}
      >
        {dataAttendee.map((attendee, index) => (
          <span
            key={index}
            className="inline-flex items-center bg-gray-200 text-gray-700 rounded-full px-3 max-w-max"
          >
            <span className="mr-2">{attendee.name}</span>
            <button
              onClick={(e) => handleRemoveAttendee(e, index)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}

        {isAdding && (
          <div className="w-full">
            <div className="w-64 relative">
              <input
                ref={inputRef}
                type="text"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyDown={(e) => {
                  const inputValue = (
                    e.target as HTMLInputElement
                  ).value.trim();
                  if (e.key === "Enter" && inputValue !== "") {
                    const foundAttendee = option.filter(item => !dataAttendee.includes(item)).find(
                      (attendee) =>
                        attendee.name === inputValue
                    );
                    if (foundAttendee) {
                      // If a match is found, set the data
                      setDataAttendee((prev) => [
                        ...prev,
                        {
                          id: foundAttendee.id,
                          name: foundAttendee.name,
                        },
                      ]);
                    }
                    setNewAttendee(""); // Clear input field
                    setIsAdding(false); // Exit adding mode
                  }
                }}
                className="relative border rounded-full px-3 py-1 focus:outline-none w-64 pr-10" // pr-10 for the space for "X" button
              />
              <button
                onClick={() => {
                  setNewAttendee(""); // Clear the input field
                  setIsAdding(false); // Cancel adding
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                ×
              </button>
            </div>

            {newAttendee && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md z-10">
                {/* {isLoading ? (
                  <li>
                    <div className="flex-col align-middle justify-center items-center mt-2">
                      <div className="inline-block w-5 h-5 ml-3 animate-spin align-[-0.125em] items-center text-center rounded-full border-[5px] border-solid border-current border-r-transparent justify- text-gray-500 text-sm motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    </div>
                  </li>
                ) : */}
                {option.filter(item => !dataAttendee.some(att => att.name === item.name)).length > 0 ? (
                  option.filter(item => !dataAttendee.some(att => att.name === item.name)).map((attendee, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setDataAttendee((prev) => [
                          ...prev,
                          {
                            id: attendee.id,
                            name: attendee.name,
                          },
                        ]); // Add selected attendee
                        setNewAttendee(""); // Clear input field after selection
                        setIsAdding(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {attendee.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">Username tidak ditemukan atau sudah ada pada daftar.</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
      {!isAdding && (
        <button
          onClick={handleAddClick}
          className="font-normal text-red-700 text-sm"
        >
          + {text}
        </button>
      )}
    </div>
  );
};

export default AddMore;
