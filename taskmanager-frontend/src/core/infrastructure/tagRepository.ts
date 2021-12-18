import { TagProps } from "../entities";
import { TagRepositoryProps } from "../entities/repositories";
import { AxiosResponse } from "axios";
import { Repository } from "./repository";

export class TagRepository
  extends Repository<TagProps>
  implements TagRepositoryProps
{
  getProjectTags(project_id: number): Promise<AxiosResponse<TagProps[]>> {
    return TagRepository.prototype.getAll(
      `/api/v1/projects/${project_id}/tags`
    );
  }
}
