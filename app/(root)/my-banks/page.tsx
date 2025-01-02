import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
// import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  // const accounts = await getAccounts({ 
  //   userId: loggedIn.$id 
  // });
  const accounts = { data: [] }; // This represents an empty response, you can replace it with actual API data
  const defaultAccounts = [
    {
      id: '1',
      cardType: 'Visa',
      last4: '1234',
      availableBalance: 1000,
      currentBalance: 1000,
      officialName: 'Visa Classic',
      mask: '**** 1234',
      institutionId: 'inst1',
      name: 'Visa Account',
      type: 'credit',
      subtype: 'classic',
      appwriteItemId: 'appwrite1',
      shareableId: 'shareable1'
    },
    {
      id: '2',
      cardType: 'MasterCard',
      last4: '5678',
      availableBalance: 2000,
      currentBalance: 2000,
      officialName: 'MasterCard Platinum',
      mask: '**** 5678',
      institutionId: 'inst2',
      name: 'MasterCard Account',
      type: 'credit',
      subtype: 'platinum',
      appwriteItemId: 'appwrite2',
      shareableId: 'shareable2'
    }
  ];
  
  

  const displayAccounts = accounts?.data && accounts.data.length ? accounts.data : defaultAccounts;


  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {displayAccounts.map((a: Account) => (
              <BankCard 
                key={a.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks
