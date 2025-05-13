import { computed } from "vue";

export default function usePagination(
  totalPage,
  currentPage,
  siblingCount = 1
) {
  const generateArr = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => start + index);
  };

  const pagination = computed(() => {
    const minPagination = 6;

    if (totalPage <= minPagination) return generateArr(1, totalPage);

    const isShowLeft = currentPage.value - siblingCount > 2;
    const isShowRight = currentPage.value + siblingCount < totalPage - 1;

    if (isShowLeft && !isShowRight) {
      const rightStart = totalPage - 3;
      const rightArr = generateArr(rightStart, totalPage);
      return [1, "...", ...rightArr];
    }

    if (!isShowLeft && isShowRight) {
      const leftArr = generateArr(1, 4);
      return [...leftArr, "...", totalPage - 1, totalPage];
    }

    const siblingLeft = Math.max(currentPage.value - siblingCount, 1);
    const siblingRight = Math.min(currentPage.value + siblingCount, totalPage);

    if (isShowLeft && isShowRight) {
      const middleArr = generateArr(siblingLeft, siblingRight);
      const leftArr = generateArr(1, 2);
      return [...leftArr, "...", ...middleArr, "...", totalPage];
    }
    return [];
  });

  return pagination.value;
}
