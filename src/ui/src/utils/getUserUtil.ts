import { getCurrentUser } from '@domino/api/dist/Users';
import {
  DominoCommonUserPerson
} from '@domino/api/dist/types';
// store the user in memory to avoid extra lookups
let user: DominoCommonUserPerson;
export async function currentUser() {
  if (user) {
    return user;
  }
  try {
    user = await getCurrentUser({});
    return user;
  } catch (err) {
    console.log('No user authenticated');
    return {} as DominoCommonUserPerson;
  }
}
