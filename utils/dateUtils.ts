export const getDaysUntilBirthday = (birthdayString: string): number | null => {
  try {
    const today = new Date();
    const [month, day] = birthdayString.split('/').map(n => parseInt(n));
    
    if (isNaN(month) || isNaN(day)) return null;
    
    const birthday = new Date(today.getFullYear(), month - 1, day);
    if (birthday.getTime() < today.getTime()) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = birthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
};
