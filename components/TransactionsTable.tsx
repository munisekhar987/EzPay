import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <div className={cn('category-badge')}>
      <p className={cn('text-[12px] font-medium')}>{category}</p>
    </div>
  )
}

const TransactionsTable = ({ accounts }: TransactionTableProps) => {
  console.log("IntransactTable", accounts);
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Type</TableHead>
          <TableHead className="px-2">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(accounts) && accounts.map((t: Transaction) => {
          const amount = formatAmount(t.transaction_amount)
          const isDebit = t.transact_type === 'debit';
          const isCredit = t.transact_type === 'credit';

          return (
            <TableRow key={t.transaction_id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.sender_email}   →   {t.receiver_email}
                  </h1>
                </div>
              </TableCell>

              <TableCell className={`pl-2 pr-10 font-semibold ${isDebit ? 'text-[#f04438]' : 'text-[#039855]'}`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={t.transact_type} />
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.transaction_time)).dateTime}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
