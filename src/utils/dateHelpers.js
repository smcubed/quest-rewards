import {
  differenceInYears,
  differenceInDays,
  parseISO,
  format,
  isToday,
  addYears
} from 'date-fns';

export const calculateAge = (birthDate) => {
  return differenceInYears(new Date(), parseISO(birthDate));
};

export const getDaysUntilBirthday = (birthDate) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const nextBirthday = addYears(
    new Date(today.getFullYear(), birth.getMonth(), birth.getDate()),
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() > birth.getDate())
    ? 1 : 0
  );
  
  return differenceInDays(nextBirthday, today);
};

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  return format(parseISO(date), formatString);
};

export const formatTime = (date, formatString = 'h:mm a') => {
  return format(parseISO(date), formatString);
};

export const getNextAgeAdjustment = (birthDate) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  return format(
    addYears(
      new Date(today.getFullYear(), birth.getMonth(), birth.getDate()),
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() > birth.getDate())
      ? 1 : 0
    ),
    'yyyy-MM-dd'
  );
};

export const isTaskDueToday = (dueDate) => {
  return !dueDate || isToday(parseISO(dueDate));
};

export default {
  calculateAge,
  getDaysUntilBirthday,
  formatDate,
  formatTime,
  getNextAgeAdjustment,
  isTaskDueToday
};
