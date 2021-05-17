export default interface ITaskPaginatedDTO {
  limit: number;
  start_key?: Record<string, unknown>;
}
