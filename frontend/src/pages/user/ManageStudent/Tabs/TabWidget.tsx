import { Tabs } from "../../../../component/Tabs";
import ChatContent from "./ChatContent";
import { StudentContent } from "./StudentContent";

interface ITabWidgetProps {
    selectedTab: string;
    onTabSelect: (selectedTab: string) => void;
    tabs: string[];
    data: {
        studentId: string,
        studentName: string,
        level: string,
        grade: string
    }[],
    groupName: string;
    groupId: string;
    refetch: () => void
}

export default function TabWidget({
  selectedTab,
  onTabSelect,
  tabs,
  data,
  groupName,
  groupId,
  refetch
}: ITabWidgetProps) {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => {
        onTabSelect(value);
      }}
    >
      <Tabs.List className="overflow-hidden">
        {tabs.map((tab, i) => (
          <Tabs.Trigger key={i} value={tab} className="p-[1px]">
            {tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="mt-2" />

      {tabs.map((tab, i) => (
        <Tabs.Content key={i} value={tab} className="max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar border-solid">
          {tab === "Student" && (
            <div className="min-h-[150px] w-full"> {/* Ensures space for Edit button */}
                <StudentContent data={data} groupName={groupName} groupId={groupId} refetch={refetch} />
            </div>
          )}
          {tab === "Chat" && <ChatContent groupId={groupId} studentIds={data.map(item => item.studentId)} userId={localStorage.getItem("user") ?? "" } />}
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
