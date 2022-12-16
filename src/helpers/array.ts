
export function range(start: number, end: number) {
  const ans: number[] = [];
  for (let i = start; i <= end; i++) {
      ans.push(i);
  }
  return ans;
}

export const paginate = <T>(collection: T[], maxPerPage: number): T[][] => {
  const pages: T[][] = [];
  let page: T[] = [];
  let itemsToAdd = maxPerPage;

  for (const item of collection) {
    page.push(item);
    itemsToAdd--;
    if (!itemsToAdd) {
      itemsToAdd = maxPerPage;
      pages.push(page);
      page = [];
    }
  }
  return pages;
};
