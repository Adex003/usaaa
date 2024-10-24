import Filter from "bad-words";

const filter = new Filter();

export const isProfane = (value: string | undefined) => {
  if (!value) {
    return true;
  }
  return !filter.isProfane(value);
};
