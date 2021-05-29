export default interface ICommonPagination {
  lastKey: Record<string, unknown>;
  count: number;
  queriedCount: number;
  timesQueried: number;
}
