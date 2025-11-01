/**
 * List of caffeine schedule items with tips
 */

import { CaffeineSchedule } from "@/types/caffeine.types";
import { CaffeineScheduleItem } from "./CaffeineScheduleItem";
import { CaffeineTipsCard } from "./CaffeineTipsCard";

interface CaffeineScheduleListProps {
  schedule: CaffeineSchedule[];
  openNotifications: { [key: number]: boolean };
  onToggleNotification: (index: number, open: boolean) => void;
}

export const CaffeineScheduleList = ({
  schedule,
  openNotifications,
  onToggleNotification,
}: CaffeineScheduleListProps) => {
  if (schedule.length === 0) return null;

  return (
    <div className="space-y-3">
      {schedule.map((item, index) => (
        <CaffeineScheduleItem
          key={index}
          item={item}
          index={index}
          isOpen={openNotifications[index] || false}
          onToggle={(open) => onToggleNotification(index, open)}
        />
      ))}
      <CaffeineTipsCard />
    </div>
  );
};
