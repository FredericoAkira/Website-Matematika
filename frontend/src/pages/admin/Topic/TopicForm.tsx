import { ChevronDown, ChevronRight, Trash2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import usePostAddTopic, { AddTopicRequest } from "../../../api/Topic/usePostAddTopic";
import usePostCheckTopic from "../../../api/Topic/usePostCheckTopic";
import { Button } from "../../../component/Button/button";
import { Dropzone } from "../../../component/Dropzone";
import { Input } from "../../../component/InputField/input";
import { Label } from "../../../component/Label";

interface ITopicForm {
  source: string;
  onClose?: () => void;
  refetch?: () => void;
}

interface TopicSectionData {
  id: number;
  isOpen: boolean;
}

interface ContentData {
  id: number;
  explanation?: string;
  text?: string;
  imageFile?: File | null;
  audioFile?: File | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  video?: string;
}

export const TopicForm: React.FC<ITopicForm> = ({ source, onClose, refetch }) => {
  const form = useForm();
  const userId = localStorage.getItem("user") ?? "";
  const addTopic = usePostAddTopic();
  const [sections, setSections] = useState<TopicSectionData[]>([{ id: 1, isOpen: true }]);
  const [contentData, setContentData] = useState<ContentData[]>([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const uploadFile = usePostCheckTopic();

  const handleAddSection = () => {
    setSections((prev) => [...prev, { id: nextId, isOpen: true }]);
    setContentData((prev) => [...prev, { id: nextId }]);
    setNextId((prev) => prev + 1);
  };

  const toggleSection = (id: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const handleDeleteSection = (id: number) => {
    if (sections.length === 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    setContentData((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    const uploadedContent = await Promise.all(
      contentData.map(async (c) => {
        let imageUrl = c.imageUrl;
        let audioUrl = c.audioUrl;

        if (c.imageFile) {
          imageUrl = await uploadFile.mutateAsync(c.imageFile);
        }
        if (c.audioFile) {
          audioUrl = await uploadFile.mutateAsync(c.audioFile);
        }

        return {
          explanation: c.explanation || "",
          text: c.text || "",
          image: imageUrl || "",
          audio: audioUrl || "",
          video: c.video || "",
        };
      })
    );

    const adjustedData: AddTopicRequest = {
      userId: userId,
      topic: {
        topicName: form.watch("topicName"),
        topicContent: uploadedContent,
      }
    };

    addTopic.mutate(adjustedData, {
      onSuccess: () => {
        refetch?.();
        onClose?.();
      },
    });
  };

  return (
    <div className="w-full p-3">
      <div className="flex flex-col w-full mb-5">
        <div className="flex flex-row justify-between">
          <p>{`${source} Topic`}</p>
          <XIcon className="cursor-pointer" onClick={onClose} />
        </div>
        <hr className="w-full my-2 border-gray-300" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <Label>Topic Name</Label>
          <Input
            id="topicName"
            className="border border-gray-300 bg-white"
            placeholder="Topic name"
            onChange={(e) => form.setValue("topicName", e.target.value)}
          />
        </div>

        {sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col w-full mt-3 p-3 border border-gray-300 rounded-md bg-white"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <p className="font-medium">{`Topic Content ${section.id}`}</p>
                <Trash2Icon
                  size={18}
                  className="cursor-pointer"
                  onClick={() => handleDeleteSection(section.id)}
                />
              </div>
              {section.isOpen ? (
                <ChevronDown className="cursor-pointer" onClick={() => toggleSection(section.id)} />
              ) : (
                <ChevronRight className="cursor-pointer" onClick={() => toggleSection(section.id)} />
              )}
            </div>
            <hr className="w-full my-2 border-gray-300" />
            {section.isOpen && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <Label>Explanation</Label>
                  <Input
                    className="border border-gray-300 bg-white"
                    placeholder="Explanation"
                    onChange={(e) =>
                      setContentData((prev) =>
                        prev.map((c) =>
                          c.id === section.id ? { ...c, explanation: e.target.value } : c
                        )
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Text Content</Label>
                  <Input
                    className="border border-gray-300 bg-white"
                    placeholder="Text Content"
                    onChange={(e) =>
                      setContentData((prev) =>
                        prev.map((c) => (c.id === section.id ? { ...c, text: e.target.value } : c))
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Image Content</Label>
                  <Dropzone
                    multiple={false}
                    onDrop={(files) => {
                      const file = files[0];
                      setContentData((prev) =>
                        prev.map((c) => (c.id === section.id ? { ...c, imageFile: file } : c))
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Audio Content</Label>
                  <Dropzone
                    multiple={false}
                    onDrop={(files) => {
                      const file = files[0];
                      setContentData((prev) =>
                        prev.map((c) => (c.id === section.id ? { ...c, audioFile: file } : c))
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Video Content (URL)</Label>
                  <Input
                    className="border border-gray-300 bg-white"
                    placeholder="YouTube or Video URL"
                    onChange={(e) =>
                      setContentData((prev) =>
                        prev.map((c) => (c.id === section.id ? { ...c, video: e.target.value } : c))
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-5">
          <Button onClick={handleAddSection}>Add More</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};