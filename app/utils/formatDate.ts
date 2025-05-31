import dayjs from "dayjs";

export function formatDate(date: Date) {
  const now = dayjs();
  const noteDate = dayjs(date);

  if (noteDate.isSame(now, "day")) {
    return "Today";
  } else if (noteDate.isSame(now.subtract(1, "day"), "day")) {
    return "Yesterday";
  } else if (noteDate.isAfter(now.subtract(7, "day"))) {
    return noteDate.fromNow();
  } else {
    return noteDate.format("MMM D, YYYY");
  }
}
