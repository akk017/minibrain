import { atom, useRecoilState } from "recoil";
import { ReadAllProject } from "../persistance";
import { useEffect } from "react";

interface IProject {
  name: string;
  _id: string;
}

export interface IWorkitem {
  _id: string | undefined;
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isComplete: boolean;
  project: IProject | null;
}



export const WorkItemState = atom<IWorkitem[]>({
  key: "workitem-state",
  default: [],
});

export const InitalWorkitemState: IWorkitem = {
  _id: undefined,
  id: "0",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  isComplete: false,
  project: {
    name: "", 
    _id: ""
  },
}

export const CurrentWorkItemState = atom<IWorkitem>({
  key: "current-workitem",
  default: InitalWorkitemState,
});



export const ProjectsState = atom<IProject[]>({
  key: "projects-state",
  default: [],
});

export const CurrentProjectState = atom<IProject | null>({
  key: "current-project",
  default: null,
});

export function useProjects() {
  const [projects, setProjects] = useRecoilState<IProject[]>(ProjectsState);
  const [currentProject, setCurrentProject] = useRecoilState<IProject | null>(CurrentProjectState);

  useEffect(() => {
    const getAll = async () => {
      const resp = await ReadAllProject();
      const data = await resp.json();
      if (data === null) return;
      setProjects(data);

      console.log(data);
    };

    if (currentProject === null) {
      getAll();
    }
  }, [currentProject]);

  return { projects, setProjects, currentProject, setCurrentProject };
}