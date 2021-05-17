export default interface ITaskPaginatedWithAttrsDTO {
  limit: number;
  attrs: string[];
  start_key?: Record<string, unknown>;
}
