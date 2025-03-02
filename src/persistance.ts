import { INote, INoteItem } from "./state/notes";
import { IWorkitem } from "./state/workitem";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  OPERATION: "READ-ALL",
  COLLECTION: "workitems",
  CREATED_BY: "minibrain-0017",
});

const ReadAllWorkItemOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
};

export const API_URL = "http://localhost:18017/operations/";

// export const ReadAllWorkItems = () => fetch(API_URL, ReadAllWorkItemOptions);
export const ReadAllWorkItems = () => {
  console.log("ReadAllWorkItems");
  return fetch(API_URL, ReadAllWorkItemOptions);
}

export const CreateOneWorkItem = (workitem: IWorkitem | object) => {
  const rawCreateOne = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "workitems",
    CREATED_BY: "minibrain-0017",
    DATA: workitem,
  });
  const CreateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawCreateOne,
  };
  return fetch(API_URL, CreateWorkItemOptions);
};

export const DeleteWorkItem = (id: string) => {
  const rawDeleteOne = JSON.stringify({
    OPERATION: "DELETE",
    COLLECTION: "workitems",
    CREATED_BY: "minibrain-0017",
    ID: id,
  });
  const DeleteWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawDeleteOne,
  };
  return fetch(API_URL, DeleteWorkItemOptions);
};

export const UpdateWorkItem = (id: string, workitem: IWorkitem | object) => {
  const rawDeleteOne = JSON.stringify({
    OPERATION: "UPDATE",
    COLLECTION: "workitems",
    CREATED_BY: "minibrain-0017",
    ID: id,
    DATA: workitem,
  });
  const UpdateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawDeleteOne,
  };
  return fetch(API_URL, UpdateWorkItemOptions);
};


export const QueryWorkItems = (project: string = "Mini Brain", status: string) => {
  const rawDeleteOne = JSON.stringify({
    OPERATION: "QUERY",
    COLLECTION: "workitems",
    CREATED_BY: "minibrain-0017",
    QUERY: {
      FILTER: {
        "project.name": project,
        isComplete: status === "completed",
      },
    },
  });
  const UpdateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawDeleteOne,
  };
  return fetch(API_URL, UpdateWorkItemOptions);
};

export const CreateProject = (project: string) => {
  const rawCreateOne = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "projects",
    CREATED_BY: "minibrain-0017",
    DATA: {
      name: project,
    },
  });
  const CreateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawCreateOne,
  };
  return fetch(API_URL, CreateWorkItemOptions);
};

export const DeleteProject = (projectid: string) => {
  const rawCreateOne = JSON.stringify({
    OPERATION: "DELETE",
    COLLECTION: "projects",
    CREATED_BY: "minibrain-0017",
    ID: projectid,
  });
  const CreateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawCreateOne,
  };
  return fetch(API_URL, CreateWorkItemOptions);
};


export const ReadAllProject = () => {
  const rawCreateOne = JSON.stringify({
    OPERATION: "READ-ALL",
    COLLECTION: "projects",
    CREATED_BY: "minibrain-0017",
  });
  const CreateWorkItemOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawCreateOne,
  };
  return fetch(API_URL, CreateWorkItemOptions);
};


export const ReadAllNotes = () => {
  const body = JSON.stringify({
    OPERATION: "READ-ALL",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const CreateFolder = (name: string, parentid: string) => {
  const body = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    DATA: {
      name: name,
      type: "folder",
      notes: [],
      parentid: parentid,
    }
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};


export const CreateNote = (name: string, parentid: string) => {
  const body = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    DATA: {
      name: name,
      type: "note",
      notes: [],
      parentid: parentid,
    }
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const MoveFolder = (item: INoteItem, parentid: string) => {
  const body = JSON.stringify({
    OPERATION: "UPDATE",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    ID: item._id,
    DATA: {
      ...item,
      parentid: parentid,
    }
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};


export const DeleteNote = (id: string) => {
  const body = JSON.stringify({
    OPERATION: "DELETE",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    ID: id,
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const QueryRoot = (noteid: string) => {
  const body = JSON.stringify({
    OPERATION: "QUERY",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    QUERY: {
      FILTER: {
        parentid: noteid ? noteid : "root",
      }
    }
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};


export const GetNote = (id: string) => {
  const body = JSON.stringify({
    OPERATION: "READ",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    ID: id,
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const UpdateNote = (id: string, note: INote) => {
  const body = JSON.stringify({
    OPERATION: "UPDATE",
    COLLECTION: "notes",
    CREATED_BY: "minibrain-0017",
    ID: id,
    DATA: note,
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};


export const AddEntry = (weight: string) => {
  const body = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "tracker",
    CREATED_BY: "minibrain-0017",
    DATA: {
      weight: parseInt(weight),
      date: new Date().toISOString(),
    }
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const GetAllEntry = (weight: string) => {
  const body = JSON.stringify({
    OPERATION: "READ-ALL",
    COLLECTION: "tracker",
    CREATED_BY: "minibrain-0017",
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const DeleteEntry = (id: string) => {
  const body = JSON.stringify({
    OPERATION: "DELETE",
    COLLECTION: "tracker",
    CREATED_BY: "minibrain-0017",
    ID: id
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

