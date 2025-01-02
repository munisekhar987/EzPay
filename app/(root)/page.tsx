import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser , getTransactionsByUserId } from '@/lib/actions/user.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  console.log("Onnnnnnnn home page -----------------------")
  const loggedIn = await getLoggedInUser();
  console.log("sucessasasasas--------0900")

  const accounts = await getTransactionsByUserId(loggedIn.userid)

  console.log("In Main page ",accounts);

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox 
            totalCurrentBalance={loggedIn?.walletAmount}
          />
        </header>

        <RecentTransactions 
          accounts={accounts}
          page={currentPage}
        />
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={accounts}
      />
    </section>
  )
}

export default Home