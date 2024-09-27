import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";

import organizationSlice from "./organizationSlice";
import integrationSlice from "./integrationSlice";
import projectSlice from "./projectSlice";
import mailSlice from "./mailSlice";
import leadSlice from "./leadSlice";

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: "my-super-secret-key",
      onError(error) {
        console.log(error);
      },
    }),
  ],
};

const rootReducer: Reducer = combineReducers({
  organization: organizationSlice,
  integration: integrationSlice,
  project: projectSlice,
  mail: mailSlice,
  lead: leadSlice,
});

const persistedReducer: Reducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
// export default store;
