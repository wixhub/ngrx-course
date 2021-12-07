import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from "@ngrx/store";
import { User } from "../model/user.model";

export interface AppState {
  user: User;
}

export const reducers: ActionReducerMap<AppState> = {
  user: undefined,
};

export const getUser = (state: AppState) => state.user;
