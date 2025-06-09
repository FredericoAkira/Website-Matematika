import { ChevronDown, ChevronRight, Trash2Icon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useGetTopicDetail from "../../../api/Topic/useGetTopicDetail";
import usePostCheckTopic from "../../../api/Topic/usePostCheckTopic";
import usePostEditTopic, { EditTopicRequest } from "../../../api/Topic/usePostEditTopic";
import { Button } from "../../../component/Button/button";
import { Dropzone } from "../../../component/Dropzone";
import { Input } from "../../../component/InputField/input";
import { Label } from "../../../component/Label";

interface ITopicForm {
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

type FileWithPreview = File & { preview?: string };

export const EditTopic: React.FC<ITopicForm> = () => {
  const form = useForm();
  const navigate = useNavigate();
  const editTopic = usePostEditTopic();
  const [sections, setSections] = useState<TopicSectionData[]>([{ id: 1, isOpen: true }]);
  const [contentData, setContentData] = useState<ContentData[]>([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const uploadFile = usePostCheckTopic();
  const { topicName } = useParams();
  const decodedTitle = decodeURIComponent(topicName || "");
  const { data: details } = useGetTopicDetail(decodedTitle);
  const [initialFilesMap, setInitialFilesMap] = useState<Record<number, FileWithPreview[]>>({});
  const [initialAudioMap, setInitialAudioMap] = useState<Record<number, FileWithPreview[]>>({});
  
  const hasInitialized = useRef(false);
  useEffect(() => {
    console.log("here")
    if (hasInitialized.current) return; // 🚫 Already loaded
    const remote = details?.data?.data?.topicContent;
    if (!remote?.length) return;

    hasInitialized.current = true;
  
    // 1️⃣ Map API data into your ContentData shape (with URLs, no Files yet)
    const mapped: ContentData[] = remote.map((item, idx) => ({
      id: idx + 1,
      explanation: item.explanation || "",
      text:        item.text || "",
      imageUrl:    item.image   || null,
      audioUrl:    item.audio   || null,
      video:       item.video   || "",
      imageFile:   null,
      audioFile:   null,
    }));
  
    // 2️⃣ Seed form & state
    form.setValue("topicName", decodedTitle);
    setContentData(mapped);
    setNextId(mapped.length + 1);
  
    // 3️⃣ Build all preload tasks in parallel
    const preloadTasks = mapped.map(async (c) => {
      const result: {
        id: number;
        imageFile?: FileWithPreview;
        audioFile?: FileWithPreview;
      } = { id: c.id };
  
      if (c.imageUrl) {
        const blob = await fetch(c.imageUrl).then(r => r.blob());
        const file = new File([blob], `img-${c.id}`, { type: blob.type });
        result.imageFile = Object.assign(file, { preview: c.imageUrl });
      }
      if (c.audioUrl) {
        const blob = await fetch(c.audioUrl).then(r => r.blob());
        const file = new File([blob], `aud-${c.id}`, { type: blob.type });
        result.audioFile = Object.assign(file, { preview: c.audioUrl });
      }
  
      return result;
    });
  
    // 4️⃣ Once _all_ are done, batch‐update state from the original `mapped` array
    Promise.all(preloadTasks).then((allResults) => {
      const imgMap: Record<number, FileWithPreview[]> = {};
      const audMap: Record<number, FileWithPreview[]> = {};
  
      const updatedContent: ContentData[] = mapped.map((c) => {
        const found = allResults.find((r) => r.id === c.id)!;
        if (found.imageFile) imgMap[c.id] = [found.imageFile];
        if (found.audioFile) audMap[c.id] = [found.audioFile];
        return {
          ...c,
          imageFile: found.imageFile ?? c.imageFile,
          audioFile: found.audioFile ?? c.audioFile,
        };
      });
  
      setInitialFilesMap(imgMap);
      setInitialAudioMap(audMap);
      setSections(mapped.map((_, idx) => ({ id: idx + 1, isOpen: true })));
      setContentData(updatedContent);
    });
  }, [details, decodedTitle, form]);

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

    const adjustedData: EditTopicRequest = {
      topicName: form.watch("topicName"),
      topicId: details?.data.data.topicId ?? null,
      topicContent: uploadedContent,
    };

    // console.log("data sent:", adjustedData)

    editTopic.mutate(adjustedData, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  return (
    <div className="w-full p-3">
      <div className="flex flex-col w-full mb-5">
        <div className="flex flex-row justify-between">
          <p>{`Edit ${decodedTitle}`}</p>
          <XIcon className="cursor-pointer" onClick={() => navigate(-1)} />
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
            value={form.watch("topicName")}
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
                    value={contentData[section.id-1]?.explanation}
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
                    value={contentData[section.id-1]?.text}
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
                      setInitialFilesMap((prev) => ({...prev, [section.id]: files as FileWithPreview[]}));
                    }}
                    initialFiles={initialFilesMap[section.id] || []}
                    deleteable
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
                      setInitialAudioMap((prev) => ({...prev, [section.id]: files as FileWithPreview[]}));
                    }}
                    initialFiles={initialAudioMap[section.id] || []}
                    deleteable
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
                    value={contentData[section.id-1]?.video}
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