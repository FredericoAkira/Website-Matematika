import { TopicDetail } from "../../../api/Topic/useGetTopicDetail";
import { Tabs } from "../../../component/Tabs";
import { MaterialContent } from "./MaterialContent";

interface ITabWidgetProps {
  selectedTab: string;
  onTabSelect: (selectedTab: string) => void;
  tabs: string[];
  data?: TopicDetail;
}

export default function TabWidget({
  selectedTab,
  onTabSelect,
  tabs,
  data
}: ITabWidgetProps) {

  return (
      <Tabs
        value= {selectedTab}
        onValueChange={(value) => {
            onTabSelect(value);
        }}
      >
        <Tabs.List className="overflow-hidden">
          {tabs.map((tab, i) => (
            <Tabs.Trigger
              key={i}
              value={tab}
              className="p-[1px]"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="mt-2" />
        {tabs.map((tab, i) => (
          <Tabs.Content
            key={i}
            value={tab}
          >
            <MaterialContent material={data?.topicContent ?? []} />
          </Tabs.Content>
        ))}
      </Tabs>
  );
}
