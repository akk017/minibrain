import * as comps from "@blueprintjs/core";
import { navigateTo } from "./panel_nav";
import { DateInput3 } from "@blueprintjs/datetime2";
import { enIN } from "date-fns/locale";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { API_URL } from "./persistance";
import { Select } from "@blueprintjs/select";

interface Entry {
  date: string;
  name: string;
  debit: string;
  credit: string;
  _id: string;
}

export const GetAllEntry = () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const body = JSON.stringify({
    OPERATION: "READ-ALL",
    COLLECTION: "accounts",
    CREATED_BY: "minibrain-0017",
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const AddEntry = (data: Entry) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const body = JSON.stringify({
    OPERATION: "CREATE",
    COLLECTION: "accounts",
    CREATED_BY: "minibrain-0017",
    DATA: {
      date: data.date,
      debit: data.debit,
      credit: data.credit,
      name: data.name,
    },
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const UpdateEntry = (id: string, data: Entry) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const body = JSON.stringify({
    OPERATION: "UPDATE",
    COLLECTION: "accounts",
    CREATED_BY: "minibrain-0017",
    ID: id,
    DATA: {
      date: data.date,
      debit: data.debit,
      credit: data.credit,
      name: data.name,
    },
  });
  const options = {
    method: "POST",
    headers: myHeaders,
    body: body,
  };
  return fetch(API_URL, options);
};

export const DeleteEntry = (id: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const body = JSON.stringify({
    OPERATION: "DELETE",
    COLLECTION: "accounts",
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

const AllEntryState = atom<Entry[]>({
  key: "all-entry",
  default: [],
});

const CurrentEntryState = atom<Entry | null>({
  key: "current-entry",
  default: null,
});

const Trigger = atom<boolean>({
  key: "trigger",
  default: false,
});

const AccountToaster: comps.Toaster = await comps.OverlayToaster.createAsync({
  position: "top",
});

export default function Accounts() {
  const [allEntry, setAllEntry] = useRecoilState(AllEntryState);
  const [trigger, setTrigger] = useRecoilState(Trigger);
  const [currentEntry, setCurrentEntry] = useRecoilState(CurrentEntryState);
  const [balance, setBalance] = useState<{ debit: number; credit: number }>({
    debit: 0,
    credit: 0,
  });

  const [month, setMonth] = useState<{name: string, _id: string}>({ name: "April", _id: "apr" });

  const months = [
    { name: "April", _id: "apr" },
    { name: "May", _id: "may" },
    { name: "June", _id: "jun" },
    { name: "July", _id: "jul" },
    { name: "Augest", _id: "aug" },
    { name: "September", _id: "sep" },
  ];
  useEffect(() => {
    const getAll = async () => {
      const resp = await GetAllEntry();
      const data = await resp.json();
      if (data === null) return;
      let arr = []
      data.forEach(element => {
        const fDate = new Date(element.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const d = fDate.toLocaleLowerCase()
        if (d.includes(month._id)) arr.push(element)
      });
      setAllEntry(arr);
      let debit = 0;
      let credit = 0;
      for (let i = 0; i < arr.length; i++) {
        debit += parseFloat(arr[i].debit);
        credit += parseFloat(arr[i].credit);
      }
      setBalance({ debit, credit });
    };
    getAll();
  }, [trigger, month]);

  return (
    <div className="container">
      <h3>Tracker</h3>
      <div className="mar-top account-nav">
        <Select
          items={months}
          itemRenderer={(item) => {
            return <comps.MenuItem text={item.name} onClick={() => {
              setMonth(item)
            }} />;
          }}
          onItemSelect={() => {}}
          filterable={false}
          popoverProps={{ minimal: true }}
        >
          <comps.Button minimal>{month.name}</comps.Button>
        </Select>
        <comps.Button
          onClick={() => {
            navigateTo("/accounts");
            setCurrentEntry(null);
          }}
          minimal
        >
          Add Entry
        </comps.Button>
        <comps.Button onClick={() => setTrigger((prev) => !prev)} minimal>
          Refresh
        </comps.Button>
      </div>

      <table className="bp5-html-table mb-table bp5-interactive">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Debit</th>
            <th>Cerdit</th>
          </tr>
        </thead>
        <tbody>
          {allEntry.map((item, index) => {
            const fDate = new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <tr key={index} onClick={() => setCurrentEntry(item)}>
                <td>{fDate}</td>
                <td>{item.name}</td>
                <td>- {item.debit}</td>
                <td>+ {item.credit}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={2}>
              <b>Total Expenses:</b>
            </td>
            <td>Swaga {balance.debit}</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={3}>
              <b>Balance:</b>
            </td>
            <td>Rs. {balance.credit - balance.debit}</td>
          </tr>
        </tbody>
      </table>

      <div></div>
    </div>
  );
}

export function AccountSidePanel() {
  const [_a, setAllEntry] = useRecoilState(AllEntryState);
  const [trigger, setTrigger] = useRecoilState(Trigger);
  const [currentEntry, setCurrentEntry] = useRecoilState(CurrentEntryState);
  const [state, setState] = useState<Entry>({
    date: new Date().toISOString(),
    name: "",
    debit: "0",
    credit: "0",
    _id: "0",
  });

  useEffect(() => {
    setState(
      currentEntry
        ? currentEntry
        : {
            date: new Date().toISOString(),
            name: "",
            debit: "0",
            credit: "0",
            _id: "0",
          }
    );
  }, [currentEntry]);

  return (
    <div className="container">
      <h3>Add Entry</h3>
      <comps.FormGroup className="mar-top">
        <comps.Label>Date</comps.Label>
        <DateInput3
          popoverProps={{ minimal: true, position: "bottom-left" }}
          dateFnsFormat="dd-MMM-yyyy"
          locale={enIN}
          value={state.date}
          onChange={(value) => {
            if (value) setState({ ...state, date: value });
          }}
        ></DateInput3>
      </comps.FormGroup>

      <comps.FormGroup>
        <comps.Label>Name / Memo</comps.Label>
        <comps.InputGroup
          placeholder="ex. Shawarma, Petrol"
          value={state.name}
          onValueChange={(value) => {
            setState({ ...state, name: value });
          }}
        ></comps.InputGroup>
      </comps.FormGroup>

      <comps.FormGroup>
        <comps.Label>Debit</comps.Label>
        <comps.InputGroup
          placeholder="ex. Shawarma, Petrol"
          type="number"
          leftIcon="minus"
          value={state.debit}
          onValueChange={(value) => {
            setState({ ...state, debit: value.toString() });
          }}
        ></comps.InputGroup>
      </comps.FormGroup>

      <comps.FormGroup>
        <comps.Label>Cerdit</comps.Label>
        <comps.InputGroup
          placeholder="ex. Salary"
          type="number"
          leftIcon="plus"
          onValueChange={(value) => {
            setState({ ...state, credit: value.toString() });
          }}
        ></comps.InputGroup>
      </comps.FormGroup>

      {currentEntry && (
        <comps.FormGroup>
          <comps.Button
            fill
            intent="primary"
            alignText="left"
            icon="caret-right"
            text="Update"
            className="mar-top"
            onClick={async () => {
              const resp = await UpdateEntry(currentEntry._id, state);
              if (resp.status === 200) {
                AccountToaster.show({
                  message: "Updated",
                  intent: "success",
                  timeout: 2000,
                  icon: "tick",
                });
                setTrigger((prev) => !prev);
              }
            }}
          />
          <comps.Button
            fill
            intent="danger"
            alignText="left"
            icon="trash"
            text="Delete"
            className="mar-top"
            onClick={async () => {
              const resp = await DeleteEntry(currentEntry._id);
              if (resp.status === 200) {
                AccountToaster.show({
                  message: "Deleted",
                  intent: "danger",
                  timeout: 2000,
                  icon: "tick",
                });
                setTrigger((prev) => !prev);
              }
            }}
          />
        </comps.FormGroup>
      )}

      {!currentEntry && (
        <comps.Button
          fill
          intent="primary"
          alignText="left"
          icon="caret-right"
          text="Add"
          onClick={async () => {
            const resp = await AddEntry(state);

            if (resp.status === 200) {
              AccountToaster.show({
                message: "Entry Added",
                intent: "success",
                timeout: 2000,
                icon: "tick",
              });
              setTrigger((prev) => !prev);
            }
          }}
        />
      )}
    </div>
  );
}
