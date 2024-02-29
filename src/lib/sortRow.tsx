import sortBy from "lodash/sortBy";
import { DataTableSortStatus } from "mantine-datatable";

const sortRow = (data: any[], sortStatus: DataTableSortStatus<any>) => {
  return sortBy(data, [
    (item) => {
      const value = item[sortStatus.columnAccessor];
      return typeof value === "string" ? value.toLowerCase() : value;
    },
  ]);
};

export default sortRow;
