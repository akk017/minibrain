import {
  Button,
  Checkbox,
  ControlGroup,
  Divider,
  FormGroup,
  InputGroup,
  MenuItem,
  Switch,
  TextArea,
} from "@blueprintjs/core";
import { DateInput3, DatePicker3 } from "@blueprintjs/datetime2";
import { Select } from "@blueprintjs/select";
import { useEffect, useState } from "react";
import { Form } from "react-router";

const ITEMS = [
  { value: "text", label: "Text" },
  { value: "text-area", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
];

interface Field {
  value: string;
  label: string;
}

export default function Module() {
  const [type, setType] = useState({ value: "text", label: "Text" });
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <div className="container">
      <h1 className="title">Add Module - Scheme Defition</h1>
      <form>
        {/* <FormGroup label="Field" labelFor="name">
                    <InputGroup id="name" placeholder="Field" defaultValue="Field" type="email" />
                </FormGroup>
                

                <FormGroup label="Type" labelFor="type">
                    <DateInput3 popoverProps={{ minimal: true, position: "bottom-left" }} />
                </FormGroup>
                <FormGroup label="Text Area" labelFor="Text Area">
                    <TextArea fill/>
                </FormGroup>

                <Divider /> */}

        {fields.map((field, index) => {
          return (
            <FormGroup key={index} label="Field" labelFor="name" fill>
                <ControlGroup>
                  <InputGroup
                    id="name"
                    placeholder="Field Name"
                    defaultValue="Field"
                    type="text"
                  />
                  <Select
                    items={ITEMS}
                    itemRenderer={(item) => {
                      return <MenuItem key={item.value} text={item.label} />;
                    }}
                    onItemSelect={() => {}}
                    popoverProps={{ minimal: true }}
                    filterable={false}
                  >
                    <Button
                      text={field.label}
                      rightIcon="double-caret-vertical"
                    />
                  </Select>
                </ControlGroup>
                <Checkbox>Required</Checkbox>
              </FormGroup>
          )
        })}
      </form>

      <div className="hflex">
        <Select
          items={ITEMS}
          itemRenderer={(item) => {
            return (
              <MenuItem
                key={item.value}
                text={item.label}
                onClick={() => setType(item)}
              />
            );
          }}
          onItemSelect={() => {}}
          popoverProps={{ minimal: true }}
          filterable={false}
        >
          <Button text={type.label} rightIcon="double-caret-vertical" />
        </Select>
        <Button
          text="Add Field"
          intent="primary"
          onClick={() => setFields([...fields, type])}
        />
      </div>
    </div>
  );
}
