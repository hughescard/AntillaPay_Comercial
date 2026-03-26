interface RelativeTimeLabels {
  hourLabel: string;
  hoursLabel: string;
  minuteLabel: string;
  minutesLabel: string;
  yesterdayLabel: string;
}

export const formatRelativeTime = (
  dateInput: Date | string | number,
  labels: RelativeTimeLabels
): string => {
  const targetDate = new Date(dateInput);
  const now = new Date();

  const diffMs = Math.max(0, now.getTime() - targetDate.getTime());

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffDays = Math.round((today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    const hLabel = hours === 1 ? labels.hourLabel : labels.hoursLabel;
    const mLabel = mins === 1 ? labels.minuteLabel : labels.minutesLabel;

    if (hours === 0) {
      return `${mins} ${mLabel}`;
    } else if (mins === 0) {
      return `${hours} ${hLabel}`;
    } else {
      return `${hours} ${hLabel} ${mins} ${mLabel}`;
    }
  }

  if (diffDays === 1) {
    return labels.yesterdayLabel;
  }

  

  const formattedDate = targetDate.toLocaleDateString();
  const formattedTime = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return `${formattedDate} ${formattedTime}`;
};