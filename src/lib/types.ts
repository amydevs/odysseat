export type Route = {
  name: string;
  path: string;
  currentPathRegex?: RegExp;
  current?: boolean;
};