import Store from "electron-store";

type Schema = {
  plaidAccessToken: string | null;
};

const store = new Store<Schema>({
  defaults: {
    plaidAccessToken: null,
  },
});

export default store;
