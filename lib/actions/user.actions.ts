'use server';

import axios from 'axios';
// import Cookies from 'js-cookie';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";




// Base URL for backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ezpay.msgnaa.info:9090';


export const transferPayment = async ({ transaction_amount, receiver_email, sender_email } :getTransferPayment) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transact/send`, {
      transaction_amount,
      receiver_email,
      sender_email,
    });

    console.log("PyamentTransfer res",response.data);
    // Assuming the backend responds with a success status
    return response.data; 
  } catch (error) {
    console.error('Error processing payment transfer:', error);
    return { success: false }; // Handle failure gracefully
  }
};

// Get transactions by user ID
export const getTransactionsByUserId = async (userId: string) => {
  try {
    console.log("Inside Trnasactions getoiing user actions ---")
    // Send a GET request to the Spring Boot backend controller to fetch transactions for the given user ID
    
    const response = await axios.get(`${API_BASE_URL}/transact/${userId}`);

    // Return the transactions data if successful
    return response.data;
  } catch (error) {
    // Log any errors
    console.error("Error fetching transactions:", error);
    return null; // or handle error as needed
  }
};



// Get user information by userId
export const getUserInfo = async ({ userId }:getUserInfoProps) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
    return parseStringify(response.data);
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

// Sign-in a user
export const signIn = async ({ email, password }:signInProps) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/signin`, { email, password });
    console.log("ohhhhhh response ---------------------->",response);
    //const { token, user } = response.data;

    const cookiesIN = response.headers['set-cookie'];
    const user = response.data ;
    if (cookiesIN && cookiesIN.length > 0) {
        const token = cookiesIN[0].split(';')[0].split('=')[1];
        console.log("token------sasas----------->",token); // This will output the session token
        // Extract the session-token value
        cookies().set('session-token', token, {
          path: '/', // Ensure it's accessible across all routes
          httpOnly: false, // Prevent client-side JavaScript from accessing the cookie
          sameSite: 'strict', // Enforce same-site policy
          secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        });

        // setting up token in localstorage 
        // localStorage.setItem('session-token', token);
        
    } else {
        console.error('No session token found');
    }
    
    // console.log("cookoessss.........",cookies().get('session-token'))

    return parseStringify(user);
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

// Sign-up a new user
export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/signup`, {
      email,
      password,
      firstName,
      lastName
    });

    console.log("Response Data------------------------------:", response.data);
    console.log("Full Response------------------------------:", response);
    const  user  = response.data;

    // // Set session token as a cookie
    // Cookies.set('session-token', token, {
    //   path: '/',
    //   httpOnly: true,
    //   sameSite: 'strict',
    //   secure: true,
    // });

    return parseStringify(user);
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

// Get the currently logged-in user
export const getLoggedInUser = async () => {
  try {
    console.log("SessionToken---------------------------------------------")
    const token = cookies().get('session-token')?.value;

    // const token = localStorage.getItem('session-token');

    console.log("tokennasjahsbhas->>>>",token)
    // if (!token) {
    //   throw new Error('No session token found');
    // }

    const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data ;
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
  }
};

// Log out the user
export const logoutAccount = async () => {
  try {
    const token = cookies().get('session-token');
    //const token = localStorage.getItem('session-token');
    if (token) {
      await axios.post(`${API_BASE_URL}/api/users/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    cookies().delete('session-token');
    //localStorage.removeItem('session-token');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    // Send a GET request to the Spring Boot backend controller to fetch bank accounts
    const response = await axios.get(`${API_BASE_URL}/api/bank-accounts`, {
      params: { userId }
    });

    // Return the bank accounts data if successful
    return response.data;
  } catch (error) {
    // Log any errors
    console.error("Error fetching bank accounts:", error);
    throw error; // Rethrow error if you want to handle it further up the chain
  }
};



// const {
//   APPWRITE_DATABASE_ID: DATABASE_ID,
//   APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
//   APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
// } = process.env;

