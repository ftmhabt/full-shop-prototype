import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  const orders = [
    { id: 1, status: "ارسال شد", total: "450,000 تومان", date: "1402/05/12" },
    {
      id: 2,
      status: "در حال پردازش",
      total: "120,000 تومان",
      date: "1402/05/10",
    },
    { id: 3, status: "لغو شد", total: "80,000 تومان", date: "1402/04/29" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">سفارش‌های من</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">شماره سفارش</TableHead>
            <TableHead className="text-right">تاریخ</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="text-right">مجموع</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>#{o.id}</TableCell>
              <TableCell>{o.date}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>{o.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
