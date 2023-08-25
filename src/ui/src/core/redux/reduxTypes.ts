export type ActionType = string;

export type Payload = any;

export interface Action {
  type: ActionType;
  data?: Payload;
}
