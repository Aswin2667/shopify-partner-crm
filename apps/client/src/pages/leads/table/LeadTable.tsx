import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export default function LeadTable() {
  const tasks =  [
    {
      "id": "TASK-8782",
      "title": "You can't compress the program without quantifying the open-source SSD pixel!",
      "status": "in progress",
      "label": "documentation",
      "priority": "medium"
    },
    {
      "id": "TASK-3970",
      "title": "You can't index the transmitter without quantifying the haptic ASCII card!",
      "status": "todo",
      "label": "documentation",
      "priority": "medium"
    },
    {
      "id": "TASK-4473",
      "title": "You can't bypass the protocol without overriding the neural RSS program!",
      "status": "todo",
      "label": "documentation",
      "priority": "low"
    },
    {
      "id": "TASK-4136",
      "title": "You can't hack the hard drive without hacking the primary JSON program!",
      "status": "canceled",
      "label": "bug",
      "priority": "medium"
    },
    {
      "id": "TASK-3939",
      "title": "Use the back-end SQL firewall, then you can connect the neural hard drive!",
      "status": "done",
      "label": "feature",
      "priority": "low"
    },
    {
      "id": "TASK-2007",
      "title": "I'll input the back-end USB protocol, that should bandwidth the PCI system!",
      "status": "backlog",
      "label": "bug",
      "priority": "high"
    },
    {
      "id": "TASK-7516",
      "title": "Use the primary SQL program, then you can generate the auxiliary transmitter!",
      "status": "done",
      "label": "documentation",
      "priority": "medium"
    },
    {
      "id": "TASK-6906",
      "title": "Try to back up the DRAM system, maybe it will reboot the online transmitter!",
      "status": "done",
      "label": "feature",
      "priority": "high"
    },
    {
      "id": "TASK-5207",
      "title": "The SMS interface is down, copy the bluetooth bus so we can quantify the VGA card!",
      "status": "in progress",
      "label": "bug",
      "priority": "low"
    }
  ]

  return (
    <div className="p-5">
        <DataTable data={tasks} columns={columns} />
    </div>
  )
}