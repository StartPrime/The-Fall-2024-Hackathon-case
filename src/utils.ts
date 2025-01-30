export function formatDateStringWithoutDateObject(dateString: string): string {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) {
    return 'Invalid Date';
  }
  return `${day}.${month}.${year}`;
}

export function getCurrentDateInISOFormat(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const RussianLocalization = {
  'components.controls.blocktype.h1': 'h1',
  'components.controls.blocktype.h2': 'h2',
  'components.controls.blocktype.h3': 'h3',
  'components.controls.blocktype.h4': 'h4',
  'components.controls.blocktype.h5': 'h5',
  'components.controls.blocktype.h6': 'h6',
  'components.controls.blocktype.blockquote': 'Цитата',
  'components.controls.blocktype.code': 'Код',
  'components.controls.blocktype.blocktype': '',
  'components.controls.blocktype.normal': 'Обычный',
  'components.controls.inline.monospace': 'Моноширинное пространство',
};
