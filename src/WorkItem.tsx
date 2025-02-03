import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  FormGroup,
  InputGroup,
  Label,
  MenuItem,
  SegmentedControl,
  TextArea,
} from "@blueprintjs/core";
import { DateInput3 } from "@blueprintjs/datetime2";
import { useRecoilState } from "recoil";
import {
  CurrentWorkItemState,
  InitalWorkitemState,
  useProjects,
  WorkItemState,
} from "./state/workitem";
import { enIN, tr } from "date-fns/locale";
import {
  CreateOneWorkItem,
  CreateProject,
  DeleteProject,
  DeleteWorkItem,
  QueryWorkItems,
  ReadAllProject,
  ReadAllWorkItems,
  UpdateWorkItem,
} from "./persistance";
import { useEffect, useState } from "react";
import { navigateTo } from "./panel_nav";
import { Select } from "@blueprintjs/select";
import { useNotes } from "./state/notes";

export default function WorkItems() {
  const [workitems, setWorkItems] = useRecoilState(WorkItemState);
  const [currentWorkItem, setCurrentWorkItem] =
    useRecoilState(CurrentWorkItemState);

  const projects_list = useProjects().projects.map((project) => project.name);

  const [project, setProject] = useState(projects_list[0]);
  const [status, setStatus] = useState("todo");
  const { setCurrentProject } = useProjects();

  // useEffect(() => {
  //   const getAll = async () => {
  //     const resp = await ReadAllWorkItems();
  //     const data = await resp.json();
  //     if (data === null){
  //       setWorkItems([]);
  //       return;
  //     }
  //     setWorkItems(data);
  //   };
  //   console.log("effect", currentWorkItem);
  //   if (currentWorkItem === InitalWorkitemState) {
  //     getAll();
  //   }
  // }, []);

  useEffect(() => {
    const getAll = async () => {
      const resp = await QueryWorkItems(project, status);
      const data = await resp.json();
      if (data === null) {
        setWorkItems([]);
        return
      }
      setWorkItems(data);
    };
    console.log("status effect");
    getAll();
  }, [status, currentWorkItem]);

  useEffect(() => {
    const getAll = async () => {
      const resp = await QueryWorkItems(project, status);
      const data = await resp.json();
      if (data === null){
        setWorkItems([]);
        return;
      }
      setWorkItems(data);
    };
    console.log("status effect");
    getAll();
  }, [project, currentWorkItem]);

  return (
    <div className="container">
      <h3>Work Items</h3>
      <div className="hflex mar-top gap-10">
        <Button
          text="Create New"
          intent="primary"
          icon="plus"
          onClick={() => {
            setCurrentWorkItem({
              _id: undefined,
              id: "0",
              title: "",
              description: "",
              startDate: "",
              endDate: "",
              isComplete: false,
              project: null
            });
            navigateTo("/workitems");
          }}
        />

        <Select
          items={projects_list}
          itemRenderer={(item) => {
            if (item === "==new==") {
              return (
                <MenuItem key={item} text={item} icon="plus" />
              );
            }
            return <MenuItem key={item} text={item} onClick={() => setProject(item)} />;
          }}
          onItemSelect={() => {}}
          popoverProps={{ minimal: true, matchTargetWidth: true }}
          filterable={false}
          
        >
          <Button
            text={project ?? "--"}
            rightIcon="double-caret-vertical"
            alignText="left"
            style={{ width: "150px" }}
          />
        </Select>

        <Select
          items={[
            { value: "id", label: "ID" },
            { value: "title", label: "Title" },
            { value: "desc", label: "Description" },
            { value: "start", label: "Start Date" },
            { value: "end", label: "End Date" },
          ]}
          itemRenderer={(item) => {
            if (item.value === "==new==") {
              return (
                <MenuItem key={item.value} text={item.label} icon="plus" />
              );
            }
            if (item.value === "id" || item.value === "title") {
              return (
                <MenuItem
                  key={item.value}
                  text={item.label}
                  icon="small-tick"
                />
              );
            }
            return <MenuItem key={item.value} text={item.label} />;
          }}
          onItemSelect={() => {}}
          popoverProps={{ minimal: true, matchTargetWidth: true }}
          filterable={false}
        >
          <Button
            text={"View"}
            rightIcon="double-caret-vertical"
            alignText="left"
            style={{ width: "150px" }}
            disabled={true}
          />
        </Select>

        <SegmentedControl
          options={[
            {
              label: "Todo",
              value: "todo",
            },
            {
              label: "Completed",
              value: "completed",
            },
          ]}
          value={status}
          onValueChange={(value) => setStatus(value)}
          small
          intent="primary"
        />
      </div>
      {JSON.stringify(workitems) !== "[]" && (
        <table className="bp5-html-table mb-table bp5-interactive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {[...workitems].reverse().map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  navigateTo("/workitems");
                  setCurrentWorkItem(item);

                  console.log("select workitem", item);
                  setCurrentProject(item.project);
                }}
              >
                <td>{item.id}</td>
                <td style={{ minWidth: "100px" }}>{item.title}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function AddWorkItem() {
  const [workitems] = useRecoilState(WorkItemState);
  const [currentWorkItem, setCurrentWorkItem] =
    useRecoilState(CurrentWorkItemState);

  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectSelect, setProjectSelect] = useState(false);
  const {currentProject, setCurrentProject, projects, setProjects} = useProjects()


  if (!currentWorkItem) return <></>;

  console.log("WorkItem", currentProject);

  return (
    <div className="container">
      <Dialog isOpen={isOpen}>
        <DialogBody>
          <h4>Create a Projects</h4>
          <InputGroup
            className="mar-top"
            placeholder="Project Name"
            value={projectName}
            fill
            onValueChange={(value) => setProjectName(value)}
          />
          <div className="hflex gap-10 mar-top-b">
            <Button
              text="Create"
              intent="primary"
              onClick={async () => {
                if (!projectName) return;
                await CreateProject(projectName);
                setCurrentProject(null)
                setProjectName("");
                setIsOpen(false);

                const req = await ReadAllProject();
                let data = await req.json()
                if (data === null) data = [];
                setProjects(data)
              }}
            />
            <Button text="Cancel" onClick={() => setIsOpen(false)} />
          </div>
        </DialogBody>
      </Dialog>
      <FormGroup>
        <Label>ID</Label>
        <InputGroup
          value={
            currentWorkItem._id
              ? currentWorkItem.id
              : `T-${(workitems.length + 1).toString().padStart(3, "0")}`
          }
          onValueChange={(value) =>
            setCurrentWorkItem({ ...currentWorkItem, id: value })
          }
          disabled
        ></InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Title</Label>
        <InputGroup
          value={currentWorkItem.title}
          onValueChange={(value) =>
            setCurrentWorkItem({ ...currentWorkItem, title: value })
          }
        ></InputGroup>
      </FormGroup>
      <FormGroup fill>
        <Label>Description</Label>
        <TextArea
          fill
          value={currentWorkItem.description}
          onChange={(e) =>
            setCurrentWorkItem({
              ...currentWorkItem,
              description: e.target.value,
            })
          }
        ></TextArea>
      </FormGroup>
      <FormGroup>
        <Label>Start Date</Label>
        <DateInput3
          popoverProps={{ minimal: true, position: "bottom-left" }}
          dateFnsFormat="dd-MMM-yyyy"
          locale={enIN}
          value={currentWorkItem.startDate}
          onChange={(value) => {
            if (!value) return;
            setCurrentWorkItem({ ...currentWorkItem, startDate: value });
          }}
        ></DateInput3>
      </FormGroup>
      <FormGroup>
        <Label>End Date</Label>
        <DateInput3
          popoverProps={{ minimal: true, position: "bottom-left" }}
          dateFnsFormat="dd-MMM-yyyy"
          locale={enIN}
          value={currentWorkItem?.endDate}
          onChange={(value) => {
            if (!value) return;
            setCurrentWorkItem({ ...currentWorkItem, endDate: value });
          }}
        ></DateInput3>
      </FormGroup>

      <FormGroup fill>
        <Label>Project</Label>
        <Select
          items={[...projects, { name: "Create new project", _id: "" }]}
          itemRenderer={(item) => {
            if (item.name === "Create new project") {
              return (
                <MenuItem
                  key={item.name}
                  text={item.name}
                  icon="plus"
                  onClick={() => setIsOpen(true)}
                />
              );
            }
            return (
              <Button
                text={item.name}
                fill
                alignText="left"
                minimal
                onClick={() => {
                  setCurrentProject(item);
                  setProjectSelect(false);
                }}
                rightIcon={
                  <Button
                    icon="cross"
                    minimal
                    small
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!item._id) return;
                      setCurrentProject(null);
                      setProjectSelect(false);
                      await DeleteProject(item._id);
                      const req = await ReadAllProject();
                      let data = await req.json()
                      if (data === null) data = [];
                      setProjects(data)
                    }}
                  />
                }
              />
            );
          }}
          onItemSelect={() => {}}
          popoverProps={{
            minimal: true,
            matchTargetWidth: true,
            isOpen: projectSelect,
            canEscapeKeyClose: true,
          }}
          filterable={false}
          fill
        >
          <Button
            text={currentProject?.name ? currentProject.name : "--"}
            rightIcon="double-caret-vertical"
            fill
            alignText="left"
            onClick={() => setProjectSelect((prev) => !prev)}
          />
        </Select>
      </FormGroup>

      {!currentWorkItem._id ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            text="Save"
            fill
            intent="primary"
            alignText="left"
            icon="caret-right"
            onClick={async () => {
              if (!currentWorkItem) return;
              if (!currentWorkItem.title) return;
              const newWorkItem = { ...currentWorkItem, project: currentProject };
              newWorkItem.id = `T-${(workitems.length + 1)
                .toString()
                .padStart(3, "0")}`;
              console.log("Saving", newWorkItem);
              await CreateOneWorkItem(newWorkItem);
              setCurrentWorkItem(InitalWorkitemState);
              setCurrentProject(null);
            }}
          />
        </div>
      ) : (
        <>
          <FormGroup>
            <Button
              text={
                currentWorkItem.isComplete
                  ? "Mark as Incomplete"
                  : "Mark as Completed"
              }
              intent={currentWorkItem.isComplete ? "none" : "success"}
              alignText="left"
              icon={currentWorkItem.isComplete ? "cross" : "small-tick"}
              fill
              onClick={async () => {
                if (!currentWorkItem) return;
                if (!currentWorkItem._id) return;
                await UpdateWorkItem(currentWorkItem._id, {
                  isComplete: currentWorkItem.isComplete ? false : true,
                });
                setCurrentWorkItem(InitalWorkitemState);
                setCurrentProject(null);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Button
              text="Update"
              intent="primary"
              alignText="left"
              icon="caret-up"
              fill
              onClick={async () => {
                if (!currentWorkItem) return;
                if (!currentWorkItem._id) return;
                await UpdateWorkItem(currentWorkItem._id, {
                  title: currentWorkItem.title,
                  description: currentWorkItem.description,
                  startDate: currentWorkItem.startDate,
                  endDate: currentWorkItem.endDate,
                  project: currentProject,
                });
                setCurrentWorkItem(InitalWorkitemState);
                setCurrentProject(null);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Button
              text="Delete"
              intent="danger"
              alignText="left"
              icon="trash"
              fill
              onClick={async () => {
                if (!currentWorkItem) return;
                if (!currentWorkItem._id) return;
                await DeleteWorkItem(currentWorkItem._id);
                setCurrentWorkItem(InitalWorkitemState);
                setCurrentProject(null);
              }}
            />
          </FormGroup>
        </>
      )}
    </div>
  );
}
