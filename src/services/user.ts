import {GetResult, Preferences} from "@capacitor/preferences"

export const isLoggedIn = async (): Promise<GetResult> => {
  return await Preferences.get({key: 'isLoggedIn'})
}

export const getCurrentUser = async (): Promise<GetResult> => {
  return await Preferences.get({key: 'currentUser'})
};

export const setCurrentUser = async (user: any) => {
  await Preferences.set({key: 'isLoggedIn', value: '1'});
  await  Preferences.set({key: 'currentUser', value: JSON.stringify(user)});
};

export const logoutUser = async () => {
  await Preferences.set({key: 'isLoggedIn', value: '0'});
  await  Preferences.set({key: 'currentUser', value: ''});
};
