const getPaginationMetadata = (count, page = 1, limit = 1) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / pageSize);
  return {
    totalCount: count,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

const getOffset = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const offset = (currentPage - 1) * pageSize;
  return offset;
};

module.exports = { getPaginationMetadata, getOffset };
