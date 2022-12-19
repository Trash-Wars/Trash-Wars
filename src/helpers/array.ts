
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
  //for each item in the collection
  for (const item of collection) {
    //add item to the page array
    page.push(item);
    itemsToAdd--;
    // if there are no more items left to add to that page
    if (itemsToAdd === 0) {
      itemsToAdd = maxPerPage;
      pages.push(page);
      page = [];
    }
  }
  //if there are items left to add which would be less than a full page
  if (page.length > 0) {
    pages.push(page)
  }
  return pages;
};
