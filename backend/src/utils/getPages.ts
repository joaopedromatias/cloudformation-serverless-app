export const getPages = (items: number) => {
  const itemsOnPage = process.env.ITEMS_ON_PAGE
  if (items % itemsOnPage === 0) {
    return items / itemsOnPage
  } else {
    return Math.floor(items / itemsOnPage) + 1
  }
}
