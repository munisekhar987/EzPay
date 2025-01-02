import Link from 'next/link'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const RecentTransactions = ({ accounts = [], page = 1 }: RecentTransactionsProps) => {
  console.log("In Recent Transactions",accounts);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(accounts.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = accounts.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        {/* Remove unnecessary link */}
      </header>

      {/* Display the transactions */}
      <TransactionsTable accounts={currentTransactions} />

      {/* Pagination logic */}
      {totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} page={page} />
        </div>
      )}
    </section>
  );
};

export default RecentTransactions;
