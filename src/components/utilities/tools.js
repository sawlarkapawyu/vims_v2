export function getDateValue(dateString) {
  if (!dateString) return ""; // Handle empty value

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function translateNumberToMyanmar(number) {
  const translations = {
    '0': '၀',
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉',
  };

  if (number < 10) {
    return translations[number.toString()] || number.toString();
  }

  let translatedNumber = '';
  const digits = number.toString().split('');

  for (let i = 0; i < digits.length; i++) {
    translatedNumber += translations[digits[i]];
  }

  return translatedNumber;
}