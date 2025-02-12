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

export const formatBirthday = (birthdayString: string): string => {
  try {
    const [day, month] = birthdayString.split('/').map(n => parseInt(n));
    if (isNaN(day) || isNaN(month)) return birthdayString;

    const ordinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${ordinal(day)} ${months[month - 1]}`;
  } catch (e) {
    return birthdayString;
  }
};
