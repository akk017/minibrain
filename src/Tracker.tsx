import * as comps from "@blueprintjs/core"
import { useEffect, useState } from "react"
import { AddEntry, DeleteEntry, GetAllEntry } from "./persistance"


export default function Tracker() {
    const [state, setState] = useState<string>("<reset>")
    const [all, setAll] = useState([])

    useEffect(() => {
        const get = async () => {
            const resp = await GetAllEntry(state)
            const data = await resp.json()
            if (data === null) return
            data.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
            setAll(data)
        }
        if (state === "<reset>" || state === "0") get()
    }, [state])

    return (
        <div className="container">
            <h3>Tracker</h3>
            <table className="bp5-html-table mb-table bp5-interactive">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Weight</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {all.map((item, index) => {
                        if (!item?.weight || !item?.date) return null

                        const fDate = new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          });
                        return <tr key={index}>
                            <td>{fDate}</td>
                            <td>{item.weight}</td>
                            <td><comps.Button minimal small intent="danger" onClick={
                                async () => {
                                    console.log(item._id)
                                    await DeleteEntry(item._id)
                                    const resp = await GetAllEntry(state)
                                    const data = await resp.json()
                                    if (data === null) return
                                    data.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
                                    setAll(data)
                                }
                            }>Delete Entry</comps.Button></td>
                        </tr>
                    })}
                </tbody>
            </table>

            <div className="hflex mar-top gap-10">
                <comps.InputGroup 
                    placeholder="Current Weight"
                    value={state}
                    onValueChange={(value) => {
                        setState(value)
                    }}
                />
                <comps.Button
                    text="Add Entry"
                    intent="primary"
                    icon="plus"
                    onClick={async () => {
                        setState("<reset>")
                        await AddEntry(state)
                    }}
                />
            </div>
        </div>
    )
}

export function TrackerChart() {
    return (
        <div className="container">
            <h3>Todo</h3>
        </div>
    )
}