// export const getUserInfo = async ({ userId }: getUserInfoProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const user = await database.listDocuments(
//       DATABASE_ID!,
//       USER_COLLECTION_ID!,
//       [Query.equal('userId', [userId])]
//     )

//     return parseStringify(user.documents[0]);
//   } catch (error) {
//     console.log(error)
//   }
// }

// export const signIn = async ({ email, password }: signInProps) => {
//   try {
//     const { account } = await createAdminClient();
//     const session = await account.createEmailPasswordSession(email, password);

//     cookies().set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     const user = await getUserInfo({ userId: session.userId }) 

//     return parseStringify(user);
//   } catch (error) {
//     console.error('Error', error);
//   }
// }

// export const signUp = async ({ password, ...userData }: SignUpParams) => {
//   const { email, firstName, lastName } = userData;
  
//   let newUserAccount;

//   try {
//     const { account, database } = await createAdminClient();

//     newUserAccount = await account.create(
//       ID.unique(), 
//       email, 
//       password, 
//       `${firstName} ${lastName}`
//     );

//     if(!newUserAccount) throw new Error('Error creating user')

//     const dwollaCustomerUrl = await createDwollaCustomer({
//       ...userData,
//       type: 'personal'
//     })

//     if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')

//     const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

//     const newUser = await database.createDocument(
//       DATABASE_ID!,
//       USER_COLLECTION_ID!,
//       ID.unique(),
//       {
//         ...userData,
//         userId: newUserAccount.$id,
//         dwollaCustomerId,
//         dwollaCustomerUrl
//       }
//     )

//     const session = await account.createEmailPasswordSession(email, password);

//     cookies().set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     return parseStringify(newUser);
//   } catch (error) {
//     console.error('Error', error);
//   }
// }

// export async function getLoggedInUser() {
//   try {
//     const { account } = await createSessionClient();
//     const result = await account.get();

//     const user = await getUserInfo({ userId: result.$id})

//     return parseStringify(user);
//   } catch (error) {
//     console.log(error)
//     return null;
//   }
// }

// export const logoutAccount = async () => {
//   try {
//     const { account } = await createSessionClient();

//     cookies().delete('appwrite-session');

//     await account.deleteSession('current');
//   } catch (error) {
//     return null;
//   }
// }

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}

// export const createBankAccount = async ({
//   userId,
//   bankId,
//   accountId,
//   accessToken,
//   fundingSourceUrl,
//   shareableId,
// }: createBankAccountProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const bankAccount = await database.createDocument(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       ID.unique(),
//       {
//         userId,
//         bankId,
//         accountId,
//         accessToken,
//         fundingSourceUrl,
//         shareableId,
//       }
//     )

//     return parseStringify(bankAccount);
//   } catch (error) {
//     console.log(error);
//   }
// }

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    // await createBankAccount({
    //   userId: user.$id,
    //   bankId: itemId,
    //   accountId: accountData.account_id,
    //   accessToken,
    //   fundingSourceUrl,
    //   shareableId: encryptId(accountData.account_id),
    // });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

// export const getBanks = async ({ userId }: getBanksProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const banks = await database.listDocuments(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       [Query.equal('userId', [userId])]
//     )

//     return parseStringify(banks.documents);
//   } catch (error) {
//     console.log(error)
//   }
// }

export const getBank = async ({ documentId }: getBankProps) => {
  // try {
  //   const { database } = await createAdminClient();

  //   const bank = await database.listDocuments(
  //     DATABASE_ID!,
  //     BANK_COLLECTION_ID!,
  //     [Query.equal('$id', [documentId])]
  //   )

  //   return parseStringify(bank.documents[0]);
  // } catch (error) {
  //   console.log(error)
  // }
  return [] ;
}

// export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const bank = await database.listDocuments(
//       DATABASE_ID!,
//       BANK_COLLECTION_ID!,
//       [Query.equal('accountId', [accountId])]
//     )

//     if(bank.total !== 1) return null;

//     return parseStringify(bank.documents[0]);
//   } catch (error) {
//     console.log(error)
//   }
// }