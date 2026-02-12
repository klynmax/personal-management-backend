export default function calculateFirstDueDate(
  purchaseDate: Date,
  closingDay: number,
  dueDay: number,
): Date {
  const year = purchaseDate.getFullYear();
  const month = purchaseDate.getMonth();
  const day = purchaseDate.getDate();

  let dueMonth = month;

  // Se comprou depois do fechamento, vai para próxima fatura
  if (day > closingDay) {
    dueMonth += 1;
  }

  return new Date(year, dueMonth, dueDay);
}